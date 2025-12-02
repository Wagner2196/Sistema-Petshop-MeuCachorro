using CloudinaryDotNet;
using DataAccess.Repositorio;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Meucachorro.Aplicacao;
using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Repositorio;
using Meucachorro.Repositorio.Interfaces;
using Meucachorro.Servicos.Interfaces;
using Meucachorro.Api.Filters;  // Certifique-se de que esse é o namespace correto
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Carrega as variáveis do arquivo .env (se existir)
Env.Load();

// Adiciona os serviços de aplicação
builder.Services.AddScoped<IUsuarioAplicacao, UsuarioAplicacao>();
builder.Services.AddScoped<IAnimalAplicacao, AnimalAplicacao>();
builder.Services.AddScoped<IConsultaAplicacao, ConsultaAplicacao>();

// Adiciona os repositórios
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IAnimalRepositorio, AnimalRepositorio>();
builder.Services.AddScoped<IConsultaRepositorio, ConsultaRepositorio>();

// Adiciona os serviços adicionais
builder.Services.AddScoped<IJsonPlaceHolderServico, JsonPlaceHolderServico>();

// Configuração do Cloudinary com variáveis do .env
var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
{
    throw new Exception("Credenciais do Cloudinary não encontradas no arquivo .env ou nas variáveis de ambiente.");
}

var cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
builder.Services.AddSingleton(cloudinary);

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://192.168.1.10:3000", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configuração do Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Mapeia o tipo IFormFile para o Swagger
    c.MapType<IFormFile>(() => new Microsoft.OpenApi.Models.OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });

    // Isso permite que o Swagger gere a documentação corretamente para operações de upload
    c.OperationFilter<FormFileOperationFilter>();
});

// Configuração do banco de dados com SQLServer
builder.Services.AddDbContext<MeucachorroContexto>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configuração do pipeline de solicitação HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Exibe erros detalhados na tela durante o desenvolvimento
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors(); // Aplica o CORS em todos os ambientes
app.MapControllers();

app.Run();
