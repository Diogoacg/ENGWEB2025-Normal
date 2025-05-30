# Template Engenharia Web

Template para a realização de provas da UC de `Engenharia Web` do 3ºano da `Licenciatura em Engenharia Informática` da `Universidade do Minho`.

## Environment Variables

Como pré requisito é necessário criar um fichiro `.env` na raiz do projeto. Esse ficheiro deve conter as seguintes VARIÁVEIS:

`DATABASE` // A Database pedida no enuciado.

`MONGO_PORT` // A porta no qual a base de dados MongoDB está a escuta.

`BACKEND_PORT`// A porta pedida no EX1

`FRONTEND_PORT`// A porta pedida no EX2

Existe um ficheiro exemplo `dotenv` que contêm valores default para essas variaveis.

## O Que Fazer

### Formatar o dataset

Limpar o dataset fornecido, corrigindo os erros e formatando-o para um formato JSON.
!(Alterar/Acrescentar o campo `_id` ao dataset)!

[Opção 1](https://jsonformatter.curiousconcept.com/)

[Opção 2](https://jsonformatter.org/)

### Criar a Base de Dados

Para a criação do container com a base de dados MongoDB é necessário colocar o dataset fornecido na pasta `datasets` no formato de JsonArray, com as correções necessárias e com a coleção de destino como nome de ficheiro para a importação ser realizada automaticamente.

Exemplo:

```
---------------------------------------------------------------------
Importa-o numa base de dados em MongoDB com os seguintes parâmetros:
    database: -d base_de_dados_de_livros
    collection: -c livros
---------------------------------------------------------------------
.env

DATABASE=base_de_dados_de_livros
---------------------------------------------------------------------
ficheiros:
!(O nome do ficheiro JSON é o nome da coleção, basta alterar)!

.
└── datasets
   └── livros.json
---------------------------------------------------------------------
```

### Inicializar o serviço

!(UTILIZAR `--build --force-recreate` no comando para os containers serem "atualizados")!

Para a inicialização de um serviço único em docker basta executar `docker-compose up --build --force-recreate <nome do serviço>`. Os serviços disponíveis são `mongodb`, `backend` e `frontend`.

Para executar o serviço completo basta executar `docker-compose up --build --force-recreate`

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
