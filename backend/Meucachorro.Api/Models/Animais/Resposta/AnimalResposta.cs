namespace Meucachorro.Api.Models.Animais.Resposta
{
    public class AnimalResposta
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public string Especie { get; set; }
        public string Raca { get; set; }
        public string UrlImagem { get; set; }
        public DateTime DataPerdido { get; set; }

        public bool Achado { get; set; }

    }
}
