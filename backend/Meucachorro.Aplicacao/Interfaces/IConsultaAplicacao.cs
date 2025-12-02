using Meucachorro.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Meucachorro.Aplicacao.Interfaces
{
    public interface IConsultaAplicacao
    {
        Task<int> Criar(Consulta consulta);
        Task<int> Salvar(Consulta consulta);
        Task Atualizar(Consulta consulta);
        Task<Consulta> Obter(int consultaId);
        Task Deletar(int consultaId);
        Task<IEnumerable<Consulta>> Listar(bool ativo); // Altere para IEnumerable<Consulta>
        Task<IEnumerable<Consulta>> ListarVeterinario(bool ativo); // Listar apenas consultas de Veterinário
        Task<IEnumerable<Consulta>> ListarBanhoTosa(bool ativo); // Listar apenas consultas de Banho e Tosa
        Task<IEnumerable<Consulta>> ObterConsultasPorAnimal(int animalId);

          // 🔥 Novos métodos para obter o animal e o usuário pelo ID
        Task<Animal> ObterAnimal(int animalId);
        Task<Usuario> ObterUsuario(int usuarioId);
    }
}
