-- Inventory seed data for testing the Inventory Management pages
-- Adjust `tenant_id` as needed for your environment
-- Run inside psql or your DB client connected to the project's database

BEGIN;

-- Tenant placeholder (replace with a real tenant id if required)
\set tenant_id '00000000-0000-0000-0000-000000000001'

-- Categories
INSERT INTO public.inventory_categories (id, tenant_id, name, description, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', :'tenant_id', 'Stationery', 'Office and classroom stationery', now()),
  ('22222222-2222-2222-2222-222222222222', :'tenant_id', 'Electronics', 'Electronic devices and accessories', now()),
  ('33333333-3333-3333-3333-333333333333', :'tenant_id', 'Cleaning Supplies', 'Cleaning liquids and consumables', now());

-- Suppliers
INSERT INTO public.suppliers (id, tenant_id, name, contact_person, phone, email, address, status, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', :'tenant_id', 'Acme Supplies', 'Rita Gomez', '555-0101', 'rita@acme.example', '12 Market St, City', 'active', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', :'tenant_id', 'Pioneer Electronics', 'Rahul Sharma', '555-0202', 'rahul@pioneer.example', '41 Industrial Ave, City', 'active', now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', :'tenant_id', 'CleanCo', 'Sarah Lee', '555-0303', 'sarah@cleanco.example', '9 Clean Blvd, City', 'active', now());

-- Inventory items
INSERT INTO public.inventory_items (id, tenant_id, category_id, item_name, item_code, description, unit, quantity, minimum_quantity, unit_price, location, status, created_at)
VALUES
  ('10101010-1010-1010-1010-101010101010', :'tenant_id', '11111111-1111-1111-1111-111111111111', 'A4 Paper (Ream)', 'ST-A4-001', '80gsm white A4 paper, 500 sheets per ream', 'reams', 500, 10, 2.50, 'Store Room A - Shelf 1', 'available', now()),
  ('20202020-2020-2020-2020-202020202020', :'tenant_id', '11111111-1111-1111-1111-111111111111', 'Ballpoint Pen (Blue)', 'ST-PEN-001', 'Smooth writing blue ballpoint pens', 'pcs', 1000, 50, 0.15, 'Store Room A - Drawer 2', 'available', now()),
  ('30303030-3030-3030-3030-303030303030', :'tenant_id', '22222222-2222-2222-2222-222222222222', 'Projector (Xenon)', 'EL-PROJ-001', '1080p projector with HDMI & VGA', 'pcs', 5, 1, 450.00, 'AV Cupboard', 'available', now()),
  ('40404040-4040-4040-4040-404040404040', :'tenant_id', '11111111-1111-1111-1111-111111111111', 'Whiteboard Marker (Black)', 'ST-MKR-001', 'Low-odor whiteboard markers', 'pcs', 200, 20, 0.50, 'Store Room A - Drawer 3', 'available', now()),
  ('50505050-5050-5050-5050-505050505050', :'tenant_id', '33333333-3333-3333-3333-333333333333', 'Liquid Detergent (5L)', 'CL-DET-005', 'Concentrated detergent for floor cleaning', 'litre', 50, 5, 12.00, 'Cleaning Cupboard', 'available', now());

-- Purchase Order 1 (Acme Supplies)
INSERT INTO public.purchase_orders (id, tenant_id, order_number, supplier_id, order_date, expected_delivery_date, total_amount, status, remarks, created_by, created_at)
VALUES
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', :'tenant_id', 'PO-1001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (current_date - interval '10 day')::date, (current_date - interval '7 day')::date,  (100 * 2.40 + 500 * 0.14)::numeric, 'delivered', 'Regular stationery restock', NULL, now());

INSERT INTO public.purchase_order_items (id, tenant_id, purchase_order_id, inventory_item_id, quantity, unit_price, total_price, created_at)
VALUES
  ('p1i1-0001-0000-0000-000000000001', :'tenant_id', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '10101010-1010-1010-1010-101010101010', 100, 2.40, (100 * 2.40), now()),
  ('p1i2-0001-0000-0000-000000000002', :'tenant_id', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '20202020-2020-2020-2020-202020202020', 500, 0.14, (500 * 0.14), now());

-- Purchase Order 2 (Pioneer Electronics)
INSERT INTO public.purchase_orders (id, tenant_id, order_number, supplier_id, order_date, expected_delivery_date, total_amount, status, remarks, created_by, created_at)
VALUES
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', :'tenant_id', 'PO-1002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (current_date - interval '5 day')::date, (current_date + interval '2 day')::date, (2 * 430.00)::numeric, 'processing', 'Replacement projectors', NULL, now());

INSERT INTO public.purchase_order_items (id, tenant_id, purchase_order_id, inventory_item_id, quantity, unit_price, total_price, created_at)
VALUES
  ('p2i1-0002-0000-0000-000000000003', :'tenant_id', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', '30303030-3030-3030-3030-303030303030', 2, 430.00, (2 * 430.00), now());

-- Purchase Order 3 (CleanCo)
INSERT INTO public.purchase_orders (id, tenant_id, order_number, supplier_id, order_date, expected_delivery_date, total_amount, status, remarks, created_by, created_at)
VALUES
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', :'tenant_id', 'PO-1003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', (current_date - interval '3 day')::date, (current_date + interval '4 day')::date, (20 * 11.50)::numeric, 'processing', 'Monthly cleaning supplies', NULL, now());

INSERT INTO public.purchase_order_items (id, tenant_id, purchase_order_id, inventory_item_id, quantity, unit_price, total_price, created_at)
VALUES
  ('p3i1-0003-0000-0000-000000000004', :'tenant_id', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', '50505050-5050-5050-5050-505050505050', 20, 11.50, (20 * 11.50), now());

-- Optional: adjust inventory quantities to reflect delivered items (example for PO-1001 delivered)
UPDATE public.inventory_items
SET quantity = quantity + 100
WHERE id = '10101010-1010-1010-1010-101010101010';

UPDATE public.inventory_items
SET quantity = quantity + 500
WHERE id = '20202020-2020-2020-2020-202020202020';

COMMIT;

-- Notes:
-- - Replace :'tenant_id' with a concrete UUID if your client doesn't support psql \set interpolation.
-- - This seed focuses on sample categories, suppliers, items, and purchase orders to exercise typical inventory list, supplier filtering, and PO details pages.
-- - You may create additional purchase orders or modify quantities/prices for edge cases (zero stock, below minimum, discontinued status, etc.).
