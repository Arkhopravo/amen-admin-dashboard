
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps<T> = {
  table: Table<T>;
  total: number;
};

export function TablePagination<T>({ table, total }: PaginationProps<T>) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Assets:</span>

        <Select
          value={String(pageSize)}
          onValueChange={(value: string) => {
            table.setPageSize(value === "all" ? total : Number(value));
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 30, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm">
          {from}–{to} of {total}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
