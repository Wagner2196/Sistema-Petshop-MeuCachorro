using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Dominio.Enumeradores;
using Microsoft.AspNetCore.Mvc;
using Meucachorro.Api.Models.Usuarios.Requisicao;
using Meucachorro.Api.Models.Usuarios.Resposta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meucachorro.Api.Controllers
{



    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioAplicacao _usuarioAplicacao;


        public UsuarioController(IUsuarioAplicacao usuarioAplicacao)
        {
            _usuarioAplicacao = usuarioAplicacao;

        }


        [HttpPost]
        [Route("Criar")]

        public async Task<IActionResult> Criar([FromBody] UsuarioCriarRequest usuarioDTO)
        {
            try
            {

                var usuarioDominio = new Usuario
                {
                    Nome = usuarioDTO.Nome,
                    Email = usuarioDTO.Email.ToLower(),
                    Endereco = usuarioDTO.Endereco,
                    Telefone = usuarioDTO.Telefone,
                    TipoUsuarioID = usuarioDTO.TipoUsuarioID
                };

                usuarioDominio.SetSenha(usuarioDTO.Senha); // Hash da senha

                // 3. Salvar usuário
                var usuarioId = await _usuarioAplicacao.Criar(usuarioDominio);
                return Ok(new { Id = usuarioId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet]
        [Route("Obter/{usuarioId}")]
        public async Task<IActionResult> Obter(int usuarioId)
        {
            try
            {
                var usuario = await _usuarioAplicacao.Obter(usuarioId);
                if (usuario == null)
                    return NotFound("Usuário não encontrado.");

                var usuarioResposta = new UsuarioResposta
                {
                    Id = usuario.ID,
                    Nome = usuario.Nome,
                    Email = usuario.Email,
                    Endereco = usuario.Endereco,
                    Telefone = usuario.Telefone,
                    TipoUsuarioID = usuario.TipoUsuarioID
                };
                return Ok(usuarioResposta);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }
        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar([FromQuery] bool ativo)
        {
            try
            {
                var usuarios = await _usuarioAplicacao.Listar(ativo);
                var response = usuarios.Select(u => new UsuarioResposta
                {
                    Id = u.ID,
                    Nome = u.Nome,
                    Email = u.Email,
                    Endereco = u.Endereco,
                    Telefone = u.Telefone,
                    TipoUsuarioID = u.TipoUsuarioID,
                    TipoUsuarioNome = Enum.GetName(typeof(TiposUsuario), u.TipoUsuarioID) // Aqui mapeamos o ID para o nome do tipo de usuário
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<IActionResult> Atualizar([FromBody] Usuario usuarioDTO)
        {
            try
            {
                var usuario = await _usuarioAplicacao.Obter(usuarioDTO.ID);
                if (usuario == null)
                    return NotFound("Usuário não encontrado.");

                // Atualizar apenas os campos que não são nulos
                usuario.Nome = usuarioDTO.Nome ?? usuario.Nome;
                usuario.Email = usuarioDTO.Email ?? usuario.Email;
                usuario.Endereco = usuarioDTO.Endereco ?? usuario.Endereco;
                usuario.Telefone = usuarioDTO.Telefone ?? usuario.Telefone;
                usuario.TipoUsuarioID = usuarioDTO.TipoUsuarioID != 0 ? usuarioDTO.TipoUsuarioID : usuario.TipoUsuarioID;

                await _usuarioAplicacao.Atualizar(usuario);
                return Ok("Usuário atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Deletar/{usuarioId}")]
        public async Task<IActionResult> Deletar(int usuarioId)
        {
            try
            {
                await _usuarioAplicacao.Deletar(usuarioId);
                return Ok("Usuário deletado com sucesso.");

            }
            catch (Exception ex)
            {
                return BadRequest(new { Erro = ex.Message });
            }
        }

        [HttpGet]
        [Route("ListarTiposUsuarios")]
        public ActionResult ListarTiposUsuario()
        {
            try
            {
                List<object> tiposUsuarios = new List<object>();
                var idTiposUsuarios = (int[])Enum.GetValues(typeof(TiposUsuario));
                var nomeTiposUsuarios = Enum.GetNames(typeof(TiposUsuario));

                for (int i = 0; i < idTiposUsuarios.Count(); i++)
                {
                    tiposUsuarios.Add(new
                    {
                        id = idTiposUsuarios[i],
                        nome = nomeTiposUsuarios[i]
                    });
                }

                return Ok(tiposUsuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLogin request)
        {
            try
            {
                var usuario = await _usuarioAplicacao.ObterPorEmail(request.Email.ToLower());
                if (usuario == null)
                    return NotFound("Usuário não encontrado.");

                // Verificar hash da senha
                if (!usuario.VerificarSenha(request.Senha))
                    return Unauthorized("Senha inválida.");

                return Ok(new { usuario.ID, usuario.Nome, usuario.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





    }


}

