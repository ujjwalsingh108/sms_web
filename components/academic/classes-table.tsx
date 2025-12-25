"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { ClassWithSections } from "@/app/dashboard/academic/actions";
import { DeleteClassDialog } from "./delete-class-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";

interface ClassesTableProps {
  classes: ClassWithSections[];
}

export function ClassesTable({ classes }: ClassesTableProps) {
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No classes found</p>
        <Link href="/dashboard/academic/classes/new">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add First Class
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
                <TableHead className="font-semibold">Class Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Sections</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow
                  key={classItem.id}
                  className="hover:bg-emerald-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {classItem.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {classItem.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {classItem.sections && classItem.sections.length > 0 ? (
                        classItem.sections.map((section) => (
                          <div
                            key={section.id}
                            className="group relative inline-flex items-center gap-1"
                          >
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 dark:from-teal-900 dark:to-cyan-900 dark:text-teal-300 hover:from-teal-200 hover:to-cyan-200"
                            >
                              {section.name}
                              {section.room_number &&
                                ` (${section.room_number})`}
                            </Badge>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Link
                                href={`/dashboard/academic/sections/${section.id}/edit`}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteSectionId(section.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No sections
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/academic/classes/${classItem.id}/edit`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteClassId(classItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {deleteClassId && (
        <DeleteClassDialog
          classId={deleteClassId}
          open={!!deleteClassId}
          onOpenChange={(open) => !open && setDeleteClassId(null)}
        />
      )}

      {deleteSectionId && (
        <DeleteSectionDialog
          sectionId={deleteSectionId}
          open={!!deleteSectionId}
          onOpenChange={(open) => !open && setDeleteSectionId(null)}
        />
      )}
    </>
  );
}
