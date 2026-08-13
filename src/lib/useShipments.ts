import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Shipment, ShipmentItem } from "./domain";

export function useShipments(periodId: string) {
  const { data: shipments = [] } = useQuery({
    queryKey: ["shipments", periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("period_id", periodId)
        .order("sort_order");
      if (error) throw error;
      return data as Shipment[];
    },
  });

  const { data: items = [] } = useQuery({
    queryKey: ["shipment_items", periodId],
    enabled: shipments.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipment_items")
        .select("*")
        .in(
          "shipment_id",
          shipments.map((s) => s.id),
        )
        .order("sort_order");
      if (error) throw error;
      return data as ShipmentItem[];
    },
  });

  return { shipments, items };
}
