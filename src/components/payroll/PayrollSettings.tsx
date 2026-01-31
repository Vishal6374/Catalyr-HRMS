import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '@/services/apiService';
import { toast } from 'sonner';
import { Save, Info, Wallet } from 'lucide-react';
import Loader from '@/components/ui/Loader';

export function PayrollSettings() {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['payroll-settings'],
        queryFn: async () => {
            const { data } = await payrollService.getSettings();
            return data;
        },
    });

    const [formData, setFormData] = useState({
        default_pf_percentage: 12.00,
        default_esi_percentage: 0.75,
        default_absent_deduction_type: 'percentage',
        default_absent_deduction_value: 3.33,
    });

    // Update form when settings load
    useEffect(() => {
        if (settings) {
            setFormData({
                default_pf_percentage: settings.default_pf_percentage || 12.00,
                default_esi_percentage: settings.default_esi_percentage || 0.75,
                default_absent_deduction_type: settings.default_absent_deduction_type || 'percentage',
                default_absent_deduction_value: settings.default_absent_deduction_value || 3.33,
            });
        }
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => payrollService.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payroll-settings'] });
            toast.success('Payroll settings updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update settings');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.default_pf_percentage < 0 || formData.default_pf_percentage > 100) {
            toast.error('PF percentage must be between 0 and 100');
            return;
        }

        if (formData.default_esi_percentage < 0 || formData.default_esi_percentage > 100) {
            toast.error('ESI percentage must be between 0 and 100');
            return;
        }

        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-center">
                        <Loader size="default" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Payroll Settings
                </CardTitle>
                <CardDescription>
                    Configure default deduction rules for payroll calculation
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="default_pf_percentage">Default PF Percentage (%)</Label>
                            <Input
                                id="default_pf_percentage"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={formData.default_pf_percentage}
                                onChange={(e) => setFormData({ ...formData, default_pf_percentage: parseFloat(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Percentage of basic salary
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="default_esi_percentage">Default ESI Percentage (%)</Label>
                            <Input
                                id="default_esi_percentage"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={formData.default_esi_percentage}
                                onChange={(e) => setFormData({ ...formData, default_esi_percentage: parseFloat(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Percentage of gross salary
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50/50 space-y-4">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <h4 className="font-medium text-sm">Absent Deduction Rule</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Deduction Type</Label>
                                <select
                                    className="w-full p-2 border rounded-md h-10 bg-background text-sm"
                                    value={formData.default_absent_deduction_type}
                                    onChange={(e) => setFormData({ ...formData, default_absent_deduction_type: e.target.value as any })}
                                >
                                    <option value="percentage">Percentage (of Monthly Salary)</option>
                                    <option value="amount">Fixed Amount (per Day)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="default_absent_deduction_value">
                                    {formData.default_absent_deduction_type === 'percentage' ? 'Deduction Percentage (%)' : 'Deduction Amount (₹)'}
                                </Label>
                                <Input
                                    id="default_absent_deduction_value"
                                    type="number"
                                    step="0.01"
                                    value={formData.default_absent_deduction_value}
                                    onChange={(e) => setFormData({ ...formData, default_absent_deduction_value: parseFloat(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.default_absent_deduction_type === 'percentage'
                                        ? 'Percentage of monthly salary deducted per absent day (e.g. 3.33% for ~1 day)'
                                        : 'Fixed amount deducted per absent day'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={updateMutation.isPending} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
