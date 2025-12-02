using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Dominio.Enumeradores;
using Meucachorro.Api.Models.Consulta.Requisicao;
using Meucachorro.Api.Models.Consulta.Resposta;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Meucachorro.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConsultaController : ControllerBase
    {
        private readonly IConsultaAplicacao _consultaAplicacao;

        public ConsultaController(IConsultaAplicacao consultaAplicacao)
        {
            _consultaAplicacao = consultaAplicacao;
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<IActionResult> Criar([FromBody] ConsultaCriar consultaCriarDTO)
        {
            try
            {
                if (consultaCriarDTO.DataConsulta == DateTime.MinValue || consultaCriarDTO.Descricao == null)
                    return BadRequest("Data e descrição são obrigatórios.");

                var consultaDominio = new Consulta()
                {
                    DataConsulta = consultaCriarDTO.DataConsulta,
                    Descricao = consultaCriarDTO.Descricao,
                    Valor = consultaCriarDTO.Valor,
                    AnimalID = consultaCriarDTO.AnimalID,
                    TipoConsultaID = consultaCriarDTO.TipoConsultaID,
                    UsuarioID = consultaCriarDTO.UsuarioID,
                    Ativo = true
                };


                var consultaId = await _consultaAplicacao.Criar(consultaDominio);
                return Ok(consultaId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } // <-- Aqui o método Criar foi corretamente fechado

        [HttpPut]
        [Route("Atualizar")]
        public async Task<IActionResult> Atualizar([FromBody] ConsultaAtualizar consultaAtualizarDTO)
        {
            try
            {
                // Verificando se o ID foi passado corretamente
                if (consultaAtualizarDTO.Id <= 0)
                {
                    return BadRequest("ID inválido.");
                }

                // Buscando a consulta existente
                var consulta = await _consultaAplicacao.Obter(consultaAtualizarDTO.Id);
                if (consulta == null)
                    return NotFound("Consulta não encontrada.");

                // Verificando e atualizando os dados
                consulta.DataConsulta = consultaAtualizarDTO.DataConsulta ?? consulta.DataConsulta;
                consulta.Descricao = consultaAtualizarDTO.Descricao;
                consulta.Valor = consultaAtualizarDTO.Valor;
                consulta.TipoConsultaID = consultaAtualizarDTO.TipoConsultaID;
                consulta.UsuarioID = consultaAtualizarDTO.UsuarioID;
                consulta.AnimalID = consultaAtualizarDTO.AnimalID;



                // Atualizando a consulta
                await _consultaAplicacao.Atualizar(consulta);
                return Ok("Consulta atualizada com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar consulta: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("Obter/{id}")]
        public async Task<IActionResult> Obter(int id)
        {
            try
            {
                var consulta = await _consultaAplicacao.Obter(id);
                if (consulta == null)
                    return NotFound("Consulta não encontrada.");



                return Ok(consulta); // <-- Adicionado retorno da consulta
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            try
            {
                var consulta = await _consultaAplicacao.Obter(id);
                if (consulta == null)
                    return NotFound("Consulta não encontrada.");

                await _consultaAplicacao.Deletar(id);
                return Ok("Consulta deletada com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar([FromQuery] bool ativo = true)
        {
            try
            {
                var consultas = await _consultaAplicacao.Listar(ativo);
                return Ok(consultas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarVeterinario")]
        public async Task<IActionResult> ListarVeterinario([FromQuery] bool ativo = true)
        {
            try
            {
                var consultas = await _consultaAplicacao.ListarVeterinario(ativo);
                if (consultas == null || !consultas.Any())
                    return NotFound("Nenhuma consulta de banho e tosa encontrada.");

                var consultasCompleta = new List<object>();

                foreach (var consulta in consultas)
                {
                    // Obtém os dados do animal
                    var animal = await _consultaAplicacao.ObterAnimal(consulta.AnimalID);
                    var usuario = await _consultaAplicacao.ObterUsuario(consulta.UsuarioID); // Supondo que exista esse método

                    consultasCompleta.Add(new
                    {
                        consulta.Id,
                        consulta.DataConsulta,
                        consulta.Descricao,
                        consulta.Valor,
                        AnimalNome = animal?.Nome ?? "Desconhecido",
                        DonoNome = usuario?.Nome ?? "Desconhecido"
                    });
                }

                return Ok(consultasCompleta);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarBanhoTosa")]
        public async Task<IActionResult> ListarBanhoTosa([FromQuery] bool ativo = true)
        {
            try
            {
                var consultas = await _consultaAplicacao.ListarBanhoTosa(ativo);
                if (consultas == null || !consultas.Any())
                    return NotFound("Nenhuma consulta de banho e tosa encontrada.");

                var consultasCompleta = new List<object>();

                foreach (var consulta in consultas)
                {
                    // Obtém os dados do animal
                    var animal = await _consultaAplicacao.ObterAnimal(consulta.AnimalID);
                    var usuario = await _consultaAplicacao.ObterUsuario(consulta.UsuarioID); // Supondo que exista esse método

                    consultasCompleta.Add(new
                    {
                        consulta.Id,
                        consulta.DataConsulta,
                        consulta.Descricao,
                        consulta.Valor,
                        AnimalNome = animal?.Nome ?? "Desconhecido",
                        DonoNome = usuario?.Nome ?? "Desconhecido"
                    });
                }

                return Ok(consultasCompleta);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("ListarConsultasPorAnimal/{animalId}")]
        public async Task<IActionResult> ListarConsultasPorAnimal(int animalId)
        {
            try
            {
                var consultas = await _consultaAplicacao.ObterConsultasPorAnimal(animalId);
                return Ok(consultas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}