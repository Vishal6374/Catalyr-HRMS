import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { complaints, employees } from '@/data/mockData';
import { Complaint } from '@/types/hrms';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, MessageSquareWarning, AlertCircle, Clock, CheckCircle2, Send, User } from 'lucide-react';
import { format } from 'date-fns';

export default function Complaints() {
  const { isHR, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    description: '',
    category: 'General',
    priority: 'medium',
    isAnonymous: false,
  });
  const [response, setResponse] = useState('');

  // Filter complaints for employee view
  const myComplaints = complaints.filter(
    (c) => c.employeeId === user?.id || (c.isAnonymous && c.employeeId === '0')
  );

  const getEmployeeDetails = (employeeId: string) => {
    if (employeeId === '0') return null; // Anonymous
    return employees.find((e) => e.id === employeeId);
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailSheetOpen(true);
  };

  // HR View columns
  const hrColumns: Column<Complaint>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cell: (c) => {
        if (c.isAnonymous) {
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground italic">Anonymous</span>
            </div>
          );
        }
        const emp = getEmployeeDetails(c.employeeId);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={emp?.avatar} />
              <AvatarFallback>{emp?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{emp?.name}</span>
          </div>
        );
      },
    },
    {
      key: 'subject',
      header: 'Subject',
      cell: (c) => (
        <div>
          <p className="font-medium text-sm">{c.subject}</p>
          <p className="text-xs text-muted-foreground">{c.category}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (c) => <StatusBadge status={c.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'date',
      header: 'Submitted',
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(c.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (c) => (
        <Button size="sm" variant="outline" onClick={() => handleViewComplaint(c)}>
          View
        </Button>
      ),
    },
  ];

  // Employee View columns
  const employeeColumns: Column<Complaint>[] = [
    {
      key: 'subject',
      header: 'Subject',
      cell: (c) => (
        <div>
          <p className="font-medium">{c.subject}</p>
          <p className="text-xs text-muted-foreground">{c.category}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (c) => <StatusBadge status={c.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'date',
      header: 'Submitted',
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(c.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (c) => (
        <Button size="sm" variant="outline" onClick={() => handleViewComplaint(c)}>
          View
        </Button>
      ),
    },
  ];

  const handleCreateComplaint = () => {
    console.log('Creating complaint:', newComplaint);
    setIsCreateDialogOpen(false);
    setNewComplaint({
      subject: '',
      description: '',
      category: 'General',
      priority: 'medium',
      isAnonymous: false,
    });
  };

  const handleSendResponse = () => {
    console.log('Sending response:', response);
    setResponse('');
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Complaints"
          description={isHR ? 'Manage and respond to employee complaints' : 'Raise and track your complaints'}
        >
          {!isHR && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Raise Complaint
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Raise a Complaint</DialogTitle>
                  <DialogDescription>
                    Submit your concern to HR for review
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="Brief description of the issue"
                      value={newComplaint.subject}
                      onChange={(e) =>
                        setNewComplaint({ ...newComplaint, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newComplaint.category}
                        onValueChange={(value) =>
                          setNewComplaint({ ...newComplaint, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Payroll">Payroll</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newComplaint.priority}
                        onValueChange={(value) =>
                          setNewComplaint({ ...newComplaint, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Provide details about your concern..."
                      value={newComplaint.description}
                      onChange={(e) =>
                        setNewComplaint({ ...newComplaint, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={newComplaint.isAnonymous}
                      onCheckedChange={(checked) =>
                        setNewComplaint({ ...newComplaint, isAnonymous: !!checked })
                      }
                    />
                    <Label htmlFor="anonymous" className="text-sm font-normal">
                      Submit anonymously
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateComplaint}>Submit Complaint</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </PageHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(isHR ? complaints : myComplaints).filter((c) => c.status === 'open').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(isHR ? complaints : myComplaints).filter((c) => c.status === 'in_progress').length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(isHR ? complaints : myComplaints).filter((c) => c.status === 'resolved').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <MessageSquareWarning className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(isHR ? complaints : myComplaints).filter((c) => c.priority === 'urgent').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isHR ? 'All Complaints' : 'My Complaints'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={isHR ? hrColumns : employeeColumns}
              data={
                isHR
                  ? filteredComplaints
                  : myComplaints.filter(
                      (c) =>
                        (statusFilter === 'all' || c.status === statusFilter) &&
                        (priorityFilter === 'all' || c.priority === priorityFilter)
                    )
              }
              keyExtractor={(c) => c.id}
              emptyMessage="No complaints found"
            />
          </CardContent>
        </Card>

        {/* Complaint Detail Sheet */}
        <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
          <SheetContent className="sm:max-w-lg">
            {selectedComplaint && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedComplaint.subject}</SheetTitle>
                  <SheetDescription>
                    Submitted on {format(new Date(selectedComplaint.createdAt), 'MMMM d, yyyy')}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Status & Priority */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={selectedComplaint.status} />
                    <StatusBadge status={selectedComplaint.priority} />
                    {selectedComplaint.isAnonymous && (
                      <span className="text-xs text-muted-foreground italic">Anonymous</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="text-sm font-medium">{selectedComplaint.category}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{selectedComplaint.description}</p>
                    </div>
                  </div>

                  {/* Response */}
                  {selectedComplaint.response && (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-xs text-muted-foreground mb-1">HR Response</p>
                      <p className="text-sm">{selectedComplaint.response}</p>
                      {selectedComplaint.respondedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Responded on {format(new Date(selectedComplaint.respondedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* HR Response Form */}
                  {isHR && selectedComplaint.status !== 'closed' && (
                    <div className="space-y-3">
                      <Label>Send Response</Label>
                      <Textarea
                        placeholder="Type your response..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSendResponse}>
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                        <Select defaultValue={selectedComplaint.status}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  );
}
