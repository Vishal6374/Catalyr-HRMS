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
                scale: 2,
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
            {/* Changes made here:
               1. max-w-3xl: Sets a wider fixed width
               2. h-[85vh]: Sets a fixed height (85% of viewport)
               3. flex flex-col: Allows us to separate header, scrollable body, and footer
               4. p-0: Removes default padding so we can control it manually
            */}
            <DialogContent className="max-w-3xl w-full h-[85vh] flex flex-col p-0 overflow-hidden sm:rounded-lg">
                
                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #salary-slip, #salary-slip * { visibility: visible; }
                        #salary-slip {
                            position: absolute;
                            left: 0; top: 0;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 20px !important;
                            border: none !important;
                            box-shadow: none !important;
                            background: white !important;
                            z-index: 9999;
                        }
                        .animate-fade-in { display: none; }
                        /* Hide the scrollbar container styles in print */
                        .dialog-content-wrapper { overflow: visible !important; height: auto !important; }
                    }
                `}</style>

                {/* Fixed Header */}
                <DialogHeader className="px-6 py-4 border-b print:hidden">
                    <DialogTitle>Salary Slip Preview</DialogTitle>
                </DialogHeader>

                {/* Scrollable Body (No Scrollbar)
                   1. flex-1: Takes up remaining height
                   2. overflow-y-auto: Enables vertical scrolling
                   3. [&::-webkit-scrollbar]:hidden: Hides scrollbar on Chrome/Safari
                   4. [-ms-overflow-style:'none']: Hides on IE/Edge
                   5. [scrollbar-width:'none']: Hides on Firefox
                */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 
                                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    
                    {/* The actual slip content to be captured/printed */}
                    <div className="bg-white text-black border rounded-lg shadow-sm p-8 max-w-2xl mx-auto" id="salary-slip">
                        {/* Header */}
                        <div className="text-center mb-8 border-b pb-6">
                            <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">Catalyr HRMS</h1>
                            <p className="text-sm text-gray-500 mt-1">123 Business Park, Tech City, TC 90210</p>
                            <div className="mt-4 inline-block px-4 py-1 bg-gray-100 rounded-full">
                                <p className="text-sm font-medium text-gray-700">Payslip for {format(new Date(slip.year, slip.month - 1), 'MMMM yyyy')}</p>
                            </div>
                        </div>

                        {/* Employee Details */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm mb-8">
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Employee Name</span>
                                <span className="font-semibold text-gray-900">{employeeName || user?.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Employee ID</span>
                                <span className="font-semibold text-gray-900">{employeeId || user?.employeeId}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Department</span>
                                <span className="font-semibold text-gray-900">{department || 'Engineering'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Designation</span>
                                <span className="font-semibold text-gray-900">{designation || 'Developer'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Days Paid</span>
                                <span className="font-semibold text-gray-900">30</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">Pay Date</span>
                                <span className="font-semibold text-gray-900">{format(new Date(), 'dd MMM yyyy')}</span>
                            </div>
                        </div>

                        {/* Salary Details Table */}
                        <div className="border rounded-lg overflow-hidden mb-8">
                            <div className="grid grid-cols-2 bg-gray-50 border-b divide-x">
                                <div className="p-3 font-semibold text-center text-gray-700">Earnings</div>
                                <div className="p-3 font-semibold text-center text-gray-700">Deductions</div>
                            </div>
                            <div className="grid grid-cols-2 divide-x">
                                {/* Earnings Column */}
                                <div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Basic Salary</span>
                                        <span className="font-medium">{Number(slip.basic_salary || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">HRA</span>
                                        <span className="font-medium">{Number(slip.hra || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Special Allowance</span>
                                        <span className="font-medium">{Number(slip.da || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Reimbursements</span>
                                        <span className="font-medium">{Number(slip.reimbursements || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 font-bold mt-4 text-sm">
                                        <span>Total Earnings</span>
                                        <span>{Number(slip.gross_salary || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Deductions Column */}
                                <div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Provident Fund</span>
                                        <span className="font-medium">{Number(slip.deductions?.pf || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Professional Tax</span>
                                        <span className="font-medium">{Number(slip.deductions?.tax || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Loss of Pay</span>
                                        <span className="font-medium">{Number(slip.deductions?.loss_of_pay || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 border-b border-dashed text-sm">
                                        <span className="text-gray-600">Other Deductions</span>
                                        <span className="font-medium">{Number(slip.deductions?.other || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 font-bold mt-4 text-sm">
                                        <span>Total Deductions</span>
                                        <span>{Number((slip.deductions?.pf || 0) + (slip.deductions?.tax || 0) + (slip.deductions?.loss_of_pay || 0) + (slip.deductions?.other || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 flex justify-between items-center mb-8">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Net Payable Amount</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    (Total Earnings - Total Deductions)
                                </p>
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                ₹{Number(slip.net_salary || 0).toLocaleString()}
                            </div>
                        </div>

                        <p className="text-[10px] uppercase tracking-widest text-center text-gray-400 mt-12">
                            Computer Generated • Signature Not Required
                        </p>
                    </div>
                </div>

                {/* Fixed Footer with Actions */}
                <div className="p-4 border-t bg-white flex justify-end gap-3 print:hidden z-10">
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