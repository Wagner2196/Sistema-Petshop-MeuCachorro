using Meucachorro.Dominio.Entidades;


namespace Meucachorro.Repositorio.Interfaces
{
    public interface IConsultaRepositorio
    {
        Task<int> Salvar(Consulta consulta);
        Task Atualizar(Consulta consulta);
        Task<Consulta> Obter(int consultaId);
        Task<IEnumerable<Consulta>> Listar(bool ativo, string query = null);
        Task<List<Consulta>> ObterConsultasPorAnimal(int animalId);
        Task<IEnumerable<Consulta>> ListarVeterinario(bool ativo); // Listar apenas consultas de Veterinário
        Task<IEnumerable<Consulta>> ListarBanhoTosa(bool ativo);


    }
}