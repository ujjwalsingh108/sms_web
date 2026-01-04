"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

type StudentResult = {
  id: string;
  marks_obtained: number | null;
  grade: string | null;
  is_absent: boolean;
  student: {
    admission_no: string;
    first_name: string;
    last_name: string;
  };
};

type Props = {
  schedule: {
    exam_date: string;
    max_marks: number;
    exam: {
      name: string;
      exam_type: { name: string };
    };
    class: {
      name: string;
    };
    subject: {
      name: string;
      code: string;
    };
  };
  results: StudentResult[];
};

export function MarkSheetPDF({ schedule, results }: Props) {
  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF() as any;

      // Header
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("MARK SHEET", 105, 20, { align: "center" });

      // Exam Info
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Exam: ${schedule.exam.name}`, 20, 32);
      doc.text(`Type: ${schedule.exam.exam_type.name}`, 20, 39);
      doc.text(`Class: ${schedule.class.name}`, 20, 46);
      doc.text(
        `Subject: ${schedule.subject.code} - ${schedule.subject.name}`,
        20,
        53
      );
      doc.text(
        `Date: ${new Date(schedule.exam_date).toLocaleDateString()}`,
        20,
        60
      );
      doc.text(`Maximum Marks: ${schedule.max_marks}`, 20, 67);

      // Results Table
      const tableData = results
        .sort((a, b) =>
          a.student.admission_no.localeCompare(b.student.admission_no)
        )
        .map((result, index) => [
          (index + 1).toString(),
          result.student.admission_no,
          `${result.student.first_name} ${result.student.last_name}`,
          result.is_absent
            ? "Absent"
            : result.marks_obtained?.toString() || "-",
          result.is_absent
            ? "-"
            : result.marks_obtained
            ? `${((result.marks_obtained / schedule.max_marks) * 100).toFixed(
                1
              )}%`
            : "-",
          result.grade || "-",
        ]);

      autoTable(doc, {
        startY: 75,
        head: [
          [
            "S.No",
            "Admission No",
            "Student Name",
            "Marks Obtained",
            "Percentage",
            "Grade",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
        },
      });

      // Statistics
      const validResults = results.filter(
        (r) => !r.is_absent && r.marks_obtained !== null
      );
      if (validResults.length > 0) {
        const totalMarks = validResults.reduce(
          (sum, r) => sum + (r.marks_obtained || 0),
          0
        );
        const average = (totalMarks / validResults.length).toFixed(2);
        const highest = Math.max(
          ...validResults.map((r) => r.marks_obtained || 0)
        );
        const lowest = Math.min(
          ...validResults.map((r) => r.marks_obtained || 0)
        );

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont(undefined, "bold");
        doc.setFontSize(11);
        doc.text("Class Statistics", 20, finalY);
        doc.setFont(undefined, "normal");
        doc.setFontSize(10);
        doc.text(`Total Students: ${results.length}`, 20, finalY + 7);
        doc.text(`Present: ${validResults.length}`, 20, finalY + 14);
        doc.text(
          `Absent: ${results.length - validResults.length}`,
          20,
          finalY + 21
        );
        doc.text(`Class Average: ${average}`, 20, finalY + 28);
        doc.text(`Highest: ${highest}`, 20, finalY + 35);
        doc.text(`Lowest: ${lowest}`, 20, finalY + 42);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        pageHeight - 15
      );
      doc.text("___________________", 20, pageHeight - 25);
      doc.text("Teacher's Signature", 20, pageHeight - 20);

      // Save PDF
      const fileName = `${schedule.class.name}_${
        schedule.subject.code
      }_${schedule.exam.name.replace(/\s+/g, "_")}_MarkSheet.pdf`;
      doc.save(fileName);

      toast.success("Mark sheet downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <Button onClick={generatePDF} className="gap-2">
      <Download className="h-4 w-4" />
      Download Mark Sheet
    </Button>
  );
}
