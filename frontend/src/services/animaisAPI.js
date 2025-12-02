
import { HTTPClient } from "./client";

const AnimaisAPI = {
    async obterAsync(animalId) {
        try {
            const response = await HTTPClient.get(`/Animal/Obter/${animalId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter animal:", error);
            throw error;
        }
    },

    async listarAnimaisAsync(achado) {
        try {
            const response = await HTTPClient.get(`/Animal/ListarAnimais?Achado=${achado}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar animais:", error);
            throw error;
        }
    },

    async listarAsync(ativo) {
        try {
            const response = await HTTPClient.get(`/Animal/Listar?Ativo=${ativo}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar animais:", error);
            throw error;
        }
    },

   async criarAsync(novoAnimal) {
        try {
            const formData = new FormData(); // Cria um novo FormData
            formData.append('Nome', novoAnimal.nome); // Adiciona o nome do animal
            formData.append('Raca', novoAnimal.raca); // Adiciona a raça do animal
            formData.append('Especie', novoAnimal.especie); // Adiciona a espécie do animal
            formData.append('UsuarioID', novoAnimal.UsuarioID); // Adiciona o ID do usuário
            
            if (novoAnimal.imagem) {
                formData.append('Imagem', novoAnimal.imagem); // Adiciona a imagem ao FormData
            }
    
            const response = await HTTPClient.post(`/Animal/Criar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura o cabeçalho para multipart
                },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar animal:", error);
            throw error;
        }
    },
      
    
async atualizarAsync(animalId, animalAtualizado) {
        try {
            const response = await HTTPClient.put(`/Animal/Atualizar/${animalId}`, animalAtualizado, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar animal:", error);
            throw error;
        }
    },

    async deletarAsync(animalId) {
        console.log("Tentando excluir animal com ID:", animalId);
    
        try {
            // Tentativa 1: DELETE com ID na URL
            const response = await HTTPClient.delete(`/Animal/Deletar/${animalId}`);
            console.log("Animal excluído com DELETE");
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir o animal:", error);
            throw error;
        }
    },
 
    
 



}
export default AnimaisAPI;

