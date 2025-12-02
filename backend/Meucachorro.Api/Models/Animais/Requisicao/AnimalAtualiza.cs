namespace Meucachorro.Api.Models.Animais.Resposta
{
    public class AnimalAtualizar
    {
        public int ID { get; set; }
        public string? Nome { get; set; }        // Nullable para permitir que não seja passado
        public string? Especie { get; set; }     // Nullable para permitir que não seja passado
        public string? Raca { get; set; }        // Nullable para permitir que não seja passado
        public string? UrlImagem { get; set; }   // Nullable para permitir que não seja passado
        public DateTime? DataPerdido { get; set; } // Nullable para permitir que não seja passado
        public bool? Achado { get; set; }        // Nullable para permitir que não seja passado
        public int? UsuarioID { get; set; }      // Nullable para permitir que não seja passado
    }
}
