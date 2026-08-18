-- companies
DROP POLICY IF EXISTS "open companies" ON public.companies;
REVOKE ALL ON public.companies FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
CREATE POLICY "authenticated manage companies" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- product_groups
DROP POLICY IF EXISTS "open groups" ON public.product_groups;
REVOKE ALL ON public.product_groups FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_groups TO authenticated;
GRANT ALL ON public.product_groups TO service_role;
CREATE POLICY "authenticated manage product groups" ON public.product_groups FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- factories
DROP POLICY IF EXISTS "open factories" ON public.factories;
REVOKE ALL ON public.factories FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.factories TO authenticated;
GRANT ALL ON public.factories TO service_role;
CREATE POLICY "authenticated manage factories" ON public.factories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- periods
DROP POLICY IF EXISTS "open periods" ON public.periods;
REVOKE ALL ON public.periods FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.periods TO authenticated;
GRANT ALL ON public.periods TO service_role;
CREATE POLICY "authenticated manage periods" ON public.periods FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- sales_totals
DROP POLICY IF EXISTS "open sales" ON public.sales_totals;
REVOKE ALL ON public.sales_totals FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_totals TO authenticated;
GRANT ALL ON public.sales_totals TO service_role;
CREATE POLICY "authenticated manage sales totals" ON public.sales_totals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- shipments
DROP POLICY IF EXISTS "open shipments" ON public.shipments;
REVOKE ALL ON public.shipments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
CREATE POLICY "authenticated manage shipments" ON public.shipments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- shipment_items
DROP POLICY IF EXISTS "open shipment items" ON public.shipment_items;
REVOKE ALL ON public.shipment_items FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipment_items TO authenticated;
GRANT ALL ON public.shipment_items TO service_role;
CREATE POLICY "authenticated manage shipment items" ON public.shipment_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- fabric_moves
DROP POLICY IF EXISTS "open fabric moves" ON public.fabric_moves;
REVOKE ALL ON public.fabric_moves FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fabric_moves TO authenticated;
GRANT ALL ON public.fabric_moves TO service_role;
CREATE POLICY "authenticated manage fabric moves" ON public.fabric_moves FOR ALL TO authenticated USING (true) WITH CHECK (true);