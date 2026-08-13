# Fit Fabric Flow

vamos lá, vou te passar a minha ideia do programa que eu estou precisando, faça perguntas se necessário para entender primeiro, vou precisar de varias funcionalidades, mas o entendimento é simples

Primeiro, preciso de um programa que é praticamente uma calculadora, preciso que você entenda primeiro, funciona assim, eu tenho 4 empresas de ecommerce/marketplace, são elas, CR FITNESS, RC FITNESS, COSTA FITNESS, REZENDE FITNESS, todas essas lojas vendem em diversos ecommerces e marketplaces e ao final de cada mês eu tiro planilhas de relatorio de vendas dos produtos (as planilhas estão anexadas referente ao mes 07 julho, de todas as empresas) essas planilhas trazem na coluna B a "Descrição" que é o nome do produto, cor e tamanho, na coluna C a "Quant" que é a quantidade de vendas e na coluna "E" o grupo, que corresponde a coluna B descrição, são grupos: TOP, LEGGING, SHORT, MACAQUINHO, MACACAO, BIQUINI, CUECA, CALCINHA, SAMBA CANCAO, CAMISA TERMICA, destes definimos de REVENDA: samba cancao, calcinha e cueca, os demais são de fabricação própria. Também aparecerá em algumas planilhas o grupo "CONJUNTO DE LEGGING e CONJUNTO DE SHORT" que aqui é um ponto de atenção pois o conjunto se refere a 1 TOP e 1 LEGGING ou 1 TOP e 1 SHORT dependendo de qual é, então ele deve ser destrinchado e incluido aos outros TOP LEGGING E SHORT.

Oque eu faço com essa planilha atualmente? eu pego todas elas e somo cada categoria individualmente afim de descobrir quantas vendas totais de LEGGING eu tive no mês, de SHORT, de TOP, etc isso por enquanto explico somente ao que se referem produtos de FABRICAÇÂO PROPRIA e até aqui é isso que eu quero que o programa faça, eu importo as planilhas, ele identifica, faz a leitura das colunas celulas tudo certinho, faz a soma e me entrega quanto que tem de cada em cada empresa, no total delas a cada categoria.

a outra parte do programa, que é algo que também faço apos coletar o total de cada item, é fazer a REMESSA e INDUSTRIALIZAÇÂO, pois eu tendo os totais dos produtos de fabricação propria vendidos, eu posso gerar uma nota de industrialização para as FACCOES que costuram pra mim, que são duas atualmente, HELLEM e RAFAEL, são MEI e eles tem limite de real para a nota fiscal no maximo do MÊS, HELLEM 5000 e RAFAEL 3000, mas isso precisa ser variavel pois os limites podem mudar. a industrialização funciona assim eu tenho o GRUPO, o valor por unidade e o rendimento de cada. EX: LEGGING 1KG de tecido rende 20 LEGGING e cada unidade vale 0,5 centavos, nisso eu tiro a quantidade de KG pra nota de remessa e planejo a industrialização, ou seja 1000 vendas de legging na empresa CR vai ter uma nota de remessa de 50KG de tecido, pois pelo calculo 1KG rende 20 LEGGINGS logo 50KG vai me fazer 1000 LEGGINGS e cada LEGGING saindo a 0,5 vai ter na nota o valor de 500 reais e isso se repete com todos os produtos, cada um deles tem seu rendimento e seu preço, ao que se referem produtos de fabricação propria que vão para remessa e industrialização.

então fica assim, eu importo as planilhas, ela me da a quantidade em cada empresa (TOTAL de cada uma delas) eu aperto um botão para o sistema fazer todo o calculo e distribuição da REMESSA E DA INDUSTRIALIZAÇÂO entre os MEIS POR EMPRESA. EX: na CR deu 1000 leggings, 100 short, 100 tops tal valor total, eu quero mandar essa empresa pra hellem fazer, ela vai contar no saldo do mês dela pra ter cuidado pra não estourar o limite do mei dela, na outra empresa a mesma coisa, mando pro rafael, e assim vou manejando, a ideia é ter uma industrialização completa, tipo assim (anexado também o bloco de notas da remessa e industrialização) importante também, o tecido também tem seu valor por KG para saber quanto que dará a nota de remessa. Tem muitas outras coisas mas por enquanto é só isso, vou anexar tudo  

Os rendimentos (peças por kg), preços por peça e preço do tecido por kg devem ser editáveis na tela?

Sim, tudo editável

Os dados precisam ficar salvos entre sessões/dispositivos, ou basta calcular na hora?

Salvar histórico por mês

Como distribuir entre HELLEM e RAFAEL?

eu escolho qual mei recebe cada empresa, e também deve ter um + para eu adicionar extras quando precisar fazer remessas e industrialização avulsa manualmente

Preciso do rendimento (peças por kg de tecido) de cada grupo. Do seu bloco deduzi: CALCINHA 80/kg e CAMISA TERMICA 30/kg, e LEGGING 20/kg. Pode confirmar os demais (TOP, SHORT, MACAQUINHO, MACACAO, BIQUINI)?

Other: legging rende 20 e valor un 0,5, short rende 30 e valor unit 0,25, deixe campos para adicionar que eu adiciono manualmente o restante, ou removo, não precisa você fazer todos agora por mim

No bloco de notas a Costa aparece com 3.287 leggings, mas a planilha de julho soma 2.907 + 41 conjuntos. O sistema deve calcular sempre a partir da planilha, com ajuste manual quando você quiser?

essa que aparece no bloco de notas estava errado comparado as planilhas, serve somente de base pra entendimento, a ideia aqui é construir o programa, mas sim, o total vem da planilha, ela é a fonte REAL, mas eu sou livre pra editar, adicionar mais ou menos antes de gerar a remessa, e também depos que gerar a remessa eu também posso adicionar mais ou menos lá

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7fc1d0f0-2e26-4225-86c3-3f4a86731903).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
