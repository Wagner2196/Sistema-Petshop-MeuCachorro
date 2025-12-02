using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Meucachorro.Aplicacao.Interfaces;
using Meucachorro.Api.Models.Animais.Requisicao;
using Meucachorro.Api.Models.Animais.Resposta;
using Meucachorro.Dominio.Entidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet; // Adicionado para o Cloudinary
using CloudinaryDotNet.Actions; // Adicionado para ImageUploadParams

[ApiController]
[Route("[controller]")]
public class AnimalController : ControllerBase
{
    private readonly IAnimalAplicacao _animalAplicacao;
    private readonly IUsuarioAplicacao _usuarioAplicacao;
    private readonly Cloudinary _cloudinary; // Adicionado para o Cloudinary

    public AnimalController(IAnimalAplicacao animalAplicacao, IUsuarioAplicacao usuarioAplicacao, Cloudinary cloudinary)
    {
        _animalAplicacao = animalAplicacao;
        _usuarioAplicacao = usuarioAplicacao;
        _cloudinary = cloudinary; // Injeção do Cloudinary
    }

    [HttpPost]
    [Route("Criar")]
    public async Task<IActionResult> Criar([FromForm] Animal animalDTO, IFormFile imagem) // Aceita imagem
    {
        try
        {
            if (string.IsNullOrEmpty(animalDTO.Nome) || string.IsNullOrEmpty(animalDTO.Especie))
                return BadRequest("Nome e espécie são obrigatórios.");

            var usuario = await _usuarioAplicacao.Obter(animalDTO.UsuarioID);
            if (usuario == null)
                return BadRequest("Usuário não encontrado");

            // Salva a imagem e obtém a URL se a imagem foi enviada
            if (imagem != null && imagem.Length > 0)
            {
                animalDTO.UrlImagem = await SalvarImagem(imagem);
            }

            var animaDominio = new Animal()
            {
                Especie = animalDTO.Especie,
                Nome = animalDTO.Nome,
                Raca = animalDTO.Raca,
                UrlImagem = animalDTO.UrlImagem,
                DataPerdido = animalDTO.DataPerdido,
                Ativo = animalDTO.Ativo,
                Achado = animalDTO.Achado,
                UsuarioID = animalDTO.UsuarioID
            };

            var animalId = await _animalAplicacao.Criar(animaDominio);
            return Ok(animalId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [Route("Atualizar/{animalId}")]
    public async Task<IActionResult> Atualizar([FromRoute] int animalId, [FromForm] AnimalAtualizar animalAtualizarDTO, IFormFile imagem)
    {
        try
        {
            // Garante que o ID do DTO é o mesmo da rota
            if (animalAtualizarDTO.ID != animalId)
                return BadRequest("O ID do corpo da requisição não bate com o ID da rota.");

            var animal = await _animalAplicacao.Obter(animalId);
            if (animal == null)
                return NotFound("Animal não encontrado");

            if (!string.IsNullOrEmpty(animalAtualizarDTO.Nome))
                animal.Nome = animalAtualizarDTO.Nome;

            if (!string.IsNullOrEmpty(animalAtualizarDTO.Raca))
                animal.Raca = animalAtualizarDTO.Raca;
                
            // Atualiza o status de achado
            if (animalAtualizarDTO.Achado.HasValue)
                animal.Achado = animalAtualizarDTO.Achado.Value;

            if (!string.IsNullOrEmpty(animalAtualizarDTO.Especie))
                animal.Especie = animalAtualizarDTO.Especie;

            if (imagem != null && imagem.Length > 0)
            {
                string novaUrlImagem = await SalvarImagem(imagem);
                animal.UrlImagem = novaUrlImagem;
            }



            await _animalAplicacao.Atualizar(animal);

            return Ok("Animal atualizado com sucesso");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    // Método para salvar a imagem no Cloudinary
    private async Task<string> SalvarImagem(IFormFile imagem)
    {
        using var stream = imagem.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(imagem.FileName, stream),
            PublicId = $"meucachorro_{Guid.NewGuid()}",
            Folder = "meucachorro/animais"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            Console.WriteLine($"Erro ao fazer upload: {uploadResult.Error.Message}");
            throw new Exception($"Erro ao fazer upload da imagem: {uploadResult.Error.Message}");
        }

        Console.WriteLine($"URL da imagem: {uploadResult.SecureUrl}");
        return uploadResult.SecureUrl.ToString();
    }

    [HttpGet]
    [Route("Obter/{animalId}")]
    public async Task<IActionResult> Obter([FromRoute] int animalId)
    {
        try
        {
            var animal = await _animalAplicacao.Obter(animalId);
            if (animal == null)
                return NotFound("Animal não encontrado");
            return Ok(animal);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    [Route("Deletar/{animalId}")]
    public async Task<IActionResult> Deletar(int animalId)
    {
        var animal = await _animalAplicacao.Obter(animalId);
        if (animal == null)
            return NotFound("Animal não encontrado");

        // Chama o método Deletar() do modelo para tornar o animal inativo
        animal.Deletar();

        // Chama o método de atualização para salvar a mudança no banco de dados
        await _animalAplicacao.Atualizar(animal);

        return Ok("Animal excluído com sucesso");
    }

    [HttpGet]
    [Route("ListarAnimais")]
    public async Task<IActionResult> ListarAnimais([FromQuery] bool Achado)
    {
        try
        {
            var animais = await _animalAplicacao.ListarAnimaisPerdidos(Achado);

            if (animais == null || !animais.Any())
                return NotFound("Nenhum animal encontrado.");

            // Mapeia os animais para incluir o nome do dono
            var animaisComDono = new List<object>();

            foreach (var animal in animais)
            {
                var dono = await _usuarioAplicacao.Obter(animal.UsuarioID);
                animaisComDono.Add(new
                {
                    animal.ID,
                    animal.Nome,
                    animal.Especie,
                    animal.Raca,
                    animal.DataPerdido,
                    animal.Ativo,
                    animal.Achado,
                    animal.UsuarioID,
                    animal.UrlImagem,
                    Dono = dono != null ? dono.Nome : "Desconhecido"
                });
            }

            return Ok(animaisComDono);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Route("Listar")]
    public async Task<IActionResult> Listar([FromQuery] string query, [FromQuery] bool ativo)
    {
        try
        {
            var animais = await _animalAplicacao.Listar(query, ativo);
            if (animais == null || !animais.Any())
                return NotFound("Nenhum animal encontrado.");
            var animaisComDono = new List<object>();
            foreach (var animal in animais)
            {
                var dono = await _usuarioAplicacao.Obter(animal.UsuarioID);
                animaisComDono.Add(new
                {
                    animal.ID,
                    animal.Nome,
                    animal.Especie,
                    animal.Raca,
                    animal.DataPerdido,
                    animal.Achado,
                    animal.UsuarioID,
                    Dono = dono != null ? dono.Nome : "Desconhecido"
                });
            }
            return Ok(animaisComDono);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [Route("Restaurar/{animalId}")]
    public async Task<IActionResult> Restaurar(int animalId)
    {
        try
        {
            var animal = await _animalAplicacao.Obter(animalId);
            if (animal == null)
                return NotFound("Animal não encontrado");

            animal.Restaurar();
            await _animalAplicacao.Atualizar(animal);

            return Ok("Animal restaurado com sucesso");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Nenhum arquivo enviado.");
        }

        try
        {
            // Chama o método para salvar a imagem no Cloudinary
            var urlImagem = await SalvarImagem(file);

            // Retorna a URL da imagem enviada como resposta
            return Ok(new { Url = urlImagem });
        }
        catch (Exception ex)
        {
            return BadRequest("Erro ao fazer upload da imagem: " + ex.Message);
        }
    }

}
