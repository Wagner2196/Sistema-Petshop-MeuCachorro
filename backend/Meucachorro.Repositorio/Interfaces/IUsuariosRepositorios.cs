using Meucachorro.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Meucachorro.Repositorio.Interfaces{
public interface IUsuarioRepositorio
{
    Task<int> Salvar(Usuario usuario);  // Salva um novo usuário
    Task Atualizar(Usuario usuario);  // Atualiza um usuário existente
    Task<Usuario> Obter(int usuarioID);  // Obtém um usuário pelo ID
    Task<Usuario> ObterPorEmail(string email);  // Obtém um usuário por email
    Task<IEnumerable<Usuario>> Listar(bool ativo);  // Lista usuários com base no estado de ativo
}
}
