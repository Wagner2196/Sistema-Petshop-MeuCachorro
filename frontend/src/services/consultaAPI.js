import { HTTPClient } from "./client";

const ConsultaAPI = {
    async obterAsync(consultaId) {
        try {
            const response = await HTTPClient.get(`/Consulta/Obter/${consultaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter consulta:", error);
            throw error;
        }
    },

    async listarAsync(ativo = true) { // Adicione um parâmetro para ativo
        try {
            const response = await HTTPClient.get(`/Consulta/Listar?ativo=${ativo}`);
            return response.data; // Certifique-se de que isso seja um array de consultas
        } catch (error) {
            console.error("Erro ao listar consultas:", error);
            throw error;
        }
    },
    
    

    async criarAsync(consultaCriar) {
        try {
            console.log(consultaCriar); // Debug
            const response = await HTTPClient.post(`/Consulta/Criar`, consultaCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar consulta:", error);
            throw error;
        }
    },
    
async atualizarAsync(dadosAtualizados) {
    try {
        const response = await HTTPClient.put("/Consulta/Atualizar", dadosAtualizados);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar consulta:", error);
        throw error;
    }
},


    async deletarAsync(consultaId) {
        try {
            const response = await HTTPClient.delete(`/Consulta/Deletar/${consultaId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar consulta:", error);
            throw error;
        }
    },
    async listarBanhoTosaAsync(ativo) {
        try {
            const response = await HTTPClient.get(`/Consulta/ListarBanhoTosa?ativo=${ativo}`);
            return response.data; // Retorna o resultado das consultas filtradas
        } catch (error) {
            console.error("Erro ao listar consultas de Banho e Tosa:", error);
            throw error;
        }
    },
    
    async listarVeterinario(ativo) {
        try {
            const response = await HTTPClient.get(`/Consulta/ListarVeterinario?ativo=${ativo}`);
            return response.data; // Retorna o resultado das consultas filtradas
        } catch (error) {
            console.error("Erro ao listar consultas de Veterinário:", error);
            throw error;
        }
    },

  
}
export default ConsultaAPI;
