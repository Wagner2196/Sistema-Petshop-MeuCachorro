
using Meucachorro.Dominio.Entidades;
using Meucachorro.Servicos.Interfaces;
using Meucachorro.Servicos.JsonPlaceHolderServico.Models;
using Newtonsoft.Json;

public class JsonPlaceHolderServico :IJsonPlaceHolderServico
{
    private readonly HttpClient _httpClient;

    public JsonPlaceHolderServico()
    {
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/");
    }

   
}