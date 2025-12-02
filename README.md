
# MeuCachorro.com

Seu sistema completo de gestão para petshops, onde você cadastra usuários, animais, consultas, serviços e ainda tem relatórios avançados e faturamento automático.
<img width="1190" height="938" alt="Image" src="https://github.com/user-attachments/assets/f52a9af9-309c-4ea0-9d6a-f127201075ba" />
# Banco de dados

Banco de dados utilizado foi o SQLServer, modelo de Entidade Relacionamento: 

![Image](https://github.com/user-attachments/assets/20fae620-8961-420e-b54e-f7af8189fb7e)

# 🐾 Introdução

O MeuCachorro.com é uma plataforma completa voltada para o gerenciamento de um petshop.
Ela permite controlar:

Usuários (clientes e funcionários)
Animais e seus donos
Consultas veterinárias
Serviços de banho e tosa
Animais perdidos
Relatórios avançados
Faturamento diário, semanal e mensal



# Tecnologias Utilizadas

## Linguagens
- C# (Backend - .NET Core)
- TypeScript (Frontend - React)



## Frameworks e Bibliotecas
- .NET Core (Desenvolvimento da API)
- React (Interface do usuário)
- React Bootstrap (Estilização da interface)
- Axios (Consumo da API)




# Requisitos e Como Rodar
## 🖥️ Requisitos
- .NET SDK 8.0
- Node.js versão 22
- SQL Server (local ou remoto)
- Gerenciador de pacotes npm ou yarn

## ▶️ Passo a Passo para Executar o Projeto

### 🔧 Backend (.NET)
```
dotnet ef database update  # (para aplicar as migrations no banco no Repositorio)
```
```
dotnet run
```
### 💻 Frontend (React com Vite)
```
npm install
npm run dev
```

### 📊 Estrutura das Tabelas

### 🏷️ Usuarios
| Coluna        | Tipo     | Observações                    |
| ------------- | -------- | ------------------------------ |
| UsuarioID     | `int`    | PK (chave primária)            |
| Nome          | `string` | Obrigatório                    |
| Email         | `string` | Obrigatório                    |
| Endereco      | `string` | Obrigatório                    |
| Telefone      | `string` | Obrigatório                    |
| SenhaHash     | `string` | Senha sem criptografia         |
| Ativo         | `bool`   | Indica se o usuário está ativo |
| TipoUsuarioID | `int`    | Enum → TiposUsuario            |

---

### 💸 Animais
| Coluna      | Tipo       | Observações                       |
| ----------- | ---------- | --------------------------------- |
| AnimalID    | `int`      | PK                                |
| Especie     | `string`   | Obrigatório                       |
| Nome        | `string`   | Obrigatório                       |
| Raca        | `string`   | Obrigatório                       |
| UrlImagem   | `string`   | Pode ser nulo                     |
| DataPerdido | `datetime` | Data em que o animal foi perdido  |
| Ativo       | `bool`     | Soft delete                       |
| Achado      | `bool`     | Indica se o animal foi encontrado |
| UsuarioID   | `int`      | FK → Usuario(UsuarioID)     
      
---

### 💸 Animais
| Coluna         | Tipo            | Observações                           |
| -------------- | --------------- | ------------------------------------- |
| ConsultaID     | `int`           | PK                                    |
| DataConsulta   | `datetime`      | Obrigatório                           |
| Descricao      | `string(500)`   | Obrigatório                           |
| Valor          | `decimal(18,2)` | Valor da consulta                     |
| AnimalID       | `int`           | FK → Animal(AnimalID)                 |
| UsuarioID      | `int`           | FK → Usuario(UsuarioID)               |
| TipoConsultaID | `int`           | Enum → TiposConsulta                  |
| TipoConsulta   | `int`           | Armazenado também (duplicado do enum) |
| Ativo          | `bool`          | Soft delete, padrão true              |


# Relacionamento

### 1.	Usuário possui N Animais
-	(Usuário)1 —— N(Animal)  
  	Implementado via FK Animal.UsuarioID.

### 2.	Animal tem N Consultas
-	(Animal)1 —— N(Consulta)
	Implementado via FK Consulta.AnimalID.
###  3.	Usuário realiza N Consultas
o	(Usuário)1 —— N(Consulta)
	Implementado via FK Consulta.UsuarioID.


# Implementação do Banco de Dados
SGBD e criação física
-	SGBD utilizado: SQL Server.
-	A estrutura das tabelas foi criada via Entity Framework Core (Code First + migrations).
-	O script de migração gera as tabelas Usuario, Animal e Consulta, além da tabela de histórico __EFMigrationsHistory. 


````
CREATE TABLE [Usuario] (
    [UsuarioID] int IDENTITY PRIMARY KEY,
    [Nome] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Endereco] nvarchar(max) NOT NULL,
    [Telefone] nvarchar(max) NOT NULL,
    [SenhaHash] nvarchar(max) NULL,
    [Ativo] bit NOT NULL,
    [TipoUsuarioID] int NOT NULL
);

