namespace Meucachorro.Api.Models.Consulta.Resposta
{
    public class ConsultaResposta
    {
        public int Id { get; set; }
        
        public DateTime DataConsulta { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public int AnimalID { get; set; }
        public int TipoConsultaID { get; set; }

        // Novos campos para incluir os nomes
        public string NomeDono { get; set; } // Nome do dono do animal
        public string NomeAnimal { get; set; } // Nome do animal
    }
}
