using System.Text.Json.Serialization;

namespace Meucachorro.Dominio.Entidades
{
    public class Usuario
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Endereco { get; set; }
        public string Telefone { get; set; }
        public string SenhaHash { get; set; }
        public bool Ativo { get; set; } = true;

        public int TipoUsuarioID { get; set; }

 
        public ICollection<Animal> Animal { get; set; }

 
        public ICollection<Consulta> Consultas { get; set; }

        // Armazena a senha diretamente (NÃO recomendado para produção)
        public void SetSenha(string senha)
        {
            SenhaHash = senha;
        }

        // Compara diretamente a senha (sem criptografia)
        public bool VerificarSenha(string senha)
        {
            return SenhaHash == senha;
        }

        public void Restaurar()
        {
            Ativo = true;
        }

        public void Deletar()
        {
            Ativo = false;
        }
    }
}
