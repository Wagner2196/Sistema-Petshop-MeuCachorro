using Microsoft.EntityFrameworkCore;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Interfaces;

namespace DataAccess.Repositorio
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(MeucachorroContexto contexto) : base(contexto)
        {

        }

        public async Task Atualizar(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync();
        }

        public async Task<IEnumerable<Usuario>> Listar(bool ativo)
        {
            return await _contexto.Usuarios.Where(u => u.Ativo == ativo).ToListAsync();
        }

        public async Task<Usuario> Obter(int usuarioID)
        {
            return await _contexto.Usuarios
            .Where(u => u.ID == usuarioID)
            .FirstOrDefaultAsync();
        }

        public async Task<int> Salvar(Usuario usuario)
        {
            _contexto.Usuarios.Add(usuario);
            await _contexto.SaveChangesAsync();

            return usuario.ID;
        }

        public async Task<Usuario> ObterPorEmail(string email)
        {
            return await _contexto.Usuarios
                .Where(u => u.Email.ToLower() == email.ToLower())
                .Where(u => u.Ativo)
                .FirstOrDefaultAsync();
        }


    }
}