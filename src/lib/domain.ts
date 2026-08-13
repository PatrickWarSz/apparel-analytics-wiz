import { supabase } from "@/integrations/supabase/client";

export type Company = {
  id: string;
  name: string;
  match_key: string;
  sort_order: number;
};

export type ProductGroup = {
  id: string;
  name: string;
  kind: "propria" | "revenda";
  yield_per_kg: number | null;
  unit_price: number | null;
  sort_order: number;
};

export type Factory = { id: string; name: string; monthly_limit: number; sort_order: number };

export type Period = { id: string; label: string; fabric_price_per_kg: number; created_at: string };

export type SalesTotal = {
  id: string;
  period_id: string;
  company_id: string;
  group_name: string;
  qty_sheet: number;
  qty_from_sets: number;
  qty_adjusted: number | null;
};

export type Shipment = {
  id: string;
  period_id: string;
  company_id: string | null;
  factory_id: string | null;
  title: string;
  is_extra: boolean;
  sort_order: number;
};

export type ShipmentItem = {
  id: string;
  shipment_id: string;
  group_name: string;
  qty: number;
  yield_per_kg: number | null;
  unit_price: number | null;
  sort_order: number;
};

export const DEFAULT_COMPANIES = [
  { name: "CR FITNESS", match_key: "CR" },
  { name: "RC FITNESS", match_key: "RC" },
  { name: "COSTA FITNESS", match_key: "COSTA" },
  { name: "REZENDE FITNESS", match_key: "REZENDE" },
];

export const DEFAULT_GROUPS: Array<Omit<ProductGroup, "id">> = [
  { name: "LEGGING", kind: "propria", yield_per_kg: 20, unit_price: 0.5, sort_order: 1 },
  { name: "SHORT", kind: "propria", yield_per_kg: 30, unit_price: 0.25, sort_order: 2 },
  { name: "TOP", kind: "propria", yield_per_kg: 60, unit_price: 0.1, sort_order: 3 },
  { name: "MACAQUINHO", kind: "propria", yield_per_kg: null, unit_price: null, sort_order: 4 },
  { name: "MACACAO", kind: "propria", yield_per_kg: null, unit_price: null, sort_order: 5 },
  { name: "BIQUINI", kind: "propria", yield_per_kg: null, unit_price: null, sort_order: 6 },
  { name: "CAMISA TERMICA", kind: "propria", yield_per_kg: 30, unit_price: 0.5, sort_order: 7 },
  { name: "CALCINHA", kind: "revenda", yield_per_kg: 80, unit_price: 0.05, sort_order: 8 },
  { name: "CUECA", kind: "revenda", yield_per_kg: null, unit_price: null, sort_order: 9 },
  { name: "SAMBA CANCAO", kind: "revenda", yield_per_kg: null, unit_price: null, sort_order: 10 },
];

export const DEFAULT_FACTORIES = [
  { name: "HELLEM", monthly_limit: 5000 },
  { name: "RAFAEL", monthly_limit: 3000 },
];

/** Cria os cadastros iniciais caso o usuário ainda não tenha nenhum. */
export async function ensureSeed(userId: string) {
  const [{ count: companies }, { count: groups }, { count: factories }] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("product_groups").select("id", { count: "exact", head: true }),
    supabase.from("factories").select("id", { count: "exact", head: true }),
  ]);

  if (!companies) {
    await supabase
      .from("companies")
      .insert(DEFAULT_COMPANIES.map((c, i) => ({ ...c, sort_order: i + 1, user_id: userId })));
  }
  if (!groups) {
    await supabase
      .from("product_groups")
      .insert(DEFAULT_GROUPS.map((g) => ({ ...g, user_id: userId })));
  }
  if (!factories) {
    await supabase
      .from("factories")
      .insert(DEFAULT_FACTORIES.map((f, i) => ({ ...f, sort_order: i + 1, user_id: userId })));
  }
}

export const effectiveQty = (row: SalesTotal) => row.qty_adjusted ?? row.qty_sheet;

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const kg = (value: number) =>
  `${value.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`;

export const int = (value: number) => value.toLocaleString("pt-BR");

export function currentPeriodLabel() {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
}
