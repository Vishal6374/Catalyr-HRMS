import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveRequest } from '@/types/hrms';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, CalendarDays, Check, X, Clock, Settings, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveService, employeeService, leaveLimitService, leaveTypeService } from '@/services/apiService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageLoader } from '@/components/ui/page-loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  is_paid: boolean;
  default_days_per_year: number;
  status: 'active' | 'inactive';
}

export default function Leaves() {
  const { isHR, user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [leaveLimits, setLeaveLimits] = useState({ casual_leave: 12, sick_leave: 12, earned_leave: 15 });

  const [formData, setFormData] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [isSingleDay, setIsSingleDay] = useState(false);
  const [editingLeave, setEditingLeave] = useState<any>(null);

  // Leave Type states
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    description: '',
    is_paid: true,
    default_days_per_year: 12,
    status: 'active'
  });

  // Fetch leave requests
  const { data: leaves = [], isLoading: leavesLoading } = useQuery({
    queryKey: ['leaves', statusFilter],
    queryFn: async () => {
      const { data } = await leaveService.getRequests({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      return data;
    },
  });

  // Fetch leave types
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data } = await leaveTypeService.getAll();
      return data;
    },
  });

  // Fetch leave limits
  useQuery({
    queryKey: ['leave-limits'],
    queryFn: async () => {
      const { data } = await leaveLimitService.get();
      if (data) {
        setLeaveLimits({
          casual_leave: data.casual_leave,
          sick_leave: data.sick_leave,
          earned_leave: data.earned_leave
        });
      }
      return data;
    },
    enabled: isHR && isSettingsOpen,
  });

  // Update Leave Limits Mutation
  const updateLimitsMutation = useMutation({
    mutationFn: (data: any) => leaveLimitService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-limits'] });
      setIsSettingsOpen(false);
      toast.success('Leave limits updated successfully');
    },
    onError: (error: any) => toast.error('Failed to update leave limits'),
  });

  // Leave Type Mutations
  const createTypeMutation = useMutation({
    mutationFn: (data: any) => leaveTypeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      setIsTypeDialogOpen(false);
      toast.success('Leave type created');
      resetTypeForm();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to create type'),
  });

  const updateTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => leaveTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      setIsTypeDialogOpen(false);
      toast.success('Leave type updated');
      resetTypeForm();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update type'),
  });

  const deleteTypeMutation = useMutation({
    mutationFn: (id: string) => leaveTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-types'] });
      toast.success('Leave type deleted');
    },
  });

  // Fetch leave balances
  const { data: balances = [] } = useQuery({
    queryKey: ['leave-balances'],
    queryFn: async () => {
      const { data } = await leaveService.getBalances();
      return data;
    },
  });

  // Fetch employees for HR view
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await employeeService.getAll({ status: 'active' });
      return data.employees || [];
    },
    enabled: isHR,
  });

  // Mutations for HR actions
  const approveMutation = useMutation({
    mutationFn: ({ id, remarks }: any) => leaveService.approve(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave approved');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to approve leave'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, remarks }: any) => leaveService.reject(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success('Leave rejected');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to reject leave'),
  });

  const applyMutation = useMutation({
    mutationFn: (data: any) => leaveService.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      setIsDialogOpen(false);
      toast.success('Leave application submitted');
      resetLeaveForm();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to apply for leave'),
  });

  const updateLeaveMutation = useMutation({
    mutationFn: ({ id, data }: any) => leaveService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      setIsDialogOpen(false);
      toast.success('Leave updated successfully');
      resetLeaveForm();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update leave'),
  });

  const deleteLeaveMutation = useMutation({
    mutationFn: leaveService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      toast.success('Leave request deleted');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete leave'),
  });

  const resetLeaveForm = () => {
    setFormData({ leave_type: 'sick', start_date: '', end_date: '', reason: '' });
    setEditingLeave(null);
    setIsSingleDay(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    if (isSingleDay) {
      data.end_date = data.start_date;
    }

    if (editingLeave) {
      updateLeaveMutation.mutate({ id: editingLeave.id, data });
    } else {
      applyMutation.mutate(data);
    }
  };

  const handleEditLeave = (leave: any) => {
    setEditingLeave(leave);
    setFormData({
      leave_type: leave.leave_type,
      start_date: leave.start_date ? format(new Date(leave.start_date), 'yyyy-MM-dd') : '',
      end_date: leave.end_date ? format(new Date(leave.end_date), 'yyyy-MM-dd') : '',
      reason: leave.reason,
    });
    setIsSingleDay(leave.start_date === leave.end_date);
    setIsDialogOpen(true);
  };

  const handleDeleteLeave = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      deleteLeaveMutation.mutate(id);
    }
  };

  const handleUpdateLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateLimitsMutation.mutate(leaveLimits);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      updateTypeMutation.mutate({ id: selectedType.id, data: typeFormData });
    } else {
      createTypeMutation.mutate(typeFormData);
    }
  };

  const resetTypeForm = () => {
    setTypeFormData({
      name: '',
      description: '',
      is_paid: true,
      default_days_per_year: 12,
      status: 'active'
    });
    setSelectedType(null);
  };

  const handleEditType = (type: LeaveType) => {
    setSelectedType(type);
    setTypeFormData({
      name: type.name,
      description: type.description || '',
      is_paid: type.is_paid,
      default_days_per_year: type.default_days_per_year,
      status: type.status
    });
    setIsTypeDialogOpen(true);
  };

  const myLeaves = leaves.filter((l: any) => l.employee_id === user?.id);
  const myBalances = balances.filter((lb: any) => lb.employee_id === user?.id);
  const getEmployeeDetails = (employeeId: string) => employees.find((e: any) => e.id === employeeId);

  if (leavesLoading) {
    return <PageLoader />;
  }

  const hrColumns: Column<any>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cell: (leave) => {
        const emp = getEmployeeDetails(leave.employee_id);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={emp?.avatar} />
              <AvatarFallback>{emp?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{emp?.name}</p>
              <p className="text-xs text-muted-foreground">{emp?.employee_id}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'type', header: 'Type', cell: (leave) => <span className="capitalize">{leave.leave_type}</span> },
    {
      key: 'dates',
      header: 'Dates',
      cell: (leave) => (
        <div>
          <p className="text-sm">{leave.start_date ? format(new Date(leave.start_date), 'MMM d') : ''} - {leave.end_date ? format(new Date(leave.end_date), 'MMM d') : ''}</p>
          <p className="text-xs text-muted-foreground">{leave.days} days</p>
        </div>
      ),
    },
    { key: 'reason', header: 'Reason', cell: (leave) => <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">{leave.reason}</p> },
    { key: 'status', header: 'Status', cell: (leave) => <StatusBadge status={leave.status} /> },
    {
      key: 'actions',
      header: '',
      cell: (leave) => leave.status === 'pending' ? (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-success"
            onClick={() => approveMutation.mutate({ id: leave.id })}
          >
            <Check className="w-3 h-3 mr-1" />Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => rejectMutation.mutate({ id: leave.id })}
          >
            <X className="w-3 h-3 mr-1" />Reject
          </Button>
        </div>
      ) : null,
    },
  ];

  const employeeColumns: Column<any>[] = [
    { key: 'type', header: 'Type', cell: (leave) => <span className="capitalize font-medium">{leave.leave_type}</span> },
    {
      key: 'dates',
      header: 'Dates',
      cell: (leave) => (
        <div>
          <p className="text-sm">{leave.start_date ? format(new Date(leave.start_date), 'MMM d') : ''} - {leave.end_date ? format(new Date(leave.end_date), 'MMM d') : ''}</p>
          <p className="text-xs text-muted-foreground">{leave.days} days</p>
        </div>
      ),
    },
    { key: 'reason', header: 'Reason', cell: (leave) => <p className="text-sm text-muted-foreground">{leave.reason}</p> },
    { key: 'status', header: 'Status', cell: (leave) => <StatusBadge status={leave.status} /> },
    {
      key: 'actions',
      header: '',
      cell: (leave) => leave.status === 'pending' ? (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEditLeave(leave)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteLeave(leave.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ) : null,
    },
  ];

  const typeColumns: Column<LeaveType>[] = [
    { key: 'name', header: 'Name', cell: (type) => <span className="font-bold text-primary">{type.name}</span> },
    {
      key: 'is_paid',
      header: 'Paid',
      cell: (type) => type.is_paid ?
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Yes</span> :
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">No</span>
    },
    { key: 'default_days_per_year', header: 'Limit', cell: (type) => <span>{type.default_days_per_year}d</span> },
    {
      key: 'actions',
      header: '',
      cell: (type) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditType(type)}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
            if (confirm('Delete this leave type?')) deleteTypeMutation.mutate(type.id);
          }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <PageHeader title="Leaves" description={isHR ? 'Manage employee leave requests' : 'Apply and track your leaves'} />
        {isHR ? (
          <Tabs defaultValue="team" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="team">Team Requests</TabsTrigger>
                <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <TabsContent value="my-leaves" className="m-0">
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Apply Leave
                  </Button>
                </TabsContent>
                <TabsContent value="team" className="m-0">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </TabsContent>
              </div>
            </div>

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div><div><p className="text-xl sm:text-2xl font-bold">{leaves.filter((l: any) => l.status === 'pending').length}</p><p className="text-xs text-muted-foreground">Pending</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><Check className="w-5 h-5 text-success" /></div><div><p className="text-xl sm:text-2xl font-bold">{leaves.filter((l: any) => l.status === 'approved').length}</p><p className="text-xs text-muted-foreground">Approved</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><X className="w-5 h-5 text-destructive" /></div><div><p className="text-xl sm:text-2xl font-bold">{leaves.filter((l: any) => l.status === 'rejected').length}</p><p className="text-xs text-muted-foreground">Rejected</p></div></div></CardContent></Card>
                <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center"><Clock className="w-5 h-5 text-info" /></div><div><p className="text-xl sm:text-2xl font-bold">{leaves.filter((l: any) => l.status === 'approved' && new Date(l.start_date) <= new Date() && new Date(l.end_date) >= new Date()).length}</p><p className="text-xs text-muted-foreground">On Leave Now</p></div></div></CardContent></Card>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Leave Requests</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <DataTable
                    columns={hrColumns}
                    data={statusFilter === 'all' ? leaves : leaves.filter((l: any) => l.status === statusFilter)}
                    keyExtractor={(leave: any) => leave.id}
                    emptyMessage="No leave requests found"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-leaves" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {myBalances.map((balance: any) => (
                  <Card key={balance.leave_type}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground capitalize">{balance.leave_type}</p>
                          <p className="text-xl sm:text-2xl font-bold">{balance.remaining}</p>
                          <p className="text-xs text-muted-foreground">of {balance.total} days</p>
                        </div>
                        <CalendarDays className="w-8 h-8 text-primary/20" />
                      </div>
                      <div className="mt-3 w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(balance.remaining / balance.total) * 100}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Leave History</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <DataTable
                    columns={employeeColumns}
                    data={myLeaves.filter((l: any) => statusFilter === 'all' || l.status === statusFilter)}
                    keyExtractor={(leave: any) => leave.id}
                    emptyMessage="No leave requests found"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button onClick={() => setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Apply Leave</Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {myBalances.map((balance: any) => (
                <Card key={balance.leave_type}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground capitalize">{balance.leave_type}</p>
                        <p className="text-xl sm:text-2xl font-bold">{balance.remaining}</p>
                        <p className="text-xs text-muted-foreground">of {balance.total} days</p>
                      </div>
                      <CalendarDays className="w-8 h-8 text-primary/20" />
                    </div>
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(balance.remaining / balance.total) * 100}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">My Leave History</h3>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <DataTable
                    columns={employeeColumns}
                    data={myLeaves.filter((l: any) => statusFilter === 'all' || l.status === statusFilter)}
                    keyExtractor={(leave: any) => leave.id}
                    emptyMessage="No leave requests found"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Apply Leave Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetLeaveForm();
        }}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLeave ? 'Edit Leave Request' : 'Apply for Leave'}</DialogTitle>
              <DialogDescription>{editingLeave ? 'Update your leave request details.' : 'Submit a new leave request.'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="single-day">Single Day Leave</Label>
                  <p className="text-xs text-muted-foreground">Toggle for one day leave request</p>
                </div>
                <Switch
                  id="single-day"
                  checked={isSingleDay}
                  onCheckedChange={setIsSingleDay}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select value={formData.leave_type} onValueChange={(val) => setFormData({ ...formData, leave_type: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {leaveTypes.filter((t: any) => t.status === 'active').map((type: any) => (
                      <SelectItem key={type.id} value={type.name.toLowerCase()}>
                        {type.name}
                      </SelectItem>
                    ))}
                    {leaveTypes.filter((t: any) => t.status === 'active').length === 0 && (
                      <>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="earned">Privilege / Earned Leave</SelectItem>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className={cn("grid gap-4", isSingleDay ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                <div className="space-y-2">
                  <Label>{isSingleDay ? 'Date' : 'Start Date'}</Label>
                  <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                </div>
                {!isSingleDay && (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={applyMutation.isPending || updateLeaveMutation.isPending}>
                  {(applyMutation.isPending || updateLeaveMutation.isPending) ? 'Processing...' : (editingLeave ? 'Update Request' : 'Submit Request')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Leave Settings Dialog - HR Only */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Leave Module Settings</DialogTitle>
              <DialogDescription>Configure leave policies and categories.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="limits" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="limits">Annual Limits</TabsTrigger>
                <TabsTrigger value="types">Manage Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="limits">
                <form onSubmit={handleUpdateLimits} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="casual">Casual Leave (Days/Year)</Label>
                    <Input
                      id="casual"
                      type="number"
                      min="0"
                      value={leaveLimits.casual_leave}
                      onChange={(e) => setLeaveLimits({ ...leaveLimits, casual_leave: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sick">Sick Leave (Days/Year)</Label>
                    <Input
                      id="sick"
                      type="number"
                      min="0"
                      value={leaveLimits.sick_leave}
                      onChange={(e) => setLeaveLimits({ ...leaveLimits, sick_leave: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="earned">Earned/Privilege Leave (Days/Year)</Label>
                    <Input
                      id="earned"
                      type="number"
                      min="0"
                      value={leaveLimits.earned_leave}
                      onChange={(e) => setLeaveLimits({ ...leaveLimits, earned_leave: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={updateLimitsMutation.isPending}>
                      {updateLimitsMutation.isPending ? 'Saving...' : 'Save Limits'}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>

              <TabsContent value="types">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Leave Categories</h4>
                    <Button size="sm" onClick={() => { resetTypeForm(); setIsTypeDialogOpen(true); }}>
                      <Plus className="w-4 h-4 mr-2" /> Add Type
                    </Button>
                  </div>
                  <div className="border rounded-lg">
                    <DataTable
                      columns={typeColumns}
                      data={leaveTypes}
                      keyExtractor={(t) => t.id}
                      emptyMessage="No custom types."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Leave Type Edit Dialog */}
        <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedType ? 'Edit Type' : 'New Leave Type'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTypeSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="typeName">Name</Label>
                <Input
                  id="typeName"
                  value={typeFormData.name}
                  onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeDesc">Description</Label>
                <Textarea
                  id="typeDesc"
                  value={typeFormData.description}
                  onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeDays">Annual Limit</Label>
                  <Input
                    id="typeDays"
                    type="number"
                    value={typeFormData.default_days_per_year}
                    onChange={(e) => setTypeFormData({ ...typeFormData, default_days_per_year: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="typePaid"
                    checked={typeFormData.is_paid}
                    onCheckedChange={(checked) => setTypeFormData({ ...typeFormData, is_paid: checked })}
                  />
                  <Label htmlFor="typePaid">Paid Leave</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={typeFormData.status === 'active' ? 'default' : 'outline'}
                    className="flex-1 h-8 text-xs"
                    onClick={() => setTypeFormData({ ...typeFormData, status: 'active' })}
                  >
                    Active
                  </Button>
                  <Button
                    type="button"
                    variant={typeFormData.status === 'inactive' ? 'destructive' : 'outline'}
                    className="flex-1 h-8 text-xs"
                    onClick={() => setTypeFormData({ ...typeFormData, status: 'inactive' })}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsTypeDialogOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={createTypeMutation.isPending || updateTypeMutation.isPending}>
                  {selectedType ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
