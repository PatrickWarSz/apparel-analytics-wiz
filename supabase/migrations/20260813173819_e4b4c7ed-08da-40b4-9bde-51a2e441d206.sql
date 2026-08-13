DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['companies','product_groups','factories','periods','sales_totals','shipments','shipment_items']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN user_id DROP NOT NULL', t);
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN user_id DROP DEFAULT', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "own companies" ON public.companies;
DROP POLICY IF EXISTS "own groups" ON public.product_groups;
DROP POLICY IF EXISTS "own factories" ON public.factories;
DROP POLICY IF EXISTS "own periods" ON public.periods;
DROP POLICY IF EXISTS "own sales" ON public.sales_totals;
DROP POLICY IF EXISTS "own shipments" ON public.shipments;
DROP POLICY IF EXISTS "own shipment items" ON public.shipment_items;

CREATE POLICY "open companies" ON public.companies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open groups" ON public.product_groups FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open factories" ON public.factories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open periods" ON public.periods FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open sales" ON public.sales_totals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open shipments" ON public.shipments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "open shipment items" ON public.shipment_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);