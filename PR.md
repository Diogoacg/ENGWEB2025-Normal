# Relatório do Projeto Eurovision Song Contest

Este documento descreve a implementação do projeto Eurovision Song Contest, incluindo a persistência de dados, configuração da base de dados, instruções para executar as aplicações desenvolvidas e as queries implementadas.

## Persistência de Dados

O projeto utiliza MongoDB como sistema de gerenciamento de base de dados. A persistência de dados é implementada da seguinte forma:

- **Base de dados**: `eurovisao`
- **Coleção principal**: `edicoes`
- **Modelo de dados**: Esquema flexível implementado em edicao.js, permitindo armazenar documentos sem uma estrutura fixa.

O modelo de dados é intencionalmente flexível para acomodar a estrutura variável dos dados do Eurovision ao longo dos anos:

```js
const mongoose = require("mongoose");
const edicaoSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model("Edicao", edicaoSchema, "edicoes");
```

## Preparação e Importação de Dados

### Limpeza e Preparação do Dataset

O processo começou com a limpeza dos dados usando um script Python:

```bash
python3 ./datasets/clean_up.py
```

Este script processou os dados brutos e gerou dois ficheiros:

- `dataset_array.json` - Uma versão formatada como array JSON para importação

O script identificou 65 edições do Eurovision com anos desde 1956 até ao presente.

### Setup da Base de Dados MongoDB

1. Criação do container MongoDB:

   ```bash
   docker run -d --name mongo-eurovisao -p 27017:27017 mongo
   ```

2. Cópia do dataset para o container:

   ```bash
   docker cp dataset_array.json mongo-eurovisao:/dataset_array.json
   ```

3. Importação dos dados usando mongoimport:

   ```bash
   docker exec -it mongo-eurovisao mongoimport -d eurovisao -c edicoes --file /dataset_array.json --jsonArray
   ```

   Resultado: `65 document(s) imported successfully. 0 document(s) failed to import.`

4. Verificação da importação através do console MongoDB:
   ```bash
   docker exec -it mongo-eurovisao mongosh
   use eurovisao
   ```

## Queries MongoDB Implementadas

As seguintes queries foram desenvolvidas para analisar os dados do Eurovision (`ex1/queries.txt`):

1. **Contagem total de registos na base de dados**:

   ```javascript
   db.edicoes.countDocuments();
   ```

2. **Contagem de edições vencidas pela Irlanda**:

   ```javascript
   db.edicoes.countDocuments({ vencedor: "Ireland" });
   ```

3. **Lista de intérpretes ordenada alfabeticamente (sem repetições)**:

   ```javascript
   db.edicoes.aggregate([
     { $unwind: "$musicas" },
     { $group: { _id: "$musicas.intérprete" } },
     { $match: { _id: { $ne: null } } },
     { $sort: { _id: 1 } },
     { $project: { _id: 0, interprete: "$_id" } },
   ]);
   ```

4. **Distribuição de músicas por edição**:

   ```javascript
   db.edicoes.aggregate([
     {
       $project: {
         id: 1,
         ano: 1,
         numeroMusicas: { $size: { $ifNull: ["$musicas", []] } },
       },
     },
     { $sort: { ano: 1 } },
   ]);
   ```

5. **Distribuição de vitórias por país**:
   ```javascript
   db.edicoes.aggregate([
     { $match: { vencedor: { $exists: true, $ne: null } } },
     {
       $group: {
         _id: "$vencedor",
         numeroVitorias: { $sum: 1 },
       },
     },
     { $sort: { numeroVitorias: -1 } },
   ]);
   ```

## Estrutura do Projeto

### API Backend (ex1)

- **Tecnologia**: Node.js + Express + Mongoose
- **Porta**: 25000
- **Principais componentes**:
  - Controladores em edicaoController.js
  - Modelo de dados em edicao.js
  - Configuração do servidor em app.js

### Interface Web (ex2)

- **Tecnologia**: Node.js + Express + Pug templates
- **Porta**: 25001
- **Principais componentes**:
  - Templates Pug para visualização (ex2/views/index.pug, edicao.pug, ex2/views/pais.pug)
  - Configuração do servidor em app.js

## Como Executar as Aplicações

### Executar Localmente

#### Backend (API)

```bash
cd ex1
npm install
npm start
```

A API estará disponível em http://localhost:25000.

#### Frontend (Interface Web)

```bash
cd ex2
npm install
npm start
```

A interface web estará disponível em http://localhost:25001.

## Verificação da Instalação

1. Para verificar a API:

   - http://localhost:25000/edicoes (lista todas as edições)
   - http://localhost:25000/paises?papel=org (lista países organizadores)
   - http://localhost:25000/paises?papel=venc (lista países vencedores)
   - http://localhost:25000/interpretes (lista todos os intérpretes)

2. Para verificar a interface web, acesse:
   - http://localhost:25001 (página principal com a lista de edições)

## Observações

- Os datasets originais estão disponíveis na pasta datasets
- A interface web consome os dados da API backend
- Total de 65 edições do Eurovision Song Contest no dataset
