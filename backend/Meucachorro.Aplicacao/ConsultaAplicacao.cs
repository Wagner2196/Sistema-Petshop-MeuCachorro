using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Interfaces;

namespace Meucachorro.Aplicacao
{
    public class ConsultaAplicacao : IConsultaAplicacao
    {
        private readonly IConsultaRepositorio _consultaRepositorio;
        private readonly IAnimalRepositorio _animalRepositorio;
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public ConsultaAplicacao(IConsultaRepositorio consultaRepositorio,
                                   IAnimalRepositorio animalRepositorio,
                                   IUsuarioRepositorio usuarioRepositorio)
        {
            _consultaRepositorio = consultaRepositorio;
            _animalRepositorio = animalRepositorio; //  Inicializando corretamente
            _usuarioRepositorio = usuarioRepositorio; // Inicializando corretamente
        }
        public async Task Atualizar(Consulta consulta)
        {
            var consultaDominio = await _consultaRepositorio.Obter(consulta.AnimalID);
            if (consultaDominio == null)
            {
                throw new Exception("Consulta não encontrada.");
            }
            consultaDominio.DataConsulta = consulta.DataConsulta;
            consultaDominio.Descricao = consulta.Descricao;
            consultaDominio.Valor = consulta.Valor;
            consultaDominio.Ativo = consulta.Ativo;
            consultaDominio.TipoConsultaID = consulta.TipoConsultaID;
            consultaDominio.UsuarioID = consulta.UsuarioID;
            consultaDominio.AnimalID = consulta.AnimalID;

            await _consultaRepositorio.Atualizar(consultaDominio);
        }

        public Task<int> Criar(Consulta consulta)
        {
            if (consulta == null)
                throw new ArgumentNullException(nameof(consulta), "Consulta não pode ser nula.");

            return _consultaRepositorio.Salvar(consulta);
        }

        public Task Deletar(int consultaId)
        {
            var consulta = _consultaRepositorio.Obter(consultaId);
            if (consulta == null)
                throw new Exception("Consulta não encontrada.");

            consulta.Result.Deletar();
            return _consultaRepositorio.Atualizar(consulta.Result);
        }

        public async Task<Consulta> Obter(int consultaId)
        {
            if (consultaId <= 0)
                throw new ArgumentOutOfRangeException(nameof(consultaId), "ID da consulta deve ser maior que zero.");

            return await _consultaRepositorio.Obter(consultaId);
        }

        public async Task<IEnumerable<Consulta>> ObterConsultasPorAnimal(int animalId)
        {
            if (animalId <= 0)
                throw new ArgumentOutOfRangeException(nameof(animalId), "ID do animal deve ser maior que zero.");

            return await _consultaRepositorio.ObterConsultasPorAnimal(animalId);
        }

        public Task<int> Salvar(Consulta consulta)
        {
            if (consulta == null)
                throw new ArgumentNullException(nameof(consulta), "Consulta não pode ser nula.");

            return _consultaRepositorio.Salvar(consulta);
        }

        public async Task<IEnumerable<Consulta>> Listar(bool ativo)
        {


            return await _consultaRepositorio.Listar(ativo);
        }

        public async Task<IEnumerable<Consulta>> ListarVeterinario(bool ativo)
        {
            return await _consultaRepositorio.ListarVeterinario(ativo);
        }

        public async Task<IEnumerable<Consulta>> ListarBanhoTosa(bool ativo)
        {
            return await _consultaRepositorio.ListarBanhoTosa(ativo);
        }
        public async Task<Animal> ObterAnimal(int animalId)
        {
            return await _animalRepositorio.Obter(animalId);
        }

        public async Task<Usuario> ObterUsuario(int usuarioId)
        {
            return await _usuarioRepositorio.Obter(usuarioId);
        }


    }
}