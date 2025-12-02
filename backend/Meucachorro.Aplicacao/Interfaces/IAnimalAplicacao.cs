using Meucachorro.Dominio.Entidades;

namespace Meucachorro.Aplicacao.Interfaces
{
    public interface IAnimalAplicacao
    {
        Task<int> Criar(Animal animal);
   
        Task Atualizar(Animal animal);

        Task Deletar(int animalID);
        Task Restaurar(int animalID);
        Task Achado(int animalID);
        Task<IEnumerable<Animal>> Listar(string query, bool ativo);
        Task<IEnumerable<Animal>> ListarAnimaisPerdidos(bool Achado);
        
    
        


        Task<Animal> Obter(int animalID);
    }
}