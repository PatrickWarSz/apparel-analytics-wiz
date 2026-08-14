import * as XLSX from "xlsx";

export type ParsedLine = { code: string; description: string; group: string; qty: number };

export type ParsedSheet = {
  fileName: string;
  totals: Record<string, { qty: number; fromSets: number }>;
  lines: ParsedLine[];
  rows: number;
  ignored: number;
};


const norm = (v: unknown) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

/** Lê uma planilha de vendas (colunas B=Descrição, C=Quant., E=Grupo) e soma por grupo,
 *  destrinchando CONJUNTO DE LEGGING / CONJUNTO DE SHORT em TOP + peça base. */
export function parseSalesFile(fileName: string, data: ArrayBuffer): ParsedSheet {
  const wb = XLSX.read(data, { type: "array" });
  const sheetName = wb.SheetNames[0] ?? "";
  const ws = wb.Sheets[sheetName];
  const rows = ws ? XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, blankrows: false }) : [];


  let qtyIdx = 2;
  let groupIdx = 4;
  let codeIdx = 0;
  let descIdx = 1;
  let start = 0;

  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const r = (rows[i] ?? []).map(norm);
    const g = r.findIndex((c) => c === "GRUPO");
    const q = r.findIndex((c) => c.startsWith("QUANT"));
    const cd = r.findIndex((c) => c.startsWith("CODIGO"));
    const ds = r.findIndex((c) => c.startsWith("DESCRICAO"));
    if (g >= 0 || q >= 0) {
      if (g >= 0) groupIdx = g;
      if (q >= 0) qtyIdx = q;
      if (cd >= 0) codeIdx = cd;
      if (ds >= 0) descIdx = ds;
      start = i + 1;
      break;
    }
  }

  const totals: Record<string, { qty: number; fromSets: number }> = {};
  const add = (group: string, qty: number, fromSet: boolean) => {
    if (!group || !qty) return;
    const t = (totals[group] ??= { qty: 0, fromSets: 0 });
    t.qty += qty;
    if (fromSet) t.fromSets += qty;
  };

  const byCode = new Map<string, ParsedLine>();
  let counted = 0;
  let ignored = 0;

  for (let i = start; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const group = norm(row[groupIdx]);
    const qty = Number(row[qtyIdx]);
    if (!group || !Number.isFinite(qty) || qty === 0) {
      ignored++;
      continue;
    }
    counted++;

    const code = String(row[codeIdx] ?? "").trim();
    if (code) {
      const cur = byCode.get(code);
      if (cur) cur.qty += qty;
      else
        byCode.set(code, {
          code,
          description: String(row[descIdx] ?? "").trim(),
          group,
          qty,
        });
    }

    if (group.startsWith("CONJUNTO DE ")) {
      const base = group.replace("CONJUNTO DE ", "").trim();
      add(base, qty, true);
      add("TOP", qty, true);
    } else {
      add(group, qty, false);
    }
  }

  return { fileName, totals, lines: [...byCode.values()], rows: counted, ignored };

}

export function guessCompany(fileName: string, companies: { id: string; match_key: string; name: string }[]) {
  const n = norm(fileName);
  const hit = companies.find((c) => c.match_key && n.includes(norm(c.match_key)));
  return hit ?? companies.find((c) => n.includes(norm(c.name.split(" ")[0]))) ?? null;
}
