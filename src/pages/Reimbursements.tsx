import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, DollarSign, FileText, Check, X, Paperclip, Upload, Eye } from 'lucide-react';
import { useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reimbursementService } from '@/services/apiService';
import { toast } from 'sonner';
import { PageLoader } from '@/components/ui/page-loader';
import Loader from '@/components/ui/Loader';

export default function Reimbursements() {
  const { isHR, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReimburse, setSelectedReimburse] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'travel',
    description: '',
    receipt_url: ''
  });
  const [remarks, setRemarks] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch Reimbursements
  const { data: reimbursements = [], isLoading } = useQuery({
    queryKey: ['reimbursements', statusFilter],
    queryFn: async () => {
      const { data } = await reimbursementService.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      return data;
    },
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: reimbursementService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reimbursements'] });
      setIsDialogOpen(false);
      toast.success('Reimbursement submitted successfully');
      resetForm();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to submit reimbursement'),
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: ({ id }: any) => reimbursementService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reimbursements'] });
      toast.success('Reimbursement approved');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to approve reimbursement'),
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, remarks }: any) => reimbursementService.reject(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reimbursements'] });
      setIsRejectDialogOpen(false);
      toast.success('Reimbursement rejected');
      setRemarks('');
      setSelectedReimburse(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to reject reimbursement'),
  });

  const uploadMutation = useMutation({
    mutationFn: reimbursementService.uploadReceipt,
    onSuccess: (response) => {
      setFormData(prev => ({ ...prev, receipt_url: response.data.url }));
      toast.success('Receipt uploaded successfully');
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload receipt');
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', category: 'travel', description: '', receipt_url: '' });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openRejectDialog = (reimburse: any) => {
    setSelectedReimburse(reimburse);
    setRemarks('');
    setIsRejectDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, amount: Number(formData.amount) });
  };

  const hrColumns: Column<any>[] = [
    {
      key: 'employee',
      header: 'Employee',
      cell: (reimburse) => (
        <div>
          <p className="font-medium">{reimburse.employee?.name}</p>
          <p className="text-xs text-muted-foreground">{reimburse.employee?.employee_id}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', cell: (reimburse) => reimburse.category },
    { key: 'amount', header: 'Amount', cell: (reimburse) => `₹${reimburse.amount.toLocaleString()}` },
    { key: 'description', header: 'Description', cell: (reimburse) => <p className="text-sm text-muted-foreground truncate max-w-[200px]">{reimburse.description}</p> },
    { key: 'date', header: 'Date', cell: (reimburse) => <span className="text-sm text-muted-foreground">{reimburse.date ? format(new Date(reimburse.date), 'MMM d, yyyy') : '-'}</span> },
    { key: 'status', header: 'Status', cell: (reimburse) => <StatusBadge status={reimburse.status} /> },
    {
      key: 'actions',
      header: '',
      cell: (reimburse) => (
        <div className="flex items-center gap-1">
          {reimburse.receipt_url && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(reimburse.receipt_url, '_blank')}>
              <Paperclip className="w-4 h-4" />
            </Button>
          )}
          {reimburse.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-success hover:text-success hover:bg-success/10"
                onClick={() => approveMutation.mutate({ id: reimburse.id })}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => openRejectDialog(reimburse)}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const employeeColumns: Column<any>[] = [
    { key: 'category', header: 'Category', cell: (reimburse) => reimburse.category },
    { key: 'amount', header: 'Amount', cell: (reimburse) => `₹${reimburse.amount.toLocaleString()}` },
    { key: 'description', header: 'Description', cell: (reimburse) => <p className="text-sm text-muted-foreground truncate max-w-[200px]">{reimburse.description}</p> },
    { key: 'date', header: 'Date', cell: (reimburse) => <span className="text-sm text-muted-foreground">{reimburse.date ? format(new Date(reimburse.date), 'MMM d, yyyy') : '-'}</span> },
    { key: 'status', header: 'Status', cell: (reimburse) => <StatusBadge status={reimburse.status} /> },
    { key: 'remarks', header: 'Remarks', cell: (reimburse) => <p className="text-sm text-muted-foreground truncate max-w-[150px]">{reimburse.remarks || '-'}</p> },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  const myReimbursements = reimbursements.filter((r: any) => r.employee_id === user?.id);

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <PageHeader title="Reimbursements" description={isHR ? 'Manage employee reimbursement claims' : 'Submit and track reimbursement claims'} />

        {isHR ? (
          <Tabs defaultValue="team" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="team">Team Claims</TabsTrigger>
                <TabsTrigger value="my-claims">My Claims</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <TabsContent value="my-claims" className="m-0">
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Claim
                  </Button>
                </TabsContent>
              </div>
            </div>

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-xl sm:text-2xl font-bold">{reimbursements.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {reimbursements.filter((r: any) => r.status === 'pending').length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ₹{reimbursements
                      .filter((r: any) => r.status === 'approved')
                      .reduce((sum: number, r: any) => sum + Number(r.amount), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
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

              <DataTable
                columns={hrColumns}
                data={statusFilter === 'all' ? reimbursements : reimbursements.filter((r: any) => r.status === statusFilter)}
                keyExtractor={(reimburse) => reimburse.id}
                emptyMessage="No reimbursement claims found"
              />
            </TabsContent>

            <TabsContent value="my-claims" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-xl sm:text-2xl font-bold">{myReimbursements.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {myReimbursements.filter((r: any) => r.status === 'pending').length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ₹{myReimbursements
                      .filter((r: any) => r.status === 'approved')
                      .reduce((sum: number, r: any) => sum + Number(r.amount), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
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

              <DataTable
                columns={employeeColumns}
                data={statusFilter === 'all' ? myReimbursements : myReimbursements.filter((r: any) => r.status === statusFilter)}
                keyExtractor={(reimburse) => reimburse.id}
                emptyMessage="No reimbursement claims found"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="p-4 rounded-xl bg-card border">
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-xl sm:text-2xl font-bold">{myReimbursements.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border">
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {myReimbursements.filter((r: any) => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold">
                  ₹{myReimbursements
                    .filter((r: any) => r.status === 'approved')
                    .reduce((sum: number, r: any) => sum + Number(r.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
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

            <DataTable
              columns={employeeColumns}
              data={statusFilter === 'all' ? myReimbursements : myReimbursements.filter((r: any) => r.status === statusFilter)}
              keyExtractor={(reimburse) => reimburse.id}
              emptyMessage="No reimbursement claims found"
            />
          </>
        )}

        {/* Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Reimbursement Claim</DialogTitle>
              <DialogDescription>Submit a new claim for expense reimbursement.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about the expense..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Receipt / Invoice</Label>
                <div
                  className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                  {isUploading ? (
                    <Loader size="default" />
                  ) : formData.receipt_url ? (
                    <div className="flex items-center gap-2 text-success font-medium">
                      <FileText className="w-6 h-6" />
                      <span>Receipt Uploaded</span>
                      <Eye className="w-4 h-4 ml-2 text-muted-foreground hover:text-primary" onClick={(e) => {
                        e.stopPropagation();
                        window.open(formData.receipt_url, '_blank');
                      }} />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload receipt</p>
                      <p className="text-xs text-muted-foreground">PDF or Images (Max 10MB)</p>
                    </>
                  )}
                </div>
                {formData.receipt_url && (
                  <p className="text-[10px] text-muted-foreground truncate max-w-full italic">
                    File: {formData.receipt_url.split('/').pop()}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader size="small" variant="white" className="mr-2" />}
                  Submit Claim
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reject Reimbursement</DialogTitle>
              <DialogDescription>Please provide a reason for rejection.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Reason for rejection..."
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => selectedReimburse && rejectMutation.mutate({ id: selectedReimburse.id, remarks })}
                  disabled={!remarks || rejectMutation.isPending}
                >
                  {rejectMutation.isPending && <Loader size="small" variant="white" className="mr-2" />}
                  Reject
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
