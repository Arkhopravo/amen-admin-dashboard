import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users/allusers";
// import { toast } from "sonner";
import { TablePagination } from "@/components/TablePagination";
import { ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  mobile_no: string;
  profilePicture?: string;
}

export default function AllUsers() {
  const navigate = useNavigate();

  const { data = [] } = useQuery<User[]>({
    queryKey: ["allusers"],
    queryFn: getAllUsers,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  // React.useEffect(() => {
  // if (isLoading) toast.loading("Loading users...");
  // if (isError) toast.error("Failed to load users.");
  // }, [isLoading, isError]);

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      // {
      //   accessorKey: "counter",
      //   header: "#",
      //   cell: (info) => info.getValue(),
      // },
      {
        accessorKey: "username",
        header: "Username",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        
        enableColumnFilter: true,
        cell: (info: { getValue: () => any }) => info.getValue(),
      },
      {
        accessorKey: "mobile_no",
        header: "Mobile",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "profilePicture",
        header: "Profile Picture",
        cell: ({ row }) => (
          <img
            src={
              row.original.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-10 h-10 rounded-full mx-auto"
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            onClick={() => navigate(`/users/edit/${row.original._id}`)}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Edit
          </Button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <Input
    placeholder="Search users..."
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    className="w-full md:w-[300px]"
  />
  
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
    <TablePagination table={table} total={data.length}  />
    
    <div className="flex items-center gap-3">
      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="staff">User</SelectItem>
        </SelectContent>
      </Select>

        <Button 
            onClick={() => navigate('/users/create-new')}
            className="gap-2 "
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
    </div>
  </div>
</div>
      <Table className="border">
        <TableHeader className="top-0 sticky bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="text-center cursor-pointer select-none hover:text-blue-500"
                >
                  <div className="flex items-center justify-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
