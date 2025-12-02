using Microsoft.AspNetCore.SignalR;
namespace Meucachorro.Api.Models.Usuarios.Requisicao
{
    public class UsuarioAlterarSenha{
        public int ID { get; set; }
        public string SenhaHash { get; set;}

        public string SenhaAntiga { get; set; }

    }
}