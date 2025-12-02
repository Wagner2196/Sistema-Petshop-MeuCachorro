import { HTTPClient } from "./client";

const RelatoriosAPI = {
  // 1. JOIN triplo
  async consultasCompletaAsync() {
    try {
      const response = await HTTPClient.get(`/Relatorios/ConsultasCompleta`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Consultas Completa:", error);
      throw error;
    }
  },

  // 2. GROUP BY
  async consultasPorAnimalAsync() {
    try {
      const response = await HTTPClient.get(`/Relatorios/ConsultasPorAnimal`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Consultas por Animal:", error);
      throw error;
    }
  },

  // 3. TOP 5 animais
  async top5AnimaisAsync() {
    try {
      const response = await HTTPClient.get(`/Relatorios/Top5Animais`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Top 5 Animais:", error);
      throw error;
    }
  },

  // 4. Consultas acima da média
  async acimaMediaAsync() {
    try {
      const response = await HTTPClient.get(`/Relatorios/AcimaMedia`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Consultas Acima da Média:", error);
      throw error;
    }
  },

  // 5. Animais sem consulta
  async animaisSemConsultaAsync() {
    try {
      const response = await HTTPClient.get(`/Relatorios/AnimaisSemConsulta`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Animais sem Consulta:", error);
      throw error;
    }
  },

  // 6. Faturamento com filtros
  async faturamentoAsync(periodo, data, categoria) {
    try {
      const response = await HTTPClient.get(
        `/Relatorios/Faturamento?periodo=${periodo}&data=${data}&categoria=${encodeURIComponent(
          categoria
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar Faturamento:", error);
      throw error;
    }
  },
};

export default RelatoriosAPI;
