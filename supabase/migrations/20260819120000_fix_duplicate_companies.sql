-- 1) Remove duplicatas de empresas, mantendo a que já tem vendas/remessas
-- vinculadas (ou a mais antiga, se nenhuma tiver dados)
with ranked as (
  select
    c.id,
    row_number() over (
      partition by c.user_id, c.name
      order by
        (exists (select 1 from sales_totals st where st.company_id = c.id)) desc,
        (exists (select 1 from resale_sales rs where rs.company_id = c.id)) desc,
        (exists (select 1 from fabric_moves fm where fm.company_id = c.id)) desc,
        (exists (select 1 from shipments sh where sh.company_id = c.id)) desc,
        c.created_at asc
    ) as rn
  from public.companies c
)
delete from public.companies
where id in (select id from ranked where rn > 1);

-- 2) Mesma limpeza para MEIs (factories), mantendo o mais antigo
with ranked as (
  select id, row_number() over (partition by user_id, name order by created_at asc) as rn
  from public.factories
)
delete from public.factories
where id in (select id from ranked where rn > 1);

-- 3) Trava definitiva: impede duplicar nome de empresa/MEI do mesmo usuário
-- (mesma proteção que product_groups já tem)
alter table public.companies
  add constraint companies_user_id_name_key unique (user_id, name);

alter table public.factories
  add constraint factories_user_id_name_key unique (user_id, name);