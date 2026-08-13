import { useMemo } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { computeItem, totals as sumTotals } from "@/lib/calc";
import { useShipments } from "@/lib/useShipments";
import {
  brl,
  int,
  kgNum,
  type Company,
  type Factory,
  type Period,
  type ProductGroup,
} from "@/lib/domain";

const money = (v: number) => `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export function Messages({
  period,
  companies,
  groups,
  factories,
}: {
  period: Period;
  companies: Company[];
  groups: ProductGroup[];
  factories: Factory[];
}) {
  const { shipments, items } = useShipments(period.id);

  const computedBy = useMemo(
    () =>
      shipments.map((s) => ({
        shipment: s,
        rows: items.filter((i) => i.shipment_id === s.id).map((i) => computeItem(i, groups)),
      })),
    [shipments, items, groups],
  );

  const consolidated = useMemo(() => {
    const byGroup = new Map<string, { qty: number; kg: number; value: number; unit: number | null }>();
    for (const { rows } of computedBy) {
      for (const r of rows) {
        const cur = byGroup.get(r.group_name) ?? { qty: 0, kg: 0, value: 0, unit: r.unit_price };
        byGroup.set(r.group_name, {
          qty: cur.qty + r.qty,
          kg: cur.kg + r.kg,
          value: cur.value + r.value,
          unit: cur.unit ?? r.unit_price,
        });
      }
    }
    const lines = [`*Remessa ${period.label}*`, ""];
    let kg = 0;
    let value = 0;
    for (const [name, t] of byGroup) {
      if (!t.qty) continue;
      kg += t.kg;
      value += t.value;
      lines.push(
        `${name} ${int(t.qty)} = ${money(t.unit ?? 0)} cada = ${money(t.value)} reais`,
      );
    }
    lines.push("", `Total: ${kgNum(kg)} kg · ${brl(value)}`);
    return lines.join("\n");
  }, [computedBy, period.label]);

  const perFactory = factories.map((f) => {
    const mine = computedBy.filter((c) => c.shipment.factory_id === f.id);
    const lines = [`*${f.name} — Remessa ${period.label}*`, ""];
    let total = 0;
    for (const { shipment, rows } of mine) {
      const company = companies.find((c) => c.id === shipment.company_id)?.name ?? shipment.title;
      lines.push(`▸ ${company}`);
      for (const r of rows) {
        if (!r.qty) continue;
        lines.push(`  ${r.group_name} ${int(r.qty)} = ${money(r.unit_price ?? 0)} cada = ${money(r.value)} reais`);
      }
      const t = sumTotals(rows);
      total += t.value;
      lines.push(`  Subtotal: ${kgNum(t.kg)} kg · ${brl(t.value)}`, "");
    }
    lines.push(`Total a faturar: ${brl(total)}`);
    const over = f.monthly_limit > 0 && total > f.monthly_limit;
    lines.push(
      over
        ? `⚠️ Passou do limite do MEI (${brl(f.monthly_limit)})`
        : `Limite do MEI: ${brl(f.monthly_limit)} · resta ${brl(Math.max(f.monthly_limit - total, 0))}`,
    );
    return { factory: f, text: mine.length ? lines.join("\n") : null };
  });

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Mensagem copiada");
  };

  if (!shipments.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Gere as remessas do mês para montar as mensagens.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Block title="Consolidada" text={consolidated} onCopy={copy} />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Por MEI</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {perFactory.map(({ factory, text }) =>
            text ? <Block key={factory.id} title={factory.name} text={text} onCopy={copy} /> : null,
          )}
        </div>
      </div>
    </div>
  );
}

function Block({
  title,
  text,
  onCopy,
}: {
  title: string;
  text: string;
  onCopy: (t: string) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        <Button variant="outline" size="sm" onClick={() => onCopy(text)}>
          <Copy className="size-4" /> Copiar
        </Button>
      </div>
      <pre className="num whitespace-pre-wrap rounded border border-border bg-secondary/40 p-4 text-sm leading-6">
        {text}
      </pre>
    </section>
  );
}
