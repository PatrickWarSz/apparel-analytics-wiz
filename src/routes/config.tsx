import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Company, Factory, ProductGroup } from "@/lib/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/config")({
  head: () => ({
    meta: [
      { title: "Cadastros — Central de Remessa" },
      {
        name: "description",
        content: "Empresas, grupos de produto com rendimento e preço, e limites dos MEIs.",
      },
      { property: "og:title", content: "Cadastros — Central de Remessa" },
      { property: "og:description", content: "Rendimentos, preços por peça e limites dos MEIs." },
    ],
  }),
  component: () => (
    <AppShell>
      <Config />
    </AppShell>
  ),
});

function useTable<T>(table: "companies" | "product_groups" | "factories", key: string) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("sort_order");
      if (error) throw error;
      return data as T[];
    },
  });
}

function Config() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Cadastros</h1>
        <p className="text-sm text-muted-foreground">
          Tudo aqui é editável e vale para os cálculos de remessa e industrialização.
        </p>
      </div>
      <Groups />
      <div className="grid gap-8 lg:grid-cols-2">
        <Companies />
        <Factories />
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{hint}</p>
      {children}
    </section>
  );
}

function Groups() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: groups = [] } = useTable<ProductGroup>("product_groups", "groups");
  const [name, setName] = useState("");

  const save = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ProductGroup> }) => {
      const { error } = await supabase.from("product_groups").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("product_groups").insert({
        user_id: user!.id,
        name: name.trim().toUpperCase(),
        kind: "propria",
        sort_order: groups.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (e: Error) => toast.error(e.message.includes("duplicate") ? "Grupo já existe" : e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });

  return (
    <Section
      title="Grupos de produto"
      hint="Rendimento = peças por kg de tecido. Valor = preço por peça na industrialização. Deixe em branco o que ainda não souber."
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grupo</TableHead>
            <TableHead className="w-40">Tipo</TableHead>
            <TableHead className="w-36">Rendimento (pç/kg)</TableHead>
            <TableHead className="w-36">Valor por peça</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((g) => (
            <TableRow key={g.id}>
              <TableCell className="font-semibold">{g.name}</TableCell>
              <TableCell>
                <Select
                  value={g.kind}
                  onValueChange={(v) => save.mutate({ id: g.id, patch: { kind: v as ProductGroup["kind"] } })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propria">Fabricação própria</SelectItem>
                    <SelectItem value="revenda">Revenda</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <NumberCell
                  value={g.yield_per_kg}
                  onCommit={(v) => save.mutate({ id: g.id, patch: { yield_per_kg: v } })}
                />
              </TableCell>
              <TableCell>
                <NumberCell
                  value={g.unit_price}
                  step="0.01"
                  onCommit={(v) => save.mutate({ id: g.id, patch: { unit_price: v } })}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(g.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Novo grupo (ex.: CROPPED)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="secondary" disabled={!name.trim()} onClick={() => add.mutate()}>
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>
    </Section>
  );
}

export function NumberCell({
  value,
  onCommit,
  step = "1",
  className = "",
}: {
  value: number | null;
  onCommit: (v: number | null) => void;
  step?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState<string>(value == null ? "" : String(value));
  const [focused, setFocused] = useState(false);
  if (!focused && draft !== (value == null ? "" : String(value))) {
    setDraft(value == null ? "" : String(value));
  }
  return (
    <Input
      className={`num h-8 ${className}`}
      type="number"
      step={step}
      value={draft}
      onFocus={() => setFocused(true)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setFocused(false);
        const parsed = draft.trim() === "" ? null : Number(draft.replace(",", "."));
        if (parsed !== value && (parsed === null || Number.isFinite(parsed))) onCommit(parsed);
      }}
    />
  );
}

function Companies() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: companies = [] } = useTable<Company>("companies", "companies");
  const [name, setName] = useState("");

  const save = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Company> }) => {
      const { error } = await supabase.from("companies").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("companies").insert({
        user_id: user!.id,
        name: name.trim().toUpperCase(),
        match_key: name.trim().split(" ")[0]?.toUpperCase() ?? "",
        sort_order: companies.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  return (
    <Section title="Empresas" hint="A palavra-chave é usada para reconhecer a empresa pelo nome do arquivo.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-40">Palavra-chave</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <TextCell value={c.name} onCommit={(v) => save.mutate({ id: c.id, patch: { name: v } })} />
              </TableCell>
              <TableCell>
                <TextCell
                  value={c.match_key}
                  onCommit={(v) => save.mutate({ id: c.id, patch: { match_key: v } })}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(c.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-2">
        <Input placeholder="Nova empresa" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="secondary" disabled={!name.trim()} onClick={() => add.mutate()}>
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>
    </Section>
  );
}

function Factories() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: factories = [] } = useTable<Factory>("factories", "factories");
  const [name, setName] = useState("");

  const save = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Factory> }) => {
      const { error } = await supabase.from("factories").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factories"] }),
  });
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("factories").insert({
        user_id: user!.id,
        name: name.trim().toUpperCase(),
        monthly_limit: 0,
        sort_order: factories.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["factories"] });
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("factories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factories"] }),
  });

  return (
    <Section title="Facções (MEI)" hint="Limite mensal em reais para não estourar o teto da nota.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-40">Limite mensal (R$)</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {factories.map((f) => (
            <TableRow key={f.id}>
              <TableCell>
                <TextCell value={f.name} onCommit={(v) => save.mutate({ id: f.id, patch: { name: v } })} />
              </TableCell>
              <TableCell>
                <NumberCell
                  value={f.monthly_limit}
                  step="0.01"
                  onCommit={(v) => save.mutate({ id: f.id, patch: { monthly_limit: v ?? 0 } })}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(f.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-2">
        <Input placeholder="Nova facção" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="secondary" disabled={!name.trim()} onClick={() => add.mutate()}>
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>
    </Section>
  );
}

export function TextCell({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  if (!focused && draft !== value) setDraft(value);
  return (
    <Input
      className="h-8"
      value={draft}
      onFocus={() => setFocused(true)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setFocused(false);
        if (draft !== value) onCommit(draft);
      }}
    />
  );
}
