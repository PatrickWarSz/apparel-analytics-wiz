# Revenda: notas de balcão, rateio entre empresas e mensagem para o fornecedor

Novo módulo "Revenda" (aba própria, ao lado de Cadastros e Estoque fiscal), com catálogo de modelos, lançamento das notas de balcão dia a dia e geração da mensagem de distribuição a cada ciclo (7/15 dias).

## 1. Catálogo de modelos de revenda

Cadastro fixo, já criado com os 10 modelos que você vende:

Samba Canção · Cueca Boxer Dryfit · Cueca Boxer Microfibra · Cueca Boxer Ciclista · Cueca Boxer Algodão · Cueca Boxer Plus Size · Calcinha Fio Duplo Microfibra · Calcinha Fio Dental Algodão · Calcinha Tanga Algodão · Conjunto Blogueirinha Feminino

Cada modelo tem sua grade de tamanhos própria (P/M/G/GG, G1/G2/G3, etc.), montada automaticamente conforme os tamanhos aparecem nas planilhas — e editável. Pode adicionar/remover/renomear modelos.

## 2. Identidade pelo Código (não pelo texto)

A identidade de cada produto é **empresa + código** (8000, 8106, 10002...), porque o texto da Descrição é genérico e varia.

- Ao importar a planilha de uma empresa, todo código de grupo de revenda (CUECA, CALCINHA, SAMBA CANCAO) é registrado.
- Códigos ainda não classificados aparecem numa fila "Códigos a confirmar": mostra código, descrição da planilha e quantidade vendida; você escolhe o modelo e o tamanho (ambos pré-sugeridos pelo texto, ex.: "CUECA BOXER MICROFIBRA G" → Cueca Boxer Microfibra / G).
- Confirmado uma vez, o código fica ligado ao modelo+tamanho para sempre. Trabalho inicial estimado: ~21 códigos na RC e ~4 na CR; Costa e Rezende ainda não têm nenhum.
- Dá para reclassificar um código depois, se errar.

## 3. Empresas de revenda (automático)

Nenhuma empresa é marcada à mão. Toda empresa cuja importação trouxe venda de grupo de revenda entra automaticamente no módulo. Hoje aparecem RC e CR; no dia em que a Rezende vender uma samba canção, ela passa a aparecer sozinha nas telas de rateio.

## 4. Notas de balcão (dia a dia)

Tela de lançamento rápido:

- Nova nota: data, fornecedor, número da nota (opcional).
- Itens: modelo + tamanho + quantidade, com teclado ágil (autocompletar por modelo, linha nova ao dar Enter).
- Cada nota nasce **pendente** (ainda não faturada).
- Lista das notas do período com total de peças, edição e exclusão.

## 5. Ciclo de faturamento e rateio

Botão "Fechar ciclo": junta todas as notas pendentes e monta a tela de distribuição, agrupada por modelo e, dentro dele, por tamanho.

Para cada tamanho:

```text
Samba Canção — GG      pego no balcão: 35
  RC Fitness   [ 35 ]   ref.: 1.734 vendidas (99%)
  CR Fitness   [  0 ]   ref.: 18 vendidas (1%)
  Costa        [    ]   sem histórico
```

- A referência vem das vendas do **mês calendário mais recente importado**, para aquele modelo+tamanho específico, por empresa (número absoluto + %). A tela deixa claro qual mês está servindo de referência.
- "Sem histórico" quando a empresa nunca vendeu aquele modelo/tamanho — campo livre, sem travar nem forçar zero.
- Você digita o número real. Um contador mostra distribuído x total pego e avisa (sem bloquear) quando sobra ou falta.
- Botão opcional "Sugerir pela referência" preenche tudo proporcionalmente, e você ajusta em cima.

Ao confirmar, o ciclo é salvo, as notas passam a **faturadas** e a mensagem é gerada.

## 6. Mensagem para o fornecedor

Exatamente no seu formato, pronta para copiar no WhatsApp:

```text
Samba canção
Distribuir como:
▸ CR Fitness: P 17 · M 84 · G 33 · GG 26
▸ RC Fitness: P 183 · M 266 · G 267 · GG 324

Cueca Plus Size
Distribuir como:
▸ RC Fitness: G1 85 · G2 105 · G3 145
```

Empresas com zero em todos os tamanhos de um modelo não aparecem naquele bloco. Botão copiar por modelo e copiar tudo.

## 7. Histórico

Lista de ciclos fechados (data, total de peças, empresas envolvidas), com a mensagem e o rateio reabríveis, e opção de reabrir um ciclo (volta as notas para pendentes) ou excluir.

## Detalhes técnicos

- Novas tabelas: `resale_models` (nome, tamanhos, ordem), `resale_code_map` (empresa + código → modelo + tamanho, único), `resale_sales` (período, empresa, código, descrição, qty — alimentada pela importação existente), `counter_notes` + `counter_note_items` (nota de balcão e seus itens, com status pendente/faturado), `resale_cycles` + `resale_cycle_allocations` (modelo, tamanho, empresa, quantidade). Mesmo padrão de acesso aberto das tabelas atuais, com GRANTs.
- A importação atual (`src/lib/xls.ts`) passa a preservar Código e Descrição das linhas de grupo de revenda, além do total por grupo que já usa para a remessa — a leitura da planilha não muda.
- Nova rota `/revenda` com abas: Notas de balcão · Rateio do ciclo · Mensagem · Códigos a confirmar · Modelos. `head()` próprio com título e descrição.
- Referência de rateio isolada numa função (`resaleReference`), para no futuro trocar "mês mais recente" por "últimos 15–30 dias" sem mexer no resto da tela.
