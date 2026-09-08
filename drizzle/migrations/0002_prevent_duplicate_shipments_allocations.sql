CREATE UNIQUE INDEX IF NOT EXISTS shipments_period_company_unique
  ON public.shipments (period_id, company_id)
  WHERE is_extra = false AND company_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS shipment_items_group_unique
  ON public.shipment_items (shipment_id, lower(btrim(group_name)));

CREATE UNIQUE INDEX IF NOT EXISTS resale_allocations_unique
  ON public.resale_cycle_allocations (cycle_id, lower(btrim(model_name)), lower(btrim(size)), lower(btrim(company_name)));
