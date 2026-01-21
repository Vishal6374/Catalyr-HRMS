import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { SalarySlip } from "@/types/hrms";
import { useAuth } from "@/contexts/AuthContext";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface SalarySlipDialogProps {
    isOpen: boolean;
    onClose: () => void;
    slip: SalarySlip | null;
    employeeName?: string;
    employeeId?: string;
    department?: string;
    designation?: string;
    canEdit?: boolean;
}

export function SalarySlipDialog({
    isOpen,
    onClose,
    slip,
    employeeName,
    employeeId,
    department,
    designation,
    canEdit
}: SalarySlipDialogProps) {
    const { user } = useAuth();

    if (!slip) return null;

    const handleDownload = async () => {
        const element = document.getElementById('salary-slip');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Salary_Slip_${slip.year}_${slip.month}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:overflow-visible print:max-h-none print:max-w-none print:h-auto print:block">
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #salary-slip, #salary-slip * {
                            visibility: visible;
                        }
                        #salary-slip {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 20px !important;
                            border: none !important;
                            box-shadow: none !important;
                            background: white !important;
                            z-index: 9999;
                        }
                        /* Hide everything else */
                        .animate-fade-in { display: none; }
                    }
                `}</style>
                <DialogHeader className="print:hidden">
                    <DialogTitle>Salary Slip Preview</DialogTitle>
                </DialogHeader>

                <div className="p-6 bg-white text-black border rounded-lg shadow-sm print:shadow-none print:border-none" id="salary-slip">
                    {/* Header */}
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold uppercase tracking-wider">Catalyr HRMS</h1>
                        <p className="text-sm text-gray-500">123 Business Park, Tech City, TC 90210</p>
                        <p className="text-sm font-medium mt-2">Salary Slip for {format(new Date(slip.year, slip.month - 1), 'MMMM yyyy')}</p>
                    </div>

                    {/* Employee Details */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-8">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Employee Name:</span>
                            <span className="font-semibold">{employeeName || user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Employee ID:</span>
                            <span className="font-semibold">{employeeId || user?.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Department:</span>
                            <span className="font-semibold">{department || 'Engineering'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Designation:</span>
                            <span className="font-semibold">{designation || 'Developer'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Days Paid:</span>
                            <span className="font-semibold">30</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Pay Date:</span>
                            <span className="font-semibold">{format(new Date(), 'dd MMM yyyy')}</span>
                        </div>
                    </div>

                    {/* Salary Details Table */}
                    <div className="border rounded-lg overflow-hidden mb-8">
                        <div className="grid grid-cols-2 bg-gray-50 border-b">
                            <div className="p-3 font-semibold text-center border-r">Earnings</div>
                            <div className="p-3 font-semibold text-center">Deductions</div>
                        </div>
                        <div className="grid grid-cols-2">
                            {/* Earnings Column */}
                            <div className="border-r">
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Basic Salary</span>
                                    <span>{Number(slip.basic_salary || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>HRA</span>
                                    <span>{Number(slip.hra || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Special Allowance</span>
                                    <span>{Number(slip.da || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Reimbursements</span>
                                    <span>{Number(slip.reimbursements || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 font-bold mt-4">
                                    <span>Total Earnings</span>
                                    <span>{Number(slip.gross_salary || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Deductions Column */}
                            <div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Provident Fund</span>
                                    <span>{Number(slip.deductions?.pf || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Professional Tax</span>
                                    <span>{Number(slip.deductions?.tax || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Loss of Pay</span>
                                    <span>{Number(slip.deductions?.loss_of_pay || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-dashed">
                                    <span>Other Deductions</span>
                                    <span>{Number(slip.deductions?.other || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 font-bold mt-4">
                                    <span>Total Deductions</span>
                                    <span>{Number((slip.deductions?.pf || 0) + (slip.deductions?.tax || 0) + (slip.deductions?.loss_of_pay || 0) + (slip.deductions?.other || 0)).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex justify-between items-center mb-8">
                        <div>
                            <p className="text-sm text-gray-600">Net Payable Amount</p>
                            <p className="text-xs text-gray-500 mt-1">
                                (Total Earnings - Total Deductions)
                            </p>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                            ₹{Number(slip.net_salary || 0).toLocaleString()}
                        </div>
                    </div>

                    <p className="text-xs text-center text-gray-400">
                        This is a computer-generated document and does not require a signature.
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 print:hidden">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
