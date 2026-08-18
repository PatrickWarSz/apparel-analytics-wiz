import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { FabricStock } from "@/components/FabricStock";
import { supabase } from "@/integrations/supabase/client";
import type { Company, ProductGroup } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque fiscal de tecido — Central de Remessa" },
      {
        name: "description",
        content:
          "Saldo fiscal de tecido por empresa, lançamentos de entrada por nota e histórico de movimentações.",
      },
      { property: "og:title", content: "Estoque fiscal de tecido — Central de Remessa" },
      {
        property: "og:description",
        content: "Entradas por nota, saídas das remessas e saldo de tecido por empresa.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <Estoque />
    </AppShell>
  ),
});

function Estoque() {
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").order("sort_order");
      if (error) throw error;
      return data as Company[];
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["product_groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_groups").select("*").order("sort_order");
      if (error) throw error;
      return data as ProductGroup[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Estoque fiscal</h1>
        <p className="text-sm text-muted-foreground">
          Lançamentos, entradas por nota e todas as movimentações de tecido por empresa.
        </p>
      </div>
      <FabricStock companies={companies} groups={groups} />
    </div>
  );
}
