import { HTTPClient } from "./client";

const UsuarioAPI = {
    async obterAsync(usuarioId) {
        try {
            const response = await HTTPClient.get(`/Usuario/Obter/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário:", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Usuario/Listar?ativo=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            throw error;
        }
    },

    async listarTiposUsuarioAsync() {
        try {
            const response = await HTTPClient.get('/Usuario/ListarTiposUsuarios');
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tipos de usuários:", error);
            throw error;
        }
    },

    async criarAsync(nome, email, senha, tipoUsuarioId, endereco, telefone) {
        try {
            const usuarioCriar = {
                TipoUsuarioId: tipoUsuarioId,
                Nome: nome,
                Email: email,
                Senha: senha,
                Endereco: endereco,
                Telefone: telefone,
            };
            console.log(usuarioCriar);
            const response = await HTTPClient.post(`/Usuario/Criar`, usuarioCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    },

    async atualizarAsync(usuarioId, dadosAtualizados) {
        try {
            if (!usuarioId) {
                throw new Error("ID do usuário inválido!");
            }

            // Buscar os dados antigos
            const usuarioAtual = await this.obterAsync(usuarioId);

            if (!usuarioAtual) {
                throw new Error("Usuário não encontrado na base de dados!");
            }

            // Criar objeto atualizado com todos os campos exigidos pela API
            const usuarioAtualizar = {
                id: usuarioId, // O ID deve ser enviado como "id", não "UsuarioId"
                nome: dadosAtualizados.Nome ?? usuarioAtual.nome,
                email: dadosAtualizados.Email ?? usuarioAtual.email,
                endereco: dadosAtualizados.Endereco ?? usuarioAtual.endereco,
                telefone: dadosAtualizados.Telefone ?? usuarioAtual.telefone,
                senhaHash: usuarioAtual.senhaHash, // API exige esse campo
                ativo: usuarioAtual.ativo ?? true, // API exige esse campo
                tipoUsuarioID: dadosAtualizados.TipoUsuarioID ?? usuarioAtual.tipoUsuarioID
            };         
            // Enviar a atualização para a API
            const response = await HTTPClient.put(`/Usuario/Atualizar`, usuarioAtualizar);
            console.log("✅ Usuário atualizado com sucesso:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Erro ao atualizar usuário:", error.response?.data || error.message);
            throw error;
        }
    },
    

    async deletarAsync(usuarioId) {
        try {
            
            const response = await HTTPClient.delete(`/Usuario/Deletar/${usuarioId}`);
            console.log("Usuário deletado com sucesso!");
            return response.data;
        } catch (error) {
            console.error("Erro ao excluir usuário:", error.response || error.message);
            throw error;
        }
    },

    async restaurarAsync(usuarioId) {
        try {
            const response = await HTTPClient.put(`/Usuario/Restaurar/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar usuário:", error);
            throw error;
        }
    },

    async alterarSenhaAsync(usuarioId, senha, senhaAntiga) {
        try {
            const usuarioAlterar = {
                UsuarioId: usuarioId,
                Senha: senha,
                SenhaAntiga: senhaAntiga,
            };
            const response = await HTTPClient.put(`/Usuario/AlterarSenha`, usuarioAlterar);
            return response.data;
        } catch (error) {
            console.error(`Erro ao alterar senha do usuário com ID ${usuarioId}:`, error);
            throw error;
        }
    },
    async loginAsync(email, senha) {
        try {
            const usuarioLogin = {
                Email: email,
                Senha: senha,
            };
            const response = await HTTPClient.post(`/Usuario/Login`, usuarioLogin);
            return response.data;
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            throw error;
        }
    }
    
};

export default UsuarioAPI;
