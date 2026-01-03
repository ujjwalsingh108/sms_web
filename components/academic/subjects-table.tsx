"use client";

import { useState } from "react";
import { SubjectWithClasses } from "@/app/dashboard/academic/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import { DeleteSubjectDialog } from "./delete-subject-dialog";

interface SubjectsTableProps {
  subjects: SubjectWithClasses[];
}

export function SubjectsTable({ subjects }: SubjectsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithClasses | null>(null);

  const handleDeleteClick = (subject: SubjectWithClasses) => {
    setSelectedSubject(subject);
    setDeleteDialogOpen(true);
  };

  if (subjects.length === 0) {
    return (
      <div className="glass-effect border-0 rounded-2xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first subject
            </p>
            <Link href="/dashboard/academic/subjects/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                Add Subject
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-effect border-0 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Subject Name</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-center">
                Classes
              </TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow
                key={subject.id}
                className="border-border/50 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    {subject.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800"
                  >
                    {subject.code}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {subject.description || "-"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 text-emerald-700 dark:text-emerald-300"
                    >
                      {subject.class_count || 0} Classes
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <Link
                        href={`/dashboard/academic/subjects/${subject.id}/edit`}
                      >
                        <DropdownMenuItem className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Subject
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(subject)}
                        className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedSubject && (
        <DeleteSubjectDialog
          subject={selectedSubject}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  );
}