CREATE TABLE [Animal] (
    [AnimalID] int IDENTITY PRIMARY KEY,
    [Especie] nvarchar(max) NOT NULL,
    [Nome] nvarchar(max) NOT NULL,
    [Raca] nvarchar(max) NOT NULL,
    [UrlImagem] nvarchar(max) NULL,
    [DataPerdido] datetime2 NOT NULL,
    [Ativo] bit NOT NULL,
    [Achado] bit NOT NULL,
    [UsuarioID] int NOT NULL
    -- FK → Usuario
);

CREATE TABLE [Consulta] (
    [ConsultaID] int IDENTITY PRIMARY KEY,
    [DataConsulta] datetime2 NOT NULL,
    [Descricao] nvarchar(500) NOT NULL,
    [Valor] decimal(18,2) NOT NULL,
    [AnimalID] int NOT NULL,
    [TipoConsultaID] int NOT NULL,
    [UsuarioID] int NOT NULL,
    [Ativo] bit NOT NULL DEFAULT 1
    -- FKs → Animal e Usuario
);
````

# Desenvolvimento da Aplicação Conectada

## Arquitetura geral
A solução é dividida em camadas:
#### -	Camada de Domínio (.Dominio)
Define entidades (Usuario, Animal, Consulta) e enums (TiposUsuario, TiposConsulta).
#### - Camada de Repositório (.Repositorio)
Contém o MeucachorroContexto (DbContext do EF Core) e os repositórios que acessam o banco (UsuarioRepositorio, AnimalRepositorio, ConsultaRepositorio).
#### -	Camada de Aplicação (.Aplicacao)
Implementa regras de negócio em serviços como UsuarioAplicacao, AnimalAplicacao e ConsultaAplicacao.

#### -	API REST (.Api)

Implementada em ASP.NET Core, com controllers:

````
UsuarioController
AnimalController
ConsultaController
RelatoriosController 
````
#### - Frontend Web
Desenvolvido em React, consumindo a API via HTTP.


# Telas principais
 ## 1.Tela inicial (Home)
 - 	Página institucional “Bem-vindo ao MeuCachorro.com!”, com texto de apresentação e imagem da equipe do petshop.
<img width="1190" height="938" alt="Image" src="https://github.com/user-attachments/assets/f52a9af9-309c-4ea0-9d6a-f127201075ba" />


## 2.	Tela de Login
<img width="1277" height="946" alt="Image" src="https://github.com/user-attachments/assets/a6f1b0fb-6549-4795-b7fa-8dec581d625f" />

## 3.	Menu lateral (após login)
<img width="231" height="537" alt="Image" src="https://github.com/user-attachments/assets/fef724c6-0fc4-41a8-9dde-37408ec13e71" />


## 4.	Cadastro/edição de Usuários
- 	Usa os endpoints:
````
-	POST /Usuario/Criar
-	GET /Usuario/Listar
-	PUT /Usuario/Atualizar
-	DELETE /Usuario/Deletar/{id}
````
<img width="1263" height="874" alt="Image" src="https://github.com/user-attachments/assets/84502fd2-b391-4860-9623-2977a0b69021" />

## 5.	Cadastro/edição de Animais
-	Inclusão e alteração com upload de foto para o Cloudinary via método UploadImage do AnimalController. A URL da imagem é salva no campo UrlImagem. 
<img width="1042" height="553" alt="Image" src="https://github.com/user-attachments/assets/5bcd2fe9-1fce-4c8f-adb3-1fc30d524fc2" />

##  6.	Cadastro de Consultas/Serviços
-	Consome:
````
-	POST /Consulta/Criar
-	PUT /Consulta/Atualizar
-	GET /Consulta/Listar, ListarVeterinario, ListarBanhoTosa, etc.
````

## 7.	Tela de Relatórios
-	Seção Consultas Complexas: botões que chamam os endpoints do RelatoriosController:
````
-	“Relatório Geral de Consultas”
-	“Consultas por Animal”
-	“Animais Mais Atendidos”
-	“Consultas com Valor Acima da Média”
-	“Animais Sem Registro de Consultas”
````
<img width="1052" height="699" alt="Image" src="https://github.com/user-attachments/assets/0e49a785-257b-47a0-91ed-f51cb208cac9" />

<img width="1049" height="714" alt="Image" src="https://github.com/user-attachments/assets/883c65d5-f841-48d9-8cd9-86bb9f7b46e7" />

<img width="1278" height="940" alt="Image" src="https://github.com/user-attachments/assets/e2e9459e-05f3-4f22-815c-ecae2b8c9068" />
-	Seção Faturamento:
````
-	Filtros de período (Dia/Semana/Mês), data-base e categoria (todos, veterinário, banho e tosa);
-	Botão “Buscar Faturamento” chama GET /Relatorios/Faturamento.
````

<img width="2523" height="852" alt="Image" src="https://github.com/user-attachments/assets/b586fcf8-ea07-4cbe-b4a5-77dba5db16c1" />

# Consultas SQL Complexas

Todas as consultas complexas foram implementadas no RelatoriosController, usando LINQ com Entity Framework (gerando SQL equivalente no banco). 


