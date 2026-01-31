import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

// Import simplified payroll components
import PayrollDashboardSimple from './payroll/PayrollDashboardSimple';
import PayrollProcess from './payroll/PayrollProcess';
import MyPayslips from './payroll/MyPayslips';
import BasicPayManager from './payroll/BasicPayManager';
import { PayrollSettings } from '@/components/payroll/PayrollSettings';

export default function PayrollUnified() {
    const { isHR } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || (isHR ? 'dashboard' : 'my-payslips');

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in  mx-auto">
                <PageHeader
                    title="Payroll Management"
                    description={isHR ? "Process payroll for employees" : "View your salary slips"}
                />

                {isHR ? (
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                            <TabsTrigger value="basic-pay">Basic Pay</TabsTrigger>
                            <TabsTrigger value="process">Process Payroll</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="my-payslips">My Payslips</TabsTrigger>
                        </TabsList>

                        <TabsContent value="dashboard" className="mt-6">
                            <PayrollDashboardSimple />
                        </TabsContent>

                        <TabsContent value="basic-pay" className="mt-6">
                            <BasicPayManager />
                        </TabsContent>

                        <TabsContent value="process" className="mt-6">
                            <PayrollProcess />
                        </TabsContent>

                        <TabsContent value="settings" className="mt-6">
                            <PayrollSettings />
                        </TabsContent>

                        <TabsContent value="my-payslips" className="mt-6">
                            <MyPayslips />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <MyPayslips />
                )}
            </div>
        </MainLayout>
    );
}
