CREATE UNIQUE INDEX IF NOT EXISTS companies_name_normalized_unique
  ON public.companies (lower(btrim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS factories_name_normalized_unique
  ON public.factories (lower(btrim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS product_groups_name_normalized_unique
  ON public.product_groups (lower(btrim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS resale_models_name_normalized_unique
  ON public.resale_models (lower(btrim(name)));