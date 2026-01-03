import { SubjectsTable } from "@/components/academic/subjects-table";
import { getSubjects } from "../actions";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const subjectsResult = await getSubjects();
  const subjects = subjectsResult.success ? subjectsResult.data : [];

  return <SubjectsTable subjects={subjects || []} />;
}
