import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Clock, Calendar, UserPlus } from 'lucide-react';

interface MarkAttendanceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: any;
    date: Date;
    onSave: (data: any) => void;
    isSaving: boolean;
}

export function MarkAttendanceModal({
    open,
    onOpenChange,
    employee,
    date,
    onSave,
    isSaving,
}: MarkAttendanceModalProps) {
    const [formData, setFormData] = useState({
        check_in: '',
        check_out: '',
        status: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.notes) {
            alert('Please provide a reason/notes for manual attendance entry.');
            return;
        }


        const dateStr = format(date, 'yyyy-MM-dd');

        onSave({
            employee_id: employee.id,
            date: dateStr,
            check_in: formData.check_in ? `${dateStr}T${formData.check_in}:00` : null,
            check_out: formData.check_out ? `${dateStr}T${formData.check_out}:00` : null,
            status: formData.status || undefined,
            notes: formData.notes || undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Mark Attendance - {employee?.name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Employee Info */}
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">{employee?.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {employee?.employee_id} • {format(date, 'MMM dd, yyyy')}
                        </p>
                    </div>

                    {/* Check In and Check Out in one row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mark_check_in" className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                Check In
                            </Label>
                            <Input
                                id="mark_check_in"
                                type="time"
                                value={formData.check_in}
                                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mark_check_out" className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-600" />
                                Check Out
                            </Label>
                            <Input
                                id="mark_check_out"
                                type="time"
                                value={formData.check_out}
                                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Manual Status */}
                    <div className="space-y-2">
                        <Label htmlFor="mark_status">Status (Optional)</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Auto-calculate from hours" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="half_day">Half Day</SelectItem>
                                <SelectItem value="on_leave">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Leave empty to auto-calculate based on work hours
                        </p>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="mark_notes">Reason/Notes*</Label>
                        <Textarea
                            id="mark_notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Exceptional case description..."
                            rows={3}
                            required
                        />
                        <p className="text-[10px] text-muted-foreground">Manual attendance additions should be restricted to exceptional cases and must be logged.</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Marking...' : 'Mark Attendance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
