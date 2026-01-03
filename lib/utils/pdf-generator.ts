import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LibraryReportData = {
  report_name: string;
  report_type: string;
  description?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  filters?: any;
  generated_at?: string | null;
  status: string;
};

const reportTypeLabels: Record<string, string> = {
  books_inventory: "Books Inventory",
  issued_books: "Issued Books",
  overdue_books: "Overdue Books",
  returned_books: "Returned Books",
  student_history: "Student History",
  popular_books: "Popular Books",
  fine_collection: "Fine Collection",
  monthly_summary: "Monthly Summary",
  annual_summary: "Annual Summary",
};

export function generateLibraryReportPDF(report: LibraryReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header with gradient effect (using colored rectangles)
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 40, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Library Report", pageWidth / 2, 20, { align: "center" });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Report Information Section
  let yPos = 55;

  // Report Name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(report.report_name, margin, yPos);
  yPos += 10;

  // Report Type and Status
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Type: ${reportTypeLabels[report.report_type] || report.report_type}`,
    margin,
    yPos
  );
  doc.text(
    `Status: ${report.status.toUpperCase()}`,
    pageWidth - margin - 60,
    yPos
  );
  yPos += 8;

  // Date Range
  if (report.date_from && report.date_to) {
    doc.text(
      `Period: ${new Date(report.date_from).toLocaleDateString()} - ${new Date(
        report.date_to
      ).toLocaleDateString()}`,
      margin,
      yPos
    );
    yPos += 8;
  }

  // Generated Date
  if (report.generated_at) {
    doc.text(
      `Generated: ${new Date(report.generated_at).toLocaleString()}`,
      margin,
      yPos
    );
    yPos += 8;
  }

  // Description
  if (report.description) {
    doc.text(`Description: ${report.description}`, margin, yPos);
    yPos += 10;
  }

  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Report Data Section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Report Data", margin, yPos);
  yPos += 10;

  const reportData = report.filters?.data;

  if (reportData) {
    // Books Inventory Report
    if (report.report_type === "books_inventory" && reportData.total_books) {
      const summaryData = [
        ["Total Books", reportData.total_books.toString()],
        ["Total Copies", reportData.total_copies.toString()],
        ["Available Copies", reportData.available_copies.toString()],
        ["Issued Copies", (reportData.issued_copies || 0).toString()],
        ["Damaged Copies", (reportData.damaged_copies || 0).toString()],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Count"]],
        body: summaryData,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      if (reportData.by_category) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Books by Category", margin, yPos);
        yPos += 8;

        const categoryData = Object.entries(reportData.by_category).map(
          ([category, count]) => [category, (count as number).toString()]
        );

        autoTable(doc, {
          startY: yPos,
          head: [["Category", "Count"]],
          body: categoryData,
          theme: "grid",
          headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
          },
          margin: { left: margin, right: margin },
        });
      }
    }

    // Issued Books Report
    else if (
      report.report_type === "issued_books" &&
      reportData.books &&
      Array.isArray(reportData.books)
    ) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Total Issued: ${reportData.total_issued || reportData.books.length}`,
        margin,
        yPos
      );
      yPos += 10;

      const booksData = reportData.books.map((book: any) => [
        book.title || "N/A",
        book.student || "N/A",
        book.issued_date
          ? new Date(book.issued_date).toLocaleDateString()
          : "N/A",
        book.due_date ? new Date(book.due_date).toLocaleDateString() : "N/A",
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Book Title", "Student", "Issued Date", "Due Date"]],
        body: booksData,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 50 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
        margin: { left: margin, right: margin },
      });
    }

    // Overdue Books Report
    else if (
      report.report_type === "overdue_books" &&
      reportData.books &&
      Array.isArray(reportData.books)
    ) {
      const summaryData = [
        ["Total Overdue", (reportData.total_overdue || 0).toString()],
        ["Total Fines", `₹${(reportData.total_fines || 0).toFixed(2)}`],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "plain",
        headStyles: {
          fillColor: [239, 68, 68],
          textColor: 255,
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      const booksData = reportData.books.map((book: any) => [
        book.title || "N/A",
        book.student || "N/A",
        book.due_date ? new Date(book.due_date).toLocaleDateString() : "N/A",
        (book.days_overdue || 0).toString(),
        `₹${(book.fine || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Book", "Student", "Due Date", "Days Overdue", "Fine"]],
        body: booksData,
        theme: "striped",
        headStyles: {
          fillColor: [239, 68, 68],
          textColor: 255,
        },
        margin: { left: margin, right: margin },
      });
    }

    // Returned Books Report
    else if (
      report.report_type === "returned_books" &&
      reportData.books &&
      Array.isArray(reportData.books)
    ) {
      const summaryData = [
        ["Total Returned", (reportData.total_returned || 0).toString()],
        ["Returned On Time", (reportData.on_time || 0).toString()],
        ["Returned Late", (reportData.late || 0).toString()],
        [
          "Total Fines Collected",
          `₹${(reportData.total_fines_collected || 0).toFixed(2)}`,
        ],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Count"]],
        body: summaryData,
        theme: "striped",
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      const booksData = reportData.books.map((book: any) => [
        book.title || "N/A",
        book.student || "N/A",
        book.return_date
          ? new Date(book.return_date).toLocaleDateString()
          : "N/A",
        `₹${(book.fine || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Book", "Student", "Return Date", "Fine"]],
        body: booksData,
        theme: "grid",
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
        },
        margin: { left: margin, right: margin },
      });
    }

    // Fine Collection Report
    else if (report.report_type === "fine_collection") {
      const summaryData = [
        ["Total Fines", `₹${(reportData.total_fines || 0).toFixed(2)}`],
        ["Total Transactions", (reportData.total_transactions || 0).toString()],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "striped",
        headStyles: {
          fillColor: [245, 158, 11],
          textColor: 255,
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      if (reportData.by_month) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Fines by Month", margin, yPos);
        yPos += 8;

        const monthData = Object.entries(reportData.by_month).map(
          ([month, amount]: [string, any]) => [month, `₹${amount.toFixed(2)}`]
        );

        autoTable(doc, {
          startY: yPos,
          head: [["Month", "Amount"]],
          body: monthData,
          theme: "grid",
          headStyles: {
            fillColor: [245, 158, 11],
            textColor: 255,
          },
          margin: { left: margin, right: margin },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      if (
        reportData.top_defaulters &&
        Array.isArray(reportData.top_defaulters)
      ) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Top Defaulters", margin, yPos);
        yPos += 8;

        const defaultersData = reportData.top_defaulters.map(
          (defaulter: any) => [
            defaulter.student || "N/A",
            `₹${(defaulter.total_fine || 0).toFixed(2)}`,
          ]
        );

        autoTable(doc, {
          startY: yPos,
          head: [["Student", "Total Fine"]],
          body: defaultersData,
          theme: "striped",
          headStyles: {
            fillColor: [239, 68, 68],
            textColor: 255,
          },
          margin: { left: margin, right: margin },
        });
      }
    }

    // Generic JSON data display for other report types
    else {
      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      const jsonText = JSON.stringify(reportData, null, 2);
      const lines = doc.splitTextToSize(jsonText, pageWidth - 2 * margin);

      let currentY = yPos;
      lines.forEach((line: string) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 30;
        }
        doc.text(line, margin, currentY);
        currentY += 5;
      });
    }
  } else {
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("No data available for this report.", margin, yPos);
  }

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Generate filename
  const filename = `${report.report_name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}_${Date.now()}.pdf`;

  // Download the PDF
  doc.save(filename);
}
