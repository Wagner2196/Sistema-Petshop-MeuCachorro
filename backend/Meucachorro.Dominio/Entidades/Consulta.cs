using System.Globalization;
using System.Text.Json.Serialization;
using Meucachorro.Dominio.Enumeradores;
namespace Meucachorro.Dominio.Entidades
{
    public class Consulta
    {
      
        public int Id { get; set; }
        public DateTime DataConsulta { get; set; }       
        public string Descricao { get; set; }     
        public decimal Valor { get; set; }     
        public int AnimalID { get; set; }

        public Animal Animal { get; set; }         
        public int TipoConsultaID { get; set; }
        

        public TiposConsulta TipoConsulta { get; set; }         
        public int UsuarioID { get; set; }

        public Usuario Usuario { get; set; } 
        

        
        public bool Ativo { get; set; } = true;

        
        public void Deletar()
        {
            Ativo = false;
        }
    }
}
