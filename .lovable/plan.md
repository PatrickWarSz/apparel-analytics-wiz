# Sugestões de melhorias práticas

Objetivo: manter o sistema enxuto, mas acrescentar controles que reduzam risco de erro e ajudem na tomada de decisão da operação.

## O que já está maduro
- Importação de planilhas, destrincho de conjuntos, ajuste manual, cálculo de remessa e industrialização.
- Arredondamento automático para kg inteiros.
- Estoque fiscal de tecido.
- Módulo de revenda com notas de balcão, rateio e histórico.
- Login obrigatório (reintroduzido).

## Melhorias propostas

### 1. Monitor de limite MEI em tempo real
- Mostrar, na aba "Remessa", um card por MEI com:
  - limite mensal;
  - total já comprometido no mês (remessas do período + remessas extras);
  - saldo restante;
  - alerta visual quando passar de 80% e vermelho quando estourar.
- Replicar o mesmo alerta no texto da mensagem de WhatsApp.
- Impacto: evita nota acima do teto do MEI.

### 2. Auditoria do arredondamento
- Toda vez que clicar em "Arredondar", salvar um snapshot com:
  - data/hora;
  - quantidade original e arredondada de cada grupo;
  - kg total antes e depois.
- Adicionar aba "Histórico de arredondamento" no mês para consultar depois o que foi alterado.
- Impacto: rastreabilidade fiscal e operacional.

### 3. Dashboard comparativo na tela inicial
- Substituir/acompanhar a lista de meses com um resumo visual simples:
  - vendas por grupo nos últimos meses (tabela + mini gráfico);
  - comparação do mês ativo vs mês de referência;
  - total de remessas por MEI no mês selecionado.
- Impacto: visão rápida do negócio sem entrar em cada mês.

### 4. Fechamento / congelamento de mês
- Botão "Fechar mês" no workspace do período.
- Após fechado, os dados de vendas e remessa ficam somente leitura, evitando alterações acidentais depois que a nota foi emitida.
- Pode reabrir com um botão de "Reabrir" se precisar corrigir.
- Impacto: segurança no processo mensal.

### 5. Clonar estrutura do mês anterior
- Ao criar um novo mês, oferecer opção de copiar a estrutura de remessas do mês anterior (empresas + MEI escolhido), sem copiar as quantidades vendidas.
- Impacto: agilidade na montagem do próximo ciclo.

### 6. Registro de pagamento às facções
- Campo opcional nas remessas: "pago em" + valor pago.
- Aparece no histórico e pode ser usado para saber quem ainda está com nota em aberto.
- Impacto: controle financeiro simples.

## Ordem de implementação sugerida
1. Monitor de limite MEI em tempo real.
2. Auditoria do arredondamento.
3. Fechamento de mês.
4. Dashboard comparativo.
5. Clonar estrutura do mês anterior.
6. Registro de pagamento às facções.

## Escopo inicial recomendado
Se quiser começar sem encher de recurso, sugiro fazer as três primeiras (1, 2, 3): são rápidas, reduzem risco fiscal e dão mais confiança no fechamento mensal.
