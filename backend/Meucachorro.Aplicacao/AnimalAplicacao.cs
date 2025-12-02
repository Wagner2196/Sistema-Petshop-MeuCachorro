using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Interfaces;

namespace Meucachorro.Aplicacao
{
    public class AnimalAplicacao : IAnimalAplicacao
    {
        readonly IAnimalRepositorio _animalRepositorio;
        public AnimalAplicacao(IAnimalRepositorio animalRepositorio)
        {
            _animalRepositorio = animalRepositorio;
        }

        public Task<int> Criar(Animal animal)
        {
            if (animal == null)
                throw new Exception("Animal não pode ser nulo.");

            return _animalRepositorio.Salvar(animal);
        }


        public async Task Atualizar(Animal animal)
        {
            var animalDominio = await _animalRepositorio.Obter(animal.ID);
            if (animalDominio == null)
                throw new Exception("Animal não encontrado.");

            animalDominio.Nome = animal.Nome;
            animalDominio.Raca = animal.Raca;
            animalDominio.Especie = animal.Especie;
            animalDominio.UrlImagem = animal.UrlImagem;
            animalDominio.DataPerdido = animal.DataPerdido;
            animalDominio.Achado = animal.Achado;
            animalDominio.UsuarioID = animal.UsuarioID;
            animalDominio.Ativo = animal.Ativo;

            await _animalRepositorio.Atualizar(animalDominio);


        }

        public async Task<Animal> Obter(int animalID)
        {
            var animalDominio = await _animalRepositorio.Obter(animalID);
            if (animalDominio == null)
                throw new Exception("Animal não encontrado.");

            return animalDominio;
        }



        public async Task<IEnumerable<Animal>> Listar(string query, bool ativo)
        {
            return await _animalRepositorio.Listar(query, ativo);
        }

       
        public Task Deletar(int animalID)
        {
            var animal = _animalRepositorio.Obter(animalID);
            if (animal == null)
                throw new Exception("Animal não encontrado.");

            animal.Result.Deletar();
            return _animalRepositorio.Atualizar(animal.Result);
        }

        public Task Restaurar(int animalID)
        {
            var animal = _animalRepositorio.Obter(animalID);
            if (animal == null)
                throw new Exception("Animal não encontrado.");

            animal.Result.Restaurar();
            return _animalRepositorio.Atualizar(animal.Result);
        }

        public Task Achado(int animalID)
        {
            var animal = _animalRepositorio.Obter(animalID);
            if (animal == null)
                throw new Exception("Animal não encontrado.");  

            animal.Result.Achado = true;
            return _animalRepositorio.Atualizar(animal.Result);
        }

        public Task<IEnumerable<Animal>> ListarAnimaisPerdidos(bool Achado)
        {
            return _animalRepositorio.ListarAnimaisPerdidos(Achado);
    }

    }
}