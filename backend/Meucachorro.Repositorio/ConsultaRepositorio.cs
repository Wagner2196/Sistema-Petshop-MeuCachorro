using Microsoft.EntityFrameworkCore;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Interfaces;

namespace DataAccess.Repositorio
{
     public class ConsultaRepositorio : BaseRepositorio, IConsultaRepositorio
    {
        public ConsultaRepositorio(MeucachorroContexto contexto) : base(contexto)
        {

        }

        public Task Atualizar(Consulta consulta)
        {
            _contexto.Consultas.Update(consulta);
            return _contexto.SaveChangesAsync();
        }


       public async Task<IEnumerable<Consulta>> Listar(bool ativo, string query = null)
{
    // Filtra as consultas com base no status ativo
    var consultas = _contexto.Consultas
        .Where(x => x.Ativo == ativo);

    // Se query não for nula ou vazia, filtra por descrição
    if (!string.IsNullOrEmpty(query))
    {
        consultas = consultas.Where(consulta => consulta.Descricao.ToLower().Contains(query.ToLower()));
    }

    return await consultas.ToListAsync(); // Retorna todas as consultas que atendem aos critérios
}

        public async Task<IEnumerable<Consulta>> ListarBanhoTosa(bool ativo)
        {
            return await _contexto.Consultas.Where(x => x.Ativo == true && x.TipoConsultaID == 0).ToListAsync();
        }

        public async Task<IEnumerable<Consulta>> ListarVeterinario(bool ativo)
        {
            return await _contexto.Consultas.Where(x => x.Ativo == true && x.TipoConsultaID == 1).ToListAsync();
        }

        public Task<Consulta> Obter(int consultaId)
        {
            return _contexto.Consultas.FirstOrDefaultAsync(x => x.Id == consultaId);
        }

        public async Task<List<Consulta>> ObterConsultasPorAnimal(int animalId)
        {
            return await _contexto.Consultas.Where(x => x.AnimalID == animalId).ToListAsync();
        }

        public Task<int> Salvar(Consulta consulta)
        {
            _contexto.Consultas.Add(consulta);
            return _contexto.SaveChangesAsync();
        }
    }
}