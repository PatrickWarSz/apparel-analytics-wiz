# Sistema de Vendas, Remessa e Industrialização

Programa em português para importar as planilhas de vendas das 4 empresas, consolidar por grupo de produto e montar as notas de remessa/industrialização distribuídas entre os MEIs, com histórico por mês.

## 1. Importação das planilhas

- Tela de importação: arrasta/seleciona os arquivos `.xls`/`.xlsx` (as planilhas atuais são `.xls` antigo — o leitor usado suporta os dois).
- Leitura: coluna B = Descrição, coluna C = Quant., coluna E = Grupo. Cabeçalho detectado automaticamente; linhas sem grupo são ignoradas.
- A empresa é sugerida pelo nome do arquivo (CR / RC / COSTA / REZENDE) e pode ser trocada na tela antes de confirmar.
- Regra dos conjuntos: `CONJUNTO DE LEGGING` vira 1 TOP + 1 LEGGING por unidade; `CONJUNTO DE SHORT` vira 1 TOP + 1 SHORT. O sistema mostra explicitamente quanto veio de conjunto.
- Classificação: REVENDA = SAMBA CANCAO, CALCINHA, CUECA. Os demais grupos são FABRICAÇÃO PRÓPRIA. Grupos novos e desconhecidos aparecem sinalizados para você marcar como própria ou revenda.
- Cada importação fica ligada a um mês de referência (ex.: 07/2026).

Conferência com os arquivos enviados (após destrinchar conjuntos):
CR — Legging 1.917, Top 403, Short 142, Macacão 211, Macaquinho 14, Biquíni 7, Camisa Térmica 1.
Costa — Legging 2.948, Top 1.023, Short 153, Macacão 6, Macaquinho 17, Biquíni 49.
Rezende — Legging 1.343, Top 496, Short 49, Macacão 25, Macaquinho 9.
RC — Camisa Térmica 69 (o resto é revenda).

## 2. Resumo de vendas

- Tabela grupos × empresas com total por empresa e total geral, separando Fabricação Própria e Revenda.
- Toda quantidade é editável antes de gerar a remessa (ajuste manual sobrescreve o valor da planilha, com indicação visual de "ajustado" e opção de voltar ao valor original).

## 3. Cadastros editáveis

- **Grupos de produto**: nome, tipo (própria/revenda), rendimento (peças por kg) e valor por peça. Já vem com LEGGING 20 / R$0,50, SHORT 30 / R$0,25, TOP 60 / R$0,10, CALCINHA 80 / R$0,05, CAMISA TERMICA 30 / R$0,50; os demais ficam em branco para você preencher. Pode adicionar e remover grupos.
- **Empresas**: as 4 já cadastradas, com opção de adicionar/editar.
- **MEIs (facções)**: nome e limite mensal em R$ (HELLEM 5.000, RAFAEL 3.000), editáveis, com opção de adicionar novos.
- **Tecido**: preço por kg (ex.: R$ 15,90), editável por mês.

## 4. Remessa e industrialização

- Botão "Gerar remessa do mês": cria, para cada empresa com produção própria, um bloco com os grupos, quantidade, kg (quantidade ÷ rendimento) e valor (quantidade × valor unitário).
- Você escolhe em cada bloco qual MEI recebe aquela empresa (seletor).
- Botão "+" para adicionar blocos extras/avulsos manualmente (empresa, grupo, quantidade livres) — como os "(extra)" do seu bloco de notas.
- Todas as linhas continuam editáveis depois de gerada a remessa (alterar quantidade, adicionar ou remover item, remover bloco).
- Por MEI: total a faturar no mês, limite, saldo restante e alerta visual quando passar do limite.
- Por remessa: total de kg de tecido e valor do tecido (kg × preço/kg), mais o total a faturar da industrialização.
- Exportar/copiar o resumo no mesmo formato do seu bloco de notas (texto pronto para WhatsApp) e imprimir/PDF.

## 5. Histórico

- Cada mês fica salvo (importações, ajustes, remessas, distribuição por MEI) e pode ser reaberto, duplicado ou excluído. Lista de meses na tela inicial.

## Detalhes técnicos

- Lovable Cloud para persistência: tabelas de empresas, grupos (rendimento/preço), MEIs (limite), meses de referência, linhas de vendas importadas, ajustes manuais, remessas e itens de remessa. Acesso protegido por login simples de e-mail/senha, com RLS por usuário.
- Parsing das planilhas no navegador com SheetJS (suporta BIFF `.xls` e `.xlsx`); nada é enviado a serviços externos.
- Cálculos em números inteiros de centavos para evitar erro de arredondamento; kg exibido com 3 casas.
- Interface em português, layout de painel operacional denso (tabelas legíveis, foco em conferência rápida), sem visual genérico.
