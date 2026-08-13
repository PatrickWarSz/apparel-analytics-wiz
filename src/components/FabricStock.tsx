import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine, Trash2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { computeItem, totals as sumTotals } from "@/lib/calc";
import { useShipments } from "@/lib/useShipments";
import { kgNum, type Company, type FabricMove, type Period, type ProductGroup } from "@/lib/domain";

export function FabricStock({
  period,
  companies,
  groups,
  compact = false,
}: {
  period?: Period | null;
  companies: Company[];
  groups: ProductGroup[];
  compact?: boolean;
}) {
  const qc = useQueryClient();
  const { shipments, items } = useShipments(period?.id ?? "");


  const { data: moves = [] } = useQuery({
    queryKey: ["fabric_moves"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_moves")
        .select("*")
        .order("moved_on", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FabricMove[];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["fabric_moves"] });

  const balance = (companyId: string) =>
    moves
      .filter((m) => m.company_id === companyId)
      .reduce((acc, m) => acc + (m.kind === "entrada" ? m.kg : -m.kg), 0);

  const applyShipments = useMutation({
    mutationFn: async () => {
      const done = new Set(moves.filter((m) => m.shipment_id).map((m) => m.shipment_id));
      const rows = shipments
        .filter((s) => s.company_id && !done.has(s.id))
        .map((s) => {
          const t = sumTotals(items.filter((i) => i.shipment_id === s.id).map((i) => computeItem(i, groups)));
          return {
            company_id: s.company_id!,
            period_id: period.id,
            shipment_id: s.id,
            kind: "saida",
            kg: Number(t.kg.toFixed(3)),
            doc: "",
            note: `Remessa ${period.label} — ${s.title}`,
          };
        })
        .filter((r) => r.kg > 0);
      if (!rows.length) return 0;
      const { error } = await supabase.from("fabric_moves").insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (n) => {
      toast.success(n ? `${n} baixa(s) lançada(s) no estoque` : "Nenhuma remessa nova para baixar");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fabric_moves").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Saldo fiscal de tecido por empresa. Lance as entradas de compra (com a nota) e baixe
          automaticamente os kg das remessas geradas neste mês.
        </p>
        <Button onClick={() => applyShipments.mutate()} disabled={applyShipments.isPending}>
          <Zap className="size-4" /> Baixar remessas de {period.label}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((c) => {
          const saldo = balance(c.id);
          return (
            <div key={c.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="font-bold">{c.name}</p>
              <p className={`num mt-1 text-2xl font-extrabold ${saldo < 0 ? "text-destructive" : ""}`}>
                {kgNum(saldo)} kg
              </p>
              <p className="num text-xs text-muted-foreground">
                entradas{" "}
                {kgNum(
                  moves.filter((m) => m.company_id === c.id && m.kind === "entrada").reduce((a, m) => a + m.kg, 0),
                )}{" "}
                · saídas{" "}
                {kgNum(
                  moves.filter((m) => m.company_id === c.id && m.kind === "saida").reduce((a, m) => a + m.kg, 0),
                )}
              </p>
            </div>
          );
        })}
      </div>

      <MoveForm companies={companies} periodId={period.id} onDone={refresh} />

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-3 font-bold">Movimentações</h3>
        {moves.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma movimentação lançada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Data</TableHead>
                  <TableHead className="min-w-40">Empresa</TableHead>
                  <TableHead className="w-28">Tipo</TableHead>
                  <TableHead className="w-28 text-right">kg</TableHead>
                  <TableHead className="w-32">Nota</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {moves.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="num">
                      {new Date(`${m.moved_on}T12:00:00`).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{companies.find((c) => c.id === m.company_id)?.name ?? "—"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold uppercase ${
                          m.kind === "entrada" ? "text-accent" : "text-destructive"
                        }`}
                      >
                        {m.kind === "entrada" ? (
                          <ArrowDownToLine className="size-3" />
                        ) : (
                          <ArrowUpFromLine className="size-3" />
                        )}
                        {m.kind}
                      </span>
                    </TableCell>
                    <TableCell className="num text-right font-semibold">
                      {m.kind === "entrada" ? "+" : "−"}
                      {kgNum(m.kg)}
                    </TableCell>
                    <TableCell className="num">{m.doc || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.note || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(m.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}

function MoveForm({
  companies,
  periodId,
  onDone,
}: {
  companies: Company[];
  periodId: string;
  onDone: () => void;
}) {
  const [companyId, setCompanyId] = useState("");
  const [kind, setKind] = useState<"entrada" | "saida">("entrada");
  const [kg, setKg] = useState("");
  const [doc, setDoc] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("fabric_moves").insert({
        company_id: companyId,
        period_id: periodId,
        kind,
        kg: Number(kg.replace(",", ".")) || 0,
        doc,
        note,
        moved_on: date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lançamento salvo");
      setKg("");
      setDoc("");
      setNote("");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-3 font-bold">Novo lançamento</h3>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Empresa">
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder="Escolher" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tipo">
          <Select value={kind} onValueChange={(v) => setKind(v as "entrada" | "saida")}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Kg">
          <Input value={kg} onChange={(e) => setKg(e.target.value)} className="num w-28" placeholder="50,000" />
        </Field>
        <Field label="Nota fiscal">
          <Input value={doc} onChange={(e) => setDoc(e.target.value)} className="num w-32" placeholder="1234" />
        </Field>
        <Field label="Data">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="num w-40" />
        </Field>
        <Field label="Observação">
          <Input value={note} onChange={(e) => setNote(e.target.value)} className="w-56" placeholder="Compra de tecido" />
        </Field>
        <Button disabled={!companyId || !kg || save.isPending} onClick={() => save.mutate()}>
          Lançar
        </Button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
