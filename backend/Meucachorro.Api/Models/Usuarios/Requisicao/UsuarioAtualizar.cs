using Meucachorro.Dominio.Enumeradores;  // Adicionando a referência para o namespace onde o enum está definido

namespace Meucachorro.Api.Models.Usuarios.Requisicao
{
    public class UsuarioAtualizar
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Endereco { get; set; }

        public string Senha { get; set; }
        
        public string Telefone { get; set; }
        
        public TiposUsuario tiposUsuario { get; set; }


    }
}