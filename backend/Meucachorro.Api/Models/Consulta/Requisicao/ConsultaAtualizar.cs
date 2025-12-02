using Meucachorro.Dominio.Enumeradores;

namespace Meucachorro.Api.Models.Consulta.Requisicao
{
    public class ConsultaAtualizar
    {
        public int Id { get; set; }
        public DateTime? DataConsulta { get; set; }  // Alterado para DateTime? (nullable)
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public int AnimalID { get; set; }
        public int TipoConsultaID { get; set; }
        public int UsuarioID { get; set; }

        public TiposConsulta TipoConsulta { get; set; }
    }
}
