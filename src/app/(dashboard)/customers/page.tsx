"use client";

import { useState } from "react";
import { EllipsisVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { customers } from "@/data/customers";

const PAGE_SIZE = 5;

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);

  const totalPages = Math.ceil(customers.length / PAGE_SIZE);
  const paginatedCustomers = customers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const addVariable = () => setVariables((prev) => [...prev, ""]);

  const updateVariable = (index: number, value: string) =>
    setVariables((prev) => prev.map((v, i) => (i === index ? value : v)));

  const removeVariable = (index: number) =>
    setVariables((prev) => prev.filter((_, i) => i !== index));

  const resetDialog = () => {
    setListName("");
    setAllowDuplicates(false);
    setVariables([]);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer List</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Customer List</DialogTitle>
              <DialogDescription>
                Set up a new customer list for your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  placeholder="e.g. VIP Customers"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-duplicates">Allow Duplicates</Label>
                <Switch
                  id="allow-duplicates"
                  checked={allowDuplicates}
                  onCheckedChange={setAllowDuplicates}
                />
              </div>
              <div className="space-y-3">
                <Label>Create Variables (Optional)</Label>
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Variable Name"
                      value={variable}
                      onChange={(e) => updateVariable(index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeVariable(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addVariable}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // handle creation
                  setDialogOpen(false);
                  resetDialog();
                }}
              >
                Create List
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{customer.contacts}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">Created {customer.createdAt}</div>
                  <div className="text-sm text-muted-foreground">
                    Modified {customer.modifiedAt}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
