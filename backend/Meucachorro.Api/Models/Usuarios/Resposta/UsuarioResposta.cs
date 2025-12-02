using Meucachorro.Dominio.Enumeradores;

namespace Meucachorro.Api.Models.Usuarios.Resposta
{
    public class UsuarioResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Endereco { get; set; }
        public string Telefone { get; set; }
         public int TipoUsuarioID { get; set; }
         public string TipoUsuarioNome { get; set; } // Adicionando a propriedade TipoUsuarioNome
    }

}