import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user's member record
  const { data: member } = await supabase
    .from('members')
    .select('*, role:roles(*), tenant:tenants(*)')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single()

  if (!member) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user.user_metadata.full_name || user.email}
        </p>
        <p className="text-sm text-gray-500">
          Role: {member.role.display_name} | Organization: {member.tenant.name}
        </p>
      </div>

      <DashboardStats tenantId={member.tenant_id} role={member.role.name} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity tenantId={member.tenant_id} />
      </div>
    </div>
  )
}
