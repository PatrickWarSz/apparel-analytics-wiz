ALTER TABLE public.resale_code_map
  ADD COLUMN IF NOT EXISTS is_own boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS own_group text NOT NULL DEFAULT '';