using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Meucachorro.Repositorio;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Dominio.Enumeradores;
using System.Linq;
using System;
using System.Globalization;

namespace Meucachorro.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly MeucachorroContexto _context;

        public RelatoriosController(MeucachorroContexto context)
        {
            _context = context;
        }

        // 1. JOIN triplo - Relatório Geral de Consultas
        [HttpGet("ConsultasCompleta")]
        public IActionResult ConsultasCompleta()
        {
            var resultado =
                from c in _context.Consultas
                join a in _context.Animais on c.AnimalID equals a.ID
                join u in _context.Usuarios on a.UsuarioID equals u.ID
                select new
                {
                    Dono = u.Nome,
                    Animal = a.Nome,
                    Consulta = c.Descricao,
                    Data = c.DataConsulta.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Valor = c.Valor
                };

            return Ok(resultado);
        }

        // 2. GROUP BY por animal
        [HttpGet("ConsultasPorAnimal")]
        public IActionResult ConsultasPorAnimal()
        {
            var resultado =
                _context.Consultas
                .Include(c => c.Animal)
                .GroupBy(c => new { c.AnimalID, c.Animal.Nome })
                .Select(g => new
                {
                    AnimalID = g.Key.AnimalID,
                    NomeAnimal = g.Key.Nome,
                    TotalConsultas = g.Count(),
                    ValorTotal = g.Sum(x => x.Valor)
                })
                .OrderByDescending(x => x.TotalConsultas)
                .ToList();

            return Ok(resultado);
        }

        // 3. Top 5 animais mais atendidos
        [HttpGet("Top5Animais")]
        public IActionResult Top5Animais()
        {
            var resultado = _context.Consultas
                .Include(c => c.Animal)
                .GroupBy(c => new { c.AnimalID, c.Animal.Nome })
                .Select(g => new
                {
                    AnimalID = g.Key.AnimalID,
                    NomeAnimal = g.Key.Nome,
                    TotalConsultas = g.Count()
                })
                .OrderByDescending(x => x.TotalConsultas)
                .Take(5)
                .ToList();

            return Ok(resultado);
        }

        // 4. Consultas acima da média
        [HttpGet("AcimaMedia")]
        public IActionResult AcimaMedia()
        {
            var media = _context.Consultas.Average(c => c.Valor);

            var resultado = _context.Consultas
                .Where(c => c.Valor > media)
                .Select(c => new
                {
                    c.Id,
                    c.Descricao,
                    Valor = c.Valor,
                    Media = media
                })
                .ToList();

            return Ok(resultado);
        }

        // 5. Animais sem consulta
        [HttpGet("AnimaisSemConsulta")]
        public IActionResult AnimaisSemConsulta()
        {
            var resultado =
                _context.Animais
                .Where(a => !_context.Consultas.Any(c => c.AnimalID == a.ID))
                .Select(a => new
                {
                    a.ID,
                    a.Nome,
                    a.Especie
                })
                .ToList();

            return Ok(resultado);
        }

        // 6. FATURAMENTO (DIA / SEMANA / MÊS)
        [HttpGet("Faturamento")]
        public IActionResult Faturamento(
            [FromQuery] string periodo,
            [FromQuery] string data,
            [FromQuery] string categoria = "todos")
        {
            if (!DateTime.TryParse(data, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dataConvertida))
                return BadRequest("Data inválida! Use o formato yyyy-MM-dd.");

            IQueryable<Consulta> consultas = _context.Consultas
                .Include(c => c.Animal)
                .Include(c => c.Usuario)
                .Where(c => c.Ativo);

            // ==== FILTRO POR PERÍODO ====
            switch (periodo.ToLower())
            {
                case "dia":
                    var inicioDia = dataConvertida.Date;
                    var fimDia = inicioDia.AddDays(1);
                    consultas = consultas.Where(c => c.DataConsulta >= inicioDia && c.DataConsulta < fimDia);
                    break;

                case "semana":
                    var inicioSemana = dataConvertida.Date.AddDays(-(int)dataConvertida.DayOfWeek);
                    var fimSemana = inicioSemana.AddDays(7);
                    consultas = consultas.Where(c => c.DataConsulta >= inicioSemana && c.DataConsulta < fimSemana);
                    break;

                case "mes":
                    var inicioMes = new DateTime(dataConvertida.Year, dataConvertida.Month, 1);
                    var fimMes = inicioMes.AddMonths(1);
                    consultas = consultas.Where(c => c.DataConsulta >= inicioMes && c.DataConsulta < fimMes);
                    break;

                default:
                    return BadRequest("Período inválido. Use: dia, semana ou mes.");
            }
            // ==== FILTRO DE CATEGORIA ====
            if (categoria.ToLower() != "todos")
            {
                var cat = categoria.ToLower();

                if (cat == "banhoetosa")
                    consultas = consultas.Where(c => c.TipoConsultaID == (int)TiposConsulta.BanhoEtosa);

                else if (cat == "veterinario")
                    consultas = consultas.Where(c => c.TipoConsultaID == (int)TiposConsulta.Veterinario);
            }







            var lista = consultas.ToList();
            var totalFaturado = lista.Sum(c => c.Valor);

            var resultado = new
            {
                Periodo = periodo,
                Categoria = categoria,
                DataBase = dataConvertida.ToString("yyyy-MM-dd"),
                Quantidade = lista.Count,
                TotalFaturado = totalFaturado,

                Detalhes = lista.Select(c => new
                {
                    Servico = c.Descricao,
                    Valor = c.Valor,
                    Data = c.DataConsulta.ToString("yyyy-MM-ddTHH:mm"),
                    Animal = c.Animal?.Nome,
                    Dono = c.Usuario?.Nome
                })
            };

            return Ok(resultado);
        }
    }
}
