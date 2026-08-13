
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  name text NOT NULL,
  match_key text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own companies" ON public.companies FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.product_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'propria',
  yield_per_kg numeric,
  unit_price numeric,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_groups TO authenticated;
GRANT ALL ON public.product_groups TO service_role;
ALTER TABLE public.product_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own groups" ON public.product_groups FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.factories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  name text NOT NULL,
  monthly_limit numeric NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.factories TO authenticated;
GRANT ALL ON public.factories TO service_role;
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own factories" ON public.factories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  label text NOT NULL,
  fabric_price_per_kg numeric NOT NULL DEFAULT 15.90,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, label)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.periods TO authenticated;
GRANT ALL ON public.periods TO service_role;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own periods" ON public.periods FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sales_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  period_id uuid NOT NULL REFERENCES public.periods ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  group_name text NOT NULL,
  qty_sheet int NOT NULL DEFAULT 0,
  qty_from_sets int NOT NULL DEFAULT 0,
  qty_adjusted int,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_id, company_id, group_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_totals TO authenticated;
GRANT ALL ON public.sales_totals TO service_role;
ALTER TABLE public.sales_totals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sales" ON public.sales_totals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  period_id uuid NOT NULL REFERENCES public.periods ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies ON DELETE SET NULL,
  factory_id uuid REFERENCES public.factories ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  is_extra boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own shipments" ON public.shipments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.shipment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users,
  shipment_id uuid NOT NULL REFERENCES public.shipments ON DELETE CASCADE,
  group_name text NOT NULL,
  qty int NOT NULL DEFAULT 0,
  yield_per_kg numeric,
  unit_price numeric,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipment_items TO authenticated;
GRANT ALL ON public.shipment_items TO service_role;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own shipment items" ON public.shipment_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
