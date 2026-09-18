# Revenda: equilíbrio entre o que foi vendido e o que entrou em nota

Hoje o rateio do ciclo divide as peças da nota só pela **porcentagem** do mês de referência. Isso explica o desequilíbrio que você viu: se a CR vendeu 1.000 e a RC 10, a divisão respeita a proporção do ciclo, mas ninguém está somando o acumulado — então uma empresa pode terminar o mês com menos nota do que vendeu e a outra com sobra virando estoque.

A correção tem duas partes: um painel de conferência e um rateio que olha o que ainda falta.

## 1. Nova aba "Cobertura fiscal"

Para o mês escolhido, por empresa · modelo · tamanho:

```text
Samba Canção — GG
  RC FITNESS   vendeu 1.822   entrou 1.084   falta 738
  CR FITNESS   vendeu 27      entrou 16      falta 11
  COSTA        vendeu 0       entrou 40      sobra 40
```

- **vendeu**: vendas importadas da planilha do mês (pelo código já confirmado).
- **entrou**: soma de todos os rateios de ciclos fechados cuja data cai naquele mês.
- **falta / sobra / ok**, com destaque só para o que está fora do equilíbrio.
- Totais por empresa e por modelo no topo, além do total geral do mês (vendido x entrado, diferença em peças e em %).
- Filtro para mostrar apenas as linhas desequilibradas, que é o que interessa na conferência.

## 2. Rateio do ciclo passa a distribuir pelo que falta

O botão de sugestão e o preenchimento automático mudam de critério:

1. Calcula, para cada modelo+tamanho, quanto **ainda falta** de nota em cada empresa no mês em curso (vendido no mês de referência − já entrado em ciclos daquele mês).
2. Distribui as peças da nota primeiro cobrindo esses saldos, na ordem de quem está mais descoberto.
3. Se sobrarem peças depois de cobrir tudo, o resto vai pela proporção histórica (comportamento atual).
4. Se nenhuma empresa tem saldo em aberto (ou não há histórico), cai direto na proporção atual — nada regride.

Os números continuam inteiros (maiores restos), você continua podendo digitar em cima, e cada linha mostra o saldo em aberto ao lado da referência: `ref.: 1.822 (99%) · falta 738`.

## 3. Aviso na hora de fechar

Antes de fechar o ciclo, um resumo discreto diz se aquela distribuição deixa alguma empresa estourando o vendido do mês (viraria estoque) — aviso, sem bloquear, já que a decisão é sua.

## Detalhes técnicos

- Nova função `resaleCoverage(sales, codeMap, models, allocations, cycles, periodId)` em `src/lib/resale.ts`: devolve vendido, entrado e saldo por empresa+modelo+tamanho, com a mesma dedução de tamanho por descrição já usada em `resaleReference`.
- `src/routes/_authenticated/revenda.tsx`: nova aba usando essa função; `buildSuggestion` em `Rateio` passa a receber o mapa de saldos e aplica cobertura-primeiro antes do rateio proporcional.
- Sem mudança de banco: tudo é calculado a partir de `resale_sales`, `resale_code_map`, `resale_cycles` e `resale_cycle_allocations` já existentes; nenhum dado gravado é alterado.
