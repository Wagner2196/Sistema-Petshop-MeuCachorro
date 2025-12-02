
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
