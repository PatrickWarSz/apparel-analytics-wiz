import type { ProductGroup, ShipmentItem } from "./domain";

export type ComputedItem = {
  id: string;
  group_name: string;
  qty: number;
  yield_per_kg: number | null;
  unit_price: number | null;
  kg: number;
  value: number;
};

export function computeItem(item: ShipmentItem, groups: ProductGroup[]): ComputedItem {
  const g = groups.find((x) => x.name === item.group_name);
  const yieldPerKg = item.yield_per_kg ?? g?.yield_per_kg ?? null;
  const unitPrice = item.unit_price ?? g?.unit_price ?? null;
  return {
    id: item.id,
    group_name: item.group_name,
    qty: item.qty,
    yield_per_kg: yieldPerKg,
    unit_price: unitPrice,
    kg: yieldPerKg ? item.qty / yieldPerKg : 0,
    value: unitPrice ? item.qty * unitPrice : 0,
  };
}

export function totals(items: ComputedItem[]) {
  return items.reduce(
    (acc, i) => ({ kg: acc.kg + i.kg, value: acc.value + i.value }),
    { kg: 0, value: 0 },
  );
}
