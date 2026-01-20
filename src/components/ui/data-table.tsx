import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No data available', className }: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className={cn('rounded-xl border bg-card p-12 text-center', className)}><p className="text-muted-foreground">{emptyMessage}</p></div>;
  }
  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column.key} className={cn('text-xs font-semibold text-muted-foreground uppercase tracking-wider', column.className)}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)} onClick={() => onRowClick?.(item)} className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-muted/50')}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>{column.cell(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
