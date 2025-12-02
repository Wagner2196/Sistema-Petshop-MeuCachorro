using Microsoft.EntityFrameworkCore;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Interfaces;

namespace DataAccess.Repositorio
{

    public class AnimalRepositorio : BaseRepositorio, IAnimalRepositorio
    {
        public AnimalRepositorio(MeucachorroContexto contexto) : base(contexto)
        {

        }

        public async Task<int> Salvar(Animal animal)
        {
            _contexto.Animais.Add(animal);
            await _contexto.SaveChangesAsync();

            return animal.ID;
        }

        public Task Atualizar(Animal animal)
        {
            _contexto.Animais.Update(animal);
            return _contexto.SaveChangesAsync();
        }


        public async Task<IEnumerable<Animal>> Listar(string query, bool ativo)
        {
            var animais = _contexto.Animais
                .Where(a => a.Ativo == ativo);
            if (!string.IsNullOrEmpty(query))
            {
                animais = animais.Where(animais => animais.Nome.ToLower().Contains(query.ToLower()));
            }
            return await animais.ToListAsync();

        }


        public Task<Animal> Obter(int animalID)
        {
            return _contexto.Animais
                .Where(a => a.ID == animalID)
                .FirstOrDefaultAsync();
        }

        public Task<IEnumerable<Animal>> ListarAnimaisPerdidos(bool Achado)
        {
            return _contexto.Animais
                .Where(a => a.Achado == Achado && a.Ativo == true) // Filtra apenas os animais perdidos e ativos
                .ToListAsync()  // Retorna um List<Animal>
                .ContinueWith(task => (IEnumerable<Animal>)task.Result);  // Converte List<Animal> para IEnumerable<Animal>
        }

    }
}