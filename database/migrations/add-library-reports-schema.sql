-- =====================================================
-- LIBRARY REPORTS SCHEMA
-- =====================================================
-- This schema supports generating and managing library reports
-- with various report types and configurations

-- Create library_reports table
CREATE TABLE IF NOT EXISTS public.library_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  description TEXT NULL,
  date_from DATE NULL,
  date_to DATE NULL,
  filters JSONB NULL DEFAULT '{}'::jsonb,
  generated_by UUID NULL,
  generated_at TIMESTAMP WITH TIME ZONE NULL,
  file_url TEXT NULL,
  status TEXT NULL DEFAULT 'draft'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  is_deleted BOOLEAN NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  deleted_by UUID NULL,
  CONSTRAINT library_reports_pkey PRIMARY KEY (id),
  CONSTRAINT library_reports_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT library_reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT library_reports_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT library_reports_status_check CHECK (
    status = ANY (ARRAY[
      'draft'::TEXT,
      'generating'::TEXT,
      'completed'::TEXT,
      'failed'::TEXT
    ])
  ),
  CONSTRAINT library_reports_type_check CHECK (
    report_type = ANY (ARRAY[
      'books_inventory'::TEXT,
      'issued_books'::TEXT,
      'overdue_books'::TEXT,
      'returned_books'::TEXT,
      'student_history'::TEXT,
      'popular_books'::TEXT,
      'fine_collection'::TEXT,
      'monthly_summary'::TEXT,
      'annual_summary'::TEXT
    ])
  )
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_library_reports_tenant_id 
  ON public.library_reports USING btree (tenant_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_report_type 
  ON public.library_reports USING btree (report_type) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_status 
  ON public.library_reports USING btree (status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_generated_at 
  ON public.library_reports USING btree (generated_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_is_deleted 
  ON public.library_reports USING btree (is_deleted) TABLESPACE pg_default
  WHERE (is_deleted = false);

-- Enable RLS
ALTER TABLE public.library_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view library reports in their tenant"
  ON public.library_reports FOR SELECT
  USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Librarians can manage library reports"
  ON public.library_reports FOR ALL
  USING (
    tenant_id = public.user_tenant_id() AND
    (
      public.user_has_role('superadmin') OR
      public.user_has_role('admin') OR
      public.user_has_role('librarian')
    )
  );

-- Add comments
COMMENT ON TABLE public.library_reports IS 'Stores library report configurations and generated reports';
COMMENT ON COLUMN public.library_reports.report_type IS 'Type of report: books_inventory, issued_books, overdue_books, returned_books, student_history, popular_books, fine_collection, monthly_summary, annual_summary';
COMMENT ON COLUMN public.library_reports.filters IS 'JSON object containing report-specific filters';
COMMENT ON COLUMN public.library_reports.status IS 'Report status: draft, generating, completed, failed';
