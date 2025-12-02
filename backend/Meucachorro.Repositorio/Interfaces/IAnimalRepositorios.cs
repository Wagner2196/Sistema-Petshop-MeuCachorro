using System.Reflection.Metadata;
using Meucachorro.Dominio.Entidades;

namespace Meucachorro.Repositorio.Interfaces
{
  public interface IAnimalRepositorio
{
    Task<int> Salvar(Animal animal);
    Task Atualizar(Animal animal);
    Task<IEnumerable<Animal>> Listar(string query, bool ativo);
    Task<Animal> Obter(int animalID);

    // Método correto para listar os animais perdidos
    Task<IEnumerable<Animal>> ListarAnimaisPerdidos(bool Achado);
}
}