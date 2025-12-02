using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using System.Collections.Generic;

namespace Meucachorro.Api.Filters  // Alterar para o namespace adequado, se necessário
{
    public class FormFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Verifica se algum parâmetro da operação é um IFormFile
            foreach (var parameter in operation.Parameters)
            {
                if (parameter.Schema?.Type == "string" && parameter.Schema?.Format == "binary")
                {
                    // Define o tipo de conteúdo para upload de arquivos
                    parameter.Content = new Dictionary<string, OpenApiMediaType>
                    {
                        { "multipart/form-data", new OpenApiMediaType { Schema = parameter.Schema } }
                    };
                }
            }
        }
    }
}
