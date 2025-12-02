using Meucachorro.Dominio.Entidades;
using Meucachorro.Dominio.Enumeradores;

namespace Meucachorro.Aplicacao.Interfaces
{
  public interface IUsuarioAplicacao
  {
    Task<TiposUsuario> ObterTipoUsuario(int usuarioID);
    Task<int> Criar(Usuario usuarioDTO);

    Task AtualizarSenhaAsync(Usuario usuarioDTO, string senhaAntiga, string senhaNova);

    Task Atualizar(Usuario usuarioDTO);
    Task Deletar(int usuarioID);

    Task Restaurar(int usuarioID);

    Task<IEnumerable<Usuario>> Listar(bool ativo);
    Task<Usuario> Obter(int usuarioID);
    Task<Usuario> ObterPorEmail(string email);
    

  }
}