import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/data/mockData';
import { Users, CalendarCheck, Clock, MessageSquareWarning, Wallet, UserCheck } from 'lucide-react';

export default function Dashboard() {
  const { isHR, user } = useAuth();
  const stats = getDashboardStats();

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader title={isHR ? 'HR Dashboard' : `Welcome, ${user?.name?.split(' ')[0]}!`} description="Here's what's happening today." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.activeEmployees}</p><p className="text-xs text-muted-foreground">Active Employees</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><UserCheck className="w-5 h-5 text-success" /></div><div><p className="text-2xl font-bold">{stats.presentToday}</p><p className="text-xs text-muted-foreground">Present Today</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div><div><p className="text-2xl font-bold">{stats.pendingLeaves + stats.pendingReimbursements}</p><p className="text-xs text-muted-foreground">Pending Approvals</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center"><MessageSquareWarning className="w-5 h-5 text-info" /></div><div><p className="text-2xl font-bold">{stats.activeComplaints}</p><p className="text-xs text-muted-foreground">Active Complaints</p></div></div></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Wallet className="w-4 h-4" />Payroll Summary</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Status</p><p className="font-semibold capitalize">{stats.payrollStatus}</p></div><div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Employees</p><p className="font-semibold">{stats.totalEmployees}</p></div><div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Total</p><p className="font-semibold">${stats.totalPayroll.toLocaleString()}</p></div></div></CardContent></Card>
      </div>
    </MainLayout>
  );
}
