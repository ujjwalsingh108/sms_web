import { redirect } from "next/navigation";

export default async function TransactionDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/accounts/transactions/${id}/view`);
}
