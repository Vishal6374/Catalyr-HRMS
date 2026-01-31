import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskLogService } from '@/services/apiService';
import { toast } from 'sonner';
import { Plus, ClipboardList, Clock, Calendar, Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import Loader from '@/components/ui/Loader';

export default function Tasks() {
    const { user, isHR } = useAuth();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [taskData, setTaskData] = useState({
        task_name: '',
        description: '',
        hours_spent: '',
        start_time: '09:00',
        end_time: '10:00',
        status: 'completed',
        date: format(new Date(), 'yyyy-MM-dd'),
    });
    const [employeeFilter, setEmployeeFilter] = useState('all');
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);


    const [activeTab, setActiveTab] = useState(isHR ? 'team' : 'personal');

    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks', selectedDate, activeTab, employeeFilter],
        queryFn: async () => {
            const params: any = { date: selectedDate };
            if (activeTab === 'team') {
                if (employeeFilter !== 'all') params.employee_id = employeeFilter;
                const { data } = await taskLogService.getAllTasks(params);
                return data;
            } else {
                const { data } = await taskLogService.getMyTasks(params);
                return data;
            }
        },
    });

    const { data: employeesData } = useQuery({
        queryKey: ['employees-for-tasks'],
        queryFn: async () => (await (await import('@/services/apiService')).employeeService.getAll({ status: 'active' })).data,
        enabled: isHR,
    });
    const employees = employeesData?.employees || [];


    const addTaskMutation = useMutation({
        mutationFn: (data: any) => {
            const dateStr = data.date;
            const payload = {
                ...data,
                start_time: data.start_time ? `${dateStr}T${data.start_time}:00` : undefined,
                end_time: data.end_time ? `${dateStr}T${data.end_time}:00` : undefined,
            };
            return taskLogService.logTask(payload);
        },
        onSuccess: (_data, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (!variables.keepOpen) {
                setIsAddDialogOpen(false);
            }
            setTaskData(prev => ({
                ...prev,
                task_name: '',
                description: '',
                hours_spent: '',
            }));
            toast.success('Task logged successfully');
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to log task'),
    });


    const deleteTaskMutation = useMutation({
        mutationFn: taskLogService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted');
        },
    });

    const updateTaskStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => taskLogService.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task status updated');
            setIsDetailsOpen(false);
        },
        onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update task status'),
    });

    const columns: Column<any>[] = [
        {
            key: 'task_name',
            header: 'Task Name',
            cell: (task) => (
                <div className="flex flex-col">
                    <span className="font-medium">{task.task_name}</span>
                    {activeTab === 'team' && task.employee && (
                        <span className="text-xs text-muted-foreground">{task.employee.name}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            cell: (task) => <span className="text-sm text-muted-foreground line-clamp-1">{task.description}</span>,
        },
        {
            key: 'time',
            header: 'Time Range',
            cell: (task) => task.start_time && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(task.start_time), 'hh:mm a')} - {task.end_time ? format(new Date(task.end_time), 'hh:mm a') : '...'}
                </div>
            ),
        },
        {
            key: 'hours_spent',
            header: 'Duration',
            cell: (task) => (
                <div className="font-medium text-sm">
                    {task.hours_spent}h
                </div>
            ),
        },

        {
            key: 'status',
            header: 'Status',
            cell: (task) => <StatusBadge status={task.status} />,
        },
        {
            key: 'actions',
            header: '',
            cell: (task) => (isHR || task.employee_id === user?.id) && (
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this task log?')) {
                            deleteTaskMutation.mutate(task.id);
                        }
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {isHR && (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="team">Team Tasks</TabsTrigger>
                            <TabsTrigger value="personal">My Tasks</TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}

                <PageHeader
                    title="Daily Task Management"
                    description={activeTab === 'team' ? "Monitor daily activities and productivity across the organization." : "Log and track your daily work activities."}
                >
                    {(activeTab === 'personal') && (
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4 mr-2" /> Log Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Log Daily Task</DialogTitle>
                                    <DialogDescription>
                                        Record your work activity for better tracking and productivity.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Task Title*</Label>
                                        <Input
                                            placeholder="e.g. Bug Fixing on Login Page"
                                            value={taskData.task_name}
                                            onChange={e => setTaskData({ ...taskData, task_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Time</Label>
                                            <Input
                                                type="time"
                                                value={taskData.start_time}
                                                onChange={e => setTaskData({ ...taskData, start_time: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Time</Label>
                                            <Input
                                                type="time"
                                                value={taskData.end_time}
                                                onChange={e => setTaskData({ ...taskData, end_time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="date"
                                                value={taskData.date}
                                                onChange={e => setTaskData({ ...taskData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Override Hours (Optional)</Label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                placeholder="e.g. 2.5"
                                                value={taskData.hours_spent}
                                                onChange={e => setTaskData({ ...taskData, hours_spent: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Task Description*</Label>
                                        <Textarea
                                            placeholder="Details of the work performed..."
                                            rows={4}
                                            value={taskData.description}
                                            onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button variant="ghost" className="sm:mr-auto" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => addTaskMutation.mutate({ ...taskData, keepOpen: true })}
                                        disabled={addTaskMutation.isPending || !taskData.task_name || !taskData.description}
                                    >
                                        Save & Add Another
                                    </Button>
                                    <Button
                                        onClick={() => addTaskMutation.mutate(taskData)}
                                        disabled={addTaskMutation.isPending || !taskData.task_name || !taskData.description}
                                    >
                                        {addTaskMutation.isPending && <Loader size="small" variant="white" className="mr-2" />}
                                        Complete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </PageHeader>

                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                type="date"
                                className="pl-9 w-[200px] border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {format(new Date(selectedDate), 'EEEE, MMMM dd')}
                        </div>
                        {activeTab === 'team' && (
                            <>
                                <div className="h-6 w-px bg-border hidden sm:block" />
                                <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                                    <SelectTrigger className="w-[180px] border-none bg-muted/50">
                                        <SelectValue placeholder="All Employees" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Employees</SelectItem>
                                        {employees.map((emp: any) => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Total Hours: {tasks.reduce((acc: number, t: any) => acc + Number(t.hours_spent), 0)}h
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={tasks}
                    keyExtractor={(t) => t.id}
                    onRowClick={(task) => {
                        setSelectedTask(task);
                        setIsDetailsOpen(true);
                    }}
                    emptyMessage={`No tasks logged for ${format(new Date(selectedDate), 'MMM dd')}.`}
                />

                {/* Task Details Sheet */}
                <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <SheetContent className="sm:max-w-[500px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                Task Details
                            </SheetTitle>
                            <SheetDescription>
                                Detailed breakdown of the work activity.
                            </SheetDescription>
                        </SheetHeader>

                        {selectedTask && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Header Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold leading-tight">{selectedTask.task_name}</h3>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={selectedTask.status} />
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(selectedTask.date), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>

                                {/* Employee Info (for Team View) */}
                                {selectedTask.employee && (
                                    <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requested By</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {selectedTask.employee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{selectedTask.employee.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedTask.employee.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Time Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Time Range</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {selectedTask.start_time ? format(new Date(selectedTask.start_time), 'hh:mm a') : 'N/A'} - {selectedTask.end_time ? format(new Date(selectedTask.end_time), 'hh:mm a') : '...'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
                                        </div>
                                        <p className="text-sm font-semibold">{selectedTask.hours_spent} Hours</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Edit2 className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Work Description</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border whitespace-pre-wrap text-sm leading-relaxed min-h-[120px]">
                                        {selectedTask.description}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-6 border-t space-y-3">
                                    {(isHR && selectedTask.status !== 'approved') && (
                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1 bg-success hover:bg-success/90 text-white border-none"
                                                onClick={() => updateTaskStatusMutation.mutate({ id: selectedTask.id, status: 'approved' })}
                                                disabled={updateTaskStatusMutation.isPending}
                                            >
                                                {updateTaskStatusMutation.isPending ? <Loader size="small" variant="white" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</>}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                                                onClick={() => updateTaskStatusMutation.mutate({ id: selectedTask.id, status: 'rejected' })}
                                                disabled={updateTaskStatusMutation.isPending}
                                            >
                                                {updateTaskStatusMutation.isPending ? <Loader size="small" /> : <><Trash2 className="w-4 h-4 mr-2" /> Reject</>}
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {(isHR || selectedTask.employee_id === user?.id) && (
                                            <Button
                                                variant="ghost"
                                                className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this task log?')) {
                                                        deleteTaskMutation.mutate(selectedTask.id);
                                                        setIsDetailsOpen(false);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Log
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setIsDetailsOpen(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </MainLayout>
    );
}
