namespace Meucachorro.Api.Models.Consulta.Requisicao
{
    public class ConsultaCriar
    {
        public DateTime DataConsulta { get; set; }
        public string Descricao { get; set; }

        public decimal Valor { get; set; }
        public int AnimalID { get; set; }
        public int UsuarioID { get; set; }
        public int TipoConsultaID { get; set; }

    }

}

