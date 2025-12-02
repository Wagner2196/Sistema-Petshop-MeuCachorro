using System.Text.Json.Serialization;

namespace Meucachorro.Dominio.Entidades
{
    public class Animal
    {
        public int ID { get; set; }
        public string Especie { get; set; }
        public string Nome { get; set; }
        public string Raca { get; set; }
        public string UrlImagem { get; set; }

        public DateTime DataPerdido { get; set; }
        public bool Ativo { get; set; } = true;
        public bool Achado { get; set; } = true;

        public int UsuarioID { get; set; }
       
        public Usuario Usuario { get; set; }


       
        public ICollection<Consulta> Consultas { get; set; }



        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }

        public void Perdido()
        {
            Achado = false;

        }
    }
}