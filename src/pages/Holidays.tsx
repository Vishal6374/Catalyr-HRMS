import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import { holidays } from '@/data/mockData';
import { Holiday } from '@/types/hrms';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, CalendarRange, Calendar, PartyPopper, Flag, Building2 } from 'lucide-react';
import { format, isBefore, isAfter, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Holidays() {
  const { isHR } = useAuth();
  const [yearFilter, setYearFilter] = useState('2026');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'company',
    isOptional: false,
  });

  const today = startOfDay(new Date());

  const filteredHolidays = holidays
    .filter((h) => {
      const matchesYear = h.year.toString() === yearFilter;
      const matchesType = typeFilter === 'all' || h.type === typeFilter;
      return matchesYear && matchesType;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingHolidays = filteredHolidays.filter((h) => isAfter(new Date(h.date), today));
  const pastHolidays = filteredHolidays.filter((h) => isBefore(new Date(h.date), today));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'national':
        return <Flag className="w-4 h-4 text-destructive" />;
      case 'regional':
        return <PartyPopper className="w-4 h-4 text-warning" />;
      case 'company':
        return <Building2 className="w-4 h-4 text-primary" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'national':
        return 'National';
      case 'regional':
        return 'Regional';
      case 'company':
        return 'Company';
      default:
        return type;
    }
  };

  const columns: Column<Holiday>[] = [
    {
      key: 'name',
      header: 'Holiday',
      cell: (h) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            {getTypeIcon(h.type)}
          </div>
          <div>
            <p className="font-medium">{h.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{getTypeLabel(h.type)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (h) => (
        <div>
          <p className="font-medium">{format(new Date(h.date), 'MMMM d, yyyy')}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(h.date), 'EEEE')}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (h) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              h.type === 'national' && 'bg-destructive/10 text-destructive',
              h.type === 'regional' && 'bg-warning/10 text-warning',
              h.type === 'company' && 'bg-primary/10 text-primary'
            )}
          >
            {getTypeIcon(h.type)}
            {getTypeLabel(h.type)}
          </span>
        </div>
      ),
    },
    {
      key: 'optional',
      header: 'Optional',
      cell: (h) => (
        <span className={cn('text-sm', h.isOptional ? 'text-muted-foreground' : 'font-medium')}>
          {h.isOptional ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (h) => {
        const isPast = isBefore(new Date(h.date), today);
        return (
          <StatusBadge status={isPast ? 'closed' : 'active'} />
        );
      },
    },
  ];

  const handleAddHoliday = () => {
    console.log('Adding holiday:', newHoliday);
    setIsAddDialogOpen(false);
    setNewHoliday({
      name: '',
      date: '',
      type: 'company',
      isOptional: false,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Holidays"
          description={isHR ? 'Manage company holidays' : 'View upcoming holidays'}
        >
          {isHR && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Holiday</DialogTitle>
                  <DialogDescription>Add a new holiday to the calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Holiday Name</Label>
                    <Input
                      placeholder="e.g., Independence Day"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newHoliday.type}
                      onValueChange={(value) => setNewHoliday({ ...newHoliday, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="optional"
                      checked={newHoliday.isOptional}
                      onCheckedChange={(checked) =>
                        setNewHoliday({ ...newHoliday, isOptional: !!checked })
                      }
                    />
                    <Label htmlFor="optional" className="text-sm font-normal">
                      Optional holiday
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHoliday}>Add Holiday</Button>
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarRange className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredHolidays.length}</p>
                  <p className="text-xs text-muted-foreground">Total Holidays</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingHolidays.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredHolidays.filter((h) => h.type === 'national').length}
                  </p>
                  <p className="text-xs text-muted-foreground">National</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <PartyPopper className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredHolidays.filter((h) => h.isOptional).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Optional</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Holiday Card */}
        {upcomingHolidays.length > 0 && (
          <Card className="gradient-primary text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Next Holiday</p>
                  <h3 className="text-2xl font-bold">{upcomingHolidays[0].name}</h3>
                  <p className="text-white/80 mt-1">
                    {format(new Date(upcomingHolidays[0].date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Holidays Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Holiday Calendar {yearFilter}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredHolidays}
              keyExtractor={(h) => h.id}
              emptyMessage="No holidays found"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