## Junções múltiplas (JOIN entre 3 ou mais tabelas)
- ### Consulta 1 – Relatório Geral de Consultas
Endpoint: GET /Relatorios/ConsultasCompleta

Descrição: retorna, para cada consulta, o nome do dono, o nome do animal, a descrição, a data e o valor.

#### Equivalente em SQL:

````
SELECT u.Nome    AS Dono,
       a.Nome    AS Animal,
       c.Descricao AS Consulta,
       c.DataConsulta,
       c.Valor
FROM   Consulta c
JOIN   Animal   a ON c.AnimalID = a.AnimalID
JOIN   Usuario  u ON a.UsuarioID = u.UsuarioID;
````

## Consultas agregadas (GROUP BY, HAVING, AVG, COUNT, etc.)
- ### Consulta 2 – Consultas por Animal
Endpoint: GET /Relatorios/ConsultasPorAnimal

Descrição: agrupa consultas por animal e calcula quantidade de consultas e valor total.
#### Equivalente em SQL:
````
SELECT c.AnimalID,
       a.Nome                 AS NomeAnimal,
       COUNT(*)               AS TotalConsultas,
       SUM(c.Valor)           AS ValorTotal
FROM   Consulta c
JOIN   Animal a ON c.AnimalID = a.AnimalID
GROUP BY c.AnimalID, a.Nome
ORDER BY TotalConsultas DESC;
````
- ### Consulta 3 – Consultas com Valor Acima da Média

Endpoint: GET /Relatorios/AcimaMedia

Descrição: calcula o valor médio das consultas e retorna apenas as consultas cujo valor é maior que a média.
#### Equivalente em SQL:
````
SELECT c.ConsultaID,
       c.Descricao,
       c.Valor
FROM   Consulta c
WHERE  c.Valor > (SELECT AVG(Valor) FROM Consulta);
````
Tipo: agregação com subconsulta.

## Consultas com subconsultas (subqueries)
- ### Consulta 4 – Animais sem Registro de Consultas
Endpoint: GET /Relatorios/AnimaisSemConsulta

Descrição: lista animais que não possuem nenhuma consulta cadastrada.

````
SELECT a.AnimalID,
       a.Nome,
       a.Especie
FROM   Animal a
WHERE  NOT EXISTS (
    SELECT 1
    FROM   Consulta c
    WHERE  c.AnimalID = a.AnimalID
);

````
Tipo: subconsulta com NOT EXISTS.

 ## Comparação de strings / multiconjunto 
 No sistema, a comparação de strings é usada principalmente na filtragem por categoria no relatório de faturamento e em pesquisas por nome.

 Exemplo – Filtro por categoria no Faturamento:
````
-- Quando categoria = 'banhoetosa'
SELECT *
FROM   Consulta c
WHERE  c.Ativo = 1
  AND  c.TipoConsultaID = 1;  -- Banho e Tosa

-- Quando categoria = 'veterinario'
SELECT *
FROM   Consulta c
WHERE  c.Ativo = 1
  AND  c.TipoConsultaID = 0;  -- Veterinário

````
Na camada de aplicação, também existe busca por texto (por exemplo, animais pelo nome), usando Contains, que o EF Core traduz para LIKE '%texto%' no SQL.

## Ordenação e limitação de resultados (ORDER BY, LIMIT/TOP)

- ### Consulta 5 – Top 5 Animais Mais Atendidos
Endpoint: GET /Relatorios/Top5Animais

Descrição: agrupa por animal, conta quantas consultas cada um tem e retorna apenas os 5 com maior quantidade.

#### Equivalente em SQL:
````
SELECT TOP 5
       c.AnimalID,
       a.Nome AS NomeAnimal,
       COUNT(*) AS TotalConsultas
FROM   Consulta c
JOIN   Animal a ON c.AnimalID = a.AnimalID
GROUP BY c.AnimalID, a.Nome
ORDER BY TotalConsultas DESC;
````
Tipo: ORDER BY + limitação de resultados (TOP 5).

## Relatório de Faturamento (consulta combinada)
- ### Consulta 6 – Faturamento por Período
Endpoint: GET /Relatorios/Faturamento?periodo={dia|semana|mes}&data=YYYY-MM-DD&categoria={todos|banhoetosa|veterinario}
Descrição:
-	### Filtra as consultas por:
o	Período (intervalo de datas calculado a partir da data-base);

o	Categoria de serviço (todos, banho e tosa, veterinário);

o	Status Ativo.
-	### Calcula:
o	Quantidade total de consultas;

o	Soma do valor faturado;

o	Lista detalhada de cada consulta com nome do animal e do dono.
SQL (forma simplificada para período “dia”):

````
SELECT COUNT(*)       AS Quantidade,
       SUM(c.Valor)   AS TotalFaturado
FROM   Consulta c
WHERE  c.Ativo = 1
  AND  CONVERT(date, c.DataConsulta) = @DataBase
  AND  (@Categoria = 'todos'
        OR (@Categoria = 'banhoetosa'  AND c.TipoConsultaID = 1)
        OR (@Categoria = 'veterinario' AND c.TipoConsultaID = 0));
````



