import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { getLibraryReports } from "../actions";
import ReportsTable from "@/components/library/reports-table";

export const dynamic = "force-dynamic";

export default async function LibraryReportsPage() {
  const reportsResult = await getLibraryReports();
  const reports = reportsResult.success ? reportsResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/library">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Library Reports</h1>
            <p className="text-muted-foreground">
              Generate and view library reports
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/library/reports/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Link>
        </Button>
      </div>

      <ReportsTable reports={reports || []} />
    </div>
  );
}
