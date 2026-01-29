-- Accounts seed data for testing Accounts Management pages
-- Adjust `tenant_id` as needed for your environment
-- Run inside psql or your DB client connected to the project's database

BEGIN;

-- Tenant placeholder (replace with a real tenant id if required)
\set tenant_id '00000000-0000-0000-0000-000000000001'

-- Account Heads (income, expense, asset, liability)
INSERT INTO public.account_heads (id, tenant_id, name, type, description, created_at)
VALUES
  ('ah-income-0001-0000-000000000001', :'tenant_id', 'Tuition Fees', 'income', 'Income from student tuition', now()),
  ('ah-income-0002-0000-000000000002', :'tenant_id', 'Library Fines', 'income', 'Fines collected from overdue books', now()),
  ('ah-expense-0001-0000-000000000003', :'tenant_id', 'Stationery Expense', 'expense', 'Office and classroom stationery purchases', now()),
  ('ah-asset-0001-0000-000000000004', :'tenant_id', 'Cash in Hand', 'asset', 'Physical cash available at school office', now()),
  ('ah-liab-0001-0000-000000000005', :'tenant_id', 'Accounts Payable', 'liability', 'Outstanding supplier payments', now());

-- Transactions: mix of debits and credits across heads
-- For clarity: a debit on an expense or asset increases it, credit decreases depending on accounting conventions used in UI.
INSERT INTO public.transactions (id, tenant_id, transaction_date, account_head_id, type, amount, payment_method, reference_number, description, created_by, created_at)
VALUES
  ('txn-0001-000000000001', :'tenant_id', (current_date - interval '20 day')::date, 'ah-income-0001-0000-000000000001', 'credit', 50000.00, 'online', 'TXN-INV-1001', 'Tuition fees collected for January (batch A)', NULL, now()),
  ('txn-0002-000000000002', :'tenant_id', (current_date - interval '18 day')::date, 'ah-income-0002-0000-000000000002', 'credit', 150.00, 'cash', 'RF-202601-01', 'Library fine collected from student S001', NULL, now()),
  ('txn-0003-000000000003', :'tenant_id', (current_date - interval '15 day')::date, 'ah-expense-0001-0000-000000000003', 'debit', 1200.00, 'cheque', 'PO-2001', 'Stationery purchase from Acme Supplies', NULL, now()),
  ('txn-0004-000000000004', :'tenant_id', (current_date - interval '12 day')::date, 'ah-asset-0001-0000-000000000004', 'debit', 20000.00, 'cash', 'CASH-1201', 'Cash deposit to office safe', NULL, now()),
  ('txn-0005-000000000005', :'tenant_id', (current_date - interval '10 day')::date, 'ah-liab-0001-0000-000000000005', 'credit', 8000.00, 'bank_transfer', 'AP-INV-3001', 'Invoice from CleanCo pending', NULL, now()),
  ('txn-0006-000000000006', :'tenant_id', (current_date - interval '5 day')::date, 'ah-expense-0001-0000-000000000003', 'debit', 600.00, 'cash', 'EXP-202601-05', 'Additional marker pens purchase', NULL, now());

COMMIT;

-- Notes:
-- - Replace :'tenant_id' with a concrete UUID if your client doesn't support psql \set interpolation.
-- - These sample transactions exercise the Accounts UI: listing by head, date filtering, debit/credit display, and simple balances.
-- - You can add more transactions or adjust amounts/dates to test pagination and filtering edge-cases.
