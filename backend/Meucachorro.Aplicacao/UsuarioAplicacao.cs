using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Dominio.Enumeradores;
using Meucachorro.Repositorio.Interfaces;

namespace Meucachorro.Aplicacao
{
    public class UsuarioAplicacao : IUsuarioAplicacao
    {
        readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuarioAplicacao(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }
        public async Task<int> Criar(Usuario usuarioDTO)
        {
            if (usuarioDTO == null)
                throw new Exception("Usuário não pode ser nulo");
            ValidarInformacoesUsuario(usuarioDTO);

            if (string.IsNullOrEmpty(usuarioDTO.SenhaHash)) // Verifique a senha antes de criar o hash
                throw new Exception("Senha não pode ser vazia");

            usuarioDTO.SetSenha(usuarioDTO.SenhaHash); // Defina o hash da senha
            return await _usuarioRepositorio.Salvar(usuarioDTO);
        }


        // Implementando o método AtualizarSenhaAsync
        public async Task AtualizarSenhaAsync(Usuario usuarioDTO, string senhaAntiga, string senhaNova)
        {
            var usuario = await _usuarioRepositorio.Obter(usuarioDTO.ID);

            if (usuario == null)
                throw new Exception("Usuário não encontrado.");

            // if (!usuario.ValidarSenha(senhaAntiga))
            //     throw new Exception("Senha antiga incorreta.");

            usuario.SetSenha(senhaNova); // Atualiza a senha

            await _usuarioRepositorio.Atualizar(usuario); // Atualiza no banco
        }





        public async Task Deletar(int usuarioID)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioID);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado");

            usuarioDominio.Deletar();
            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        public async Task<IEnumerable<Usuario>> Listar(bool ativo)
        {
            return await _usuarioRepositorio.Listar(ativo);
        }

        public async Task<Usuario> Obter(int usuarioID)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioID);
            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado");

            return usuarioDominio;
        }

        public async Task<Usuario> ObterPorEmail(string email)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorEmail(email);
            if (usuarioDominio == null)
                throw new Exception("Usuário nao encontrado");

            return usuarioDominio;
        }


        public async Task Restaurar(int usuarioId)
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuarioId);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado");

            usuarioDominio.Restaurar();
            await _usuarioRepositorio.Atualizar(usuarioDominio);
        }

        #region Util
        private static void ValidarInformacoesUsuario(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.Nome))
                throw new Exception("Nome não pode ser vazio");

            if (string.IsNullOrEmpty(usuario.Email))
                throw new Exception("E-mail não pode ser vazio");
        }



        public async Task Atualizar(Usuario usuario) //passei usario externo por paraqmetro 
        {
            var usuarioDominio = await _usuarioRepositorio.Obter(usuario.ID);  //usei o id do usuario para obter o usuario do dominio 

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado.");

            ValidarInformacoesUsuario(usuario);

            usuarioDominio.Nome = usuario.Nome; //passei os parametros para atualizar
            usuarioDominio.Email = usuario.Email;
            usuarioDominio.Endereco = usuario.Endereco;
            usuarioDominio.Telefone = usuario.Telefone;
            usuarioDominio.TipoUsuarioID = usuario.TipoUsuarioID; // e o tipo de usuario
            await _usuarioRepositorio.Atualizar(usuarioDominio); // e salvei pelo metodo atualizar 
        }

        // Implementação do método ObterTipoUsuario
        public async Task<TiposUsuario> ObterTipoUsuario(int tipoUsuarioId)
        {
            try{
                var usuario = await _usuarioRepositorio.Obter(tipoUsuarioId);
                if (usuario == null)
                    throw new Exception("Usuário não encontrado.");

                return (TiposUsuario)usuario.TipoUsuarioID; // Retorna o tipo de usuário
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao obter tipo de usuário: {ex.Message}");
            }
        }


        #endregion
    }


}
