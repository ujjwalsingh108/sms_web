"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateLibraryReportPDF } from "@/lib/utils/pdf-generator";
import { LibraryReport } from "@/app/dashboard/library/actions";
import { toast } from "sonner";

type DownloadReportButtonProps = {
  report: LibraryReport;
};

export function DownloadReportButton({ report }: DownloadReportButtonProps) {
  const handleDownload = () => {
    try {
      generateLibraryReportPDF(report);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
}
