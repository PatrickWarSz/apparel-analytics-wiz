/** Erros do banco traduzidos para mensagens que fazem sentido na tela. */

type MaybePgError = { code?: string; message?: string } | null | undefined;

export const isDuplicate = (e: MaybePgError) => e?.code === "23505";

export function friendlyError(e: unknown, fallback = "Não foi possível salvar") {
  const err = e as MaybePgError;
  if (isDuplicate(err)) return "Esse registro já existe — atualize a tela para ver o que já está salvo.";
  return err?.message || fallback;
}
