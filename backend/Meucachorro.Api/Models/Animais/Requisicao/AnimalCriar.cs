namespace Meucachorro.Api.Models.Animais.Requisicao
{
    public class AnimalCriar
    {
        public string Especie { get; set; }
        public string Nome { get; set; }
        public string Raca { get; set; }
        public string UrlImagem { get; set; }
        public DateTime DataPerdido { get; set; }
        public bool Achado { get; set; } = true;
        public int UsuarioID { get; set; }
    }
}