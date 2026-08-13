ALTER TABLE public.periods ADD COLUMN IF NOT EXISTS reference_label text NOT NULL DEFAULT '';

CREATE TABLE public.fabric_moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  period_id uuid REFERENCES public.periods(id) ON DELETE SET NULL,
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'entrada',
  kg numeric NOT NULL DEFAULT 0,
  doc text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  moved_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fabric_moves TO anon, authenticated;
GRANT ALL ON public.fabric_moves TO service_role;

ALTER TABLE public.fabric_moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open fabric moves" ON public.fabric_moves FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX fabric_moves_shipment_unique ON public.fabric_moves(shipment_id) WHERE shipment_id IS NOT NULL;