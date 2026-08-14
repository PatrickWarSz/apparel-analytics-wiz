CREATE TABLE public.resale_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resale_models TO anon, authenticated;
GRANT ALL ON public.resale_models TO service_role;
ALTER TABLE public.resale_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open resale models" ON public.resale_models FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.resale_code_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code text NOT NULL,
  model_id uuid REFERENCES public.resale_models(id) ON DELETE SET NULL,
  size text NOT NULL DEFAULT '',
  last_description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resale_code_map TO anon, authenticated;
GRANT ALL ON public.resale_code_map TO service_role;
ALTER TABLE public.resale_code_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open resale code map" ON public.resale_code_map FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.resale_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES public.periods(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT '',
  qty integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_id, company_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resale_sales TO anon, authenticated;
GRANT ALL ON public.resale_sales TO service_role;
ALTER TABLE public.resale_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open resale sales" ON public.resale_sales FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.resale_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  closed_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resale_cycles TO anon, authenticated;
GRANT ALL ON public.resale_cycles TO service_role;
ALTER TABLE public.resale_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open resale cycles" ON public.resale_cycles FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.counter_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  supplier text NOT NULL DEFAULT '',
  doc text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pendente',
  cycle_id uuid REFERENCES public.resale_cycles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.counter_notes TO anon, authenticated;
GRANT ALL ON public.counter_notes TO service_role;
ALTER TABLE public.counter_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open counter notes" ON public.counter_notes FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.counter_note_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES public.counter_notes(id) ON DELETE CASCADE,
  model_id uuid REFERENCES public.resale_models(id) ON DELETE SET NULL,
  size text NOT NULL DEFAULT '',
  qty integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.counter_note_items TO anon, authenticated;
GRANT ALL ON public.counter_note_items TO service_role;
ALTER TABLE public.counter_note_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open counter note items" ON public.counter_note_items FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.resale_cycle_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid NOT NULL REFERENCES public.resale_cycles(id) ON DELETE CASCADE,
  model_id uuid REFERENCES public.resale_models(id) ON DELETE SET NULL,
  model_name text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  company_name text NOT NULL DEFAULT '',
  qty integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resale_cycle_allocations TO anon, authenticated;
GRANT ALL ON public.resale_cycle_allocations TO service_role;
ALTER TABLE public.resale_cycle_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open resale allocations" ON public.resale_cycle_allocations FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.resale_models (name, sizes, sort_order) VALUES
  ('Samba Canção', ARRAY['P','M','G','GG'], 1),
  ('Cueca Boxer Dryfit', ARRAY['P','M','G','GG'], 2),
  ('Cueca Boxer Microfibra', ARRAY['P','M','G','GG'], 3),
  ('Cueca Boxer Ciclista', ARRAY['P','M','G','GG'], 4),
  ('Cueca Boxer Algodão', ARRAY['P','M','G','GG'], 5),
  ('Cueca Boxer Plus Size', ARRAY['G1','G2','G3'], 6),
  ('Calcinha Fio Duplo Microfibra', ARRAY['P','M','G','GG'], 7),
  ('Calcinha Fio Dental Algodão', ARRAY['P','M','G','GG'], 8),
  ('Calcinha Tanga Algodão', ARRAY['P','M','G','GG'], 9),
  ('Conjunto Blogueirinha Feminino', ARRAY['P','M','G','GG'], 10);