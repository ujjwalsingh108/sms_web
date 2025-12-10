import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteForm } from "@/components/transport/route-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewRoutePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            asChild
          >
            <Link href="/dashboard/transport/routes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Route
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Add a new transport route
            </p>
          </div>
        </div>

        <RouteForm mode="create" />
      </div>
    </div>
  );
}
