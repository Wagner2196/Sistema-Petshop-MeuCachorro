🐶 README – MeuCachorro.com
MeuCachorro.com

Seu sistema completo de gestão para petshops, onde você cadastra usuários, animais, consultas, serviços e ainda tem relatórios avançados e faturamento automático.


🐾 Introdução

O MeuCachorro.com é uma plataforma completa voltada para o gerenciamento de um petshop.
Ela permite controlar:

Usuários (clientes e funcionários)

Animais e seus donos

Consultas veterinárias

Serviços de banho e tosa

Animais perdidos

Relatórios avançados

Faturamento diário, semanal e mensal

O objetivo é centralizar tudo em um ambiente simples, intuitivo e moderno — oferecendo ao petshop uma visão clara do atendimento e da receita gerada por cada área.

🧰 Tecnologias Utilizadas
🖥️ Linguagens

C# (Backend – .NET 8)

JavaScript (Frontend – React)

🚀 Frameworks e Bibliotecas
Backend (API)

ASP.NET Core

Entity Framework Core (ORM)

SQL Server

Cloudinary (upload de imagens)

Swagger (documentação da API)

Frontend (React)

React

Bootstrap / CSS customizado

Axios (consumo da API)

React Router

Hooks (useEffect, useState)

🖥️ Requisitos e Como Rodar
🧩 Requisitos

.NET SDK 8.0

Node.js

SQL Server

Gerenciador npm ou yarn

▶️ Passo a Passo para Executar o Projeto
🔧 Backend (.NET API)
1. Entre na pasta:
cd Backend

2. Aplicar migrations:
dotnet ef database update

3. Executar a API:
dotnet run


A API ficará disponível em:
👉 https://localhost:5148/swagger

💻 Frontend (React)
1. Entre na pasta:
cd Frontend

2. Instalar dependências:
npm install

3. Rodar:
npm start


O projeto abrirá em:
👉 http://localhost:3000

🐕 Banco de Dados

O banco de dados utilizado foi SQL Server.
Abaixo, o modelo Entidade Relacionamento utilizado:

📊 Estrutura das Tabelas
👤 Usuário
Coluna	Tipo	Observações
UsuarioID	int	PK – chave primária
Nome	string	
Email	string	
Telefone	string	
Endereco	string	
TipoUsuarioID	int	Enum: Admin, Cliente, Vet, Groomer
SenhaHash	string	Senha criptografada
Ativo	bool	
🐶 Animal
Coluna	Tipo	Observações
AnimalID	int	PK
Nome	string	
Especie	string	
Raca	string	
UrlImagem	string	Foto do pet (Cloudinary)
DataPerdido	datetime	Usado no módulo animal perdido
UsuarioID	int	FK → Usuário
Ativo	bool	
🩺 Consulta (Serviço)
Coluna	Tipo	Observações
ConsultaID	int	PK
TipoConsultaID	int	Veterinário, Banho e Tosa
Descricao	string	
Valor	decimal	
DataConsulta	datetime	
AnimalID	int	FK → Animal
UsuarioID	int	FK → Usuário responsável
Ativo	bool	
🧮 Consultas SQL Complexas

O sistema possui relatórios avançados com:

JOIN entre 3 tabelas

SUBQUERY (ex: animais sem consulta)

GROUP BY e HAVING

TOP 5 animais mais atendidos

Faturamento por período

Comparações condicionais por categoria

Essas consultas são acionadas pela interface do React usando os endpoints da API.

🏗️ Arquitetura do Sistema

A arquitetura é dividida em camadas:

Apresentação — React (frontend)

API — Controladores, validações e endpoints

Aplicação — Regras de negócio

Repositório — Acesso ao banco via EF Core

Domínio — Entidades e enums