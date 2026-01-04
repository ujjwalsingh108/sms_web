"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

type StudentResult = {
  id: string;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
  is_absent: boolean;
  exam_schedule: {
    exam_date: string;
    max_marks: number;
    subject: {
      name: string;
      code: string;
    };
  };
};

type Props = {
  student: {
    id: string;
    admission_no: string;
    first_name: string;
    last_name: string;
    photo_url?: string;
    classes?: { name: string };
  };
  examName: string;
  results: StudentResult[];
};

export function ReportCardPDF({ student, examName, results }: Props) {
  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF() as any;

      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("REPORT CARD", 105, 20, { align: "center" });

      // Student Info
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Name: ${student.first_name} ${student.last_name}`, 20, 35);
      doc.text(`Admission No: ${student.admission_no}`, 20, 42);
      if (student.classes) {
        doc.text(`Class: ${student.classes.name}`, 20, 49);
      }
      doc.text(`Exam: ${examName}`, 20, 56);

      // Results Table
      const tableData = results.map((result) => [
        result.exam_schedule.subject.code,
        result.exam_schedule.subject.name,
        result.is_absent ? "Absent" : result.marks_obtained?.toString() || "-",
        result.exam_schedule.max_marks.toString(),
        result.is_absent
          ? "-"
          : result.marks_obtained
          ? `${(
              (result.marks_obtained / result.exam_schedule.max_marks) *
              100
            ).toFixed(1)}%`
          : "-",
        result.grade || "-",
        result.remarks || "-",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          [
            "Code",
            "Subject",
            "Marks Obtained",
            "Max Marks",
            "Percentage",
            "Grade",
            "Remarks",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
      });

      // Calculate statistics
      const validResults = results.filter(
        (r) => !r.is_absent && r.marks_obtained !== null
      );
      if (validResults.length > 0) {
        const totalObtained = validResults.reduce(
          (sum, r) => sum + (r.marks_obtained || 0),
          0
        );
        const totalMax = validResults.reduce(
          (sum, r) => sum + r.exam_schedule.max_marks,
          0
        );
        const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont(undefined, "bold");
        doc.text(`Total: ${totalObtained} / ${totalMax}`, 20, finalY);
        doc.text(`Overall Percentage: ${percentage}%`, 20, finalY + 7);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        20,
        pageHeight - 20
      );

      // Save PDF
      doc.save(
        `${student.first_name}_${student.last_name}_${examName.replace(
          /\s+/g,
          "_"
        )}_ReportCard.pdf`
      );

      toast.success("Report card downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <Button onClick={generatePDF} variant="outline" size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      Download Report Card
    </Button>
  );
}
