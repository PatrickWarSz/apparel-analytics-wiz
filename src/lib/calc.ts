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

export type RoundedRow = { id: string; group_name: string; from: number; to: number; kg: number };

/**
 * Arredonda as quantidades para que cada item feche em kg inteiros de tecido,
 * mantendo o total de kg da remessa o mais próximo possível do original
 * (método do maior resto — a sobra vai para os itens de maior peso na distribuição).
 */
export function roundShipment(items: ShipmentItem[], groups: ProductGroup[]): RoundedRow[] {
  const computed = items
    .map((i) => ({ item: i, c: computeItem(i, groups) }))
    .filter((x) => x.c.yield_per_kg && x.c.yield_per_kg > 0 && x.c.qty > 0);
  if (!computed.length) return [];

  const exact = computed.map((x) => x.c.qty / (x.c.yield_per_kg as number));
  const totalKg = exact.reduce((a, b) => a + b, 0);
  const targetKg = Math.max(computed.length, Math.round(totalKg));

  const base = exact.map((k) => Math.max(1, Math.floor(k)));
  let diff = targetKg - base.reduce((a, b) => a + b, 0);

  const order = exact
    .map((k, idx) => ({ idx, rest: k - Math.floor(k), size: k }))
    .sort((a, b) => b.rest - a.rest || b.size - a.size);

  let i = 0;
  while (diff > 0) {
    base[order[i % order.length].idx] += 1;
    diff--;
    i++;
  }
  // remove kg dos itens com menor resto, sem zerar ninguém
  const reverse = [...order].reverse();
  i = 0;
  let guard = 0;
  while (diff < 0 && guard < 10000) {
    const idx = reverse[i % reverse.length].idx;
    if (base[idx] > 1) {
      base[idx] -= 1;
      diff++;
    }
    i++;
    guard++;
  }

  return computed.map((x, n) => ({
    id: x.item.id,
    group_name: x.c.group_name,
    from: x.c.qty,
    to: base[n] * (x.c.yield_per_kg as number),
    kg: base[n],
  }));
}
