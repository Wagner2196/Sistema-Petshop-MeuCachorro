import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./EditarUsuario.module.css";
import { useNavigate, useParams } from "react-router-dom";
import UsuarioAPI from "../../services/usuarioAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

export function EditarUsuario() {
    const { id } = useParams(); // Pega o ID da URL
    const usuarioId = Number(id); // Converte para número
    const navigate = useNavigate();

    const [dadosOriginais, setDadosOriginais] = useState({});
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [TiposUsuarios, setTiposUsuarios] = useState([]);

    useEffect(() => {
        if (!usuarioId || isNaN(usuarioId)) {
            console.error("ID do usuário não encontrado ou inválido!", usuarioId);
            alert("Erro: ID do usuário inválido.");
            navigate('/usuarios'); // Redireciona de volta
            return;
        }

        const buscarDadosUsuario = async () => {
            try {
                const usuario = await UsuarioAPI.obterAsync(usuarioId);
                console.log("Usuário encontrado:", usuario); // Log para verificar se o usuário existe
                setDadosOriginais(usuario);
                setNome(usuario.nome);
                setEmail(usuario.email);
                setEndereco(usuario.endereco);
                setTelefone(usuario.telefone);
                setTipoUsuario(usuario.tipoUsuarioID);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
                alert("Erro ao carregar os dados do usuário.");
                navigate('/usuarios');
            }
        };

        const buscarTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarioAsync();
                setTiposUsuarios(tipos);
            } catch (error) {
                console.error("Erro ao buscar tipos de usuários: ", error);
            }
        };

        buscarDadosUsuario();
        buscarTiposUsuarios();
    }, [usuarioId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!usuarioId) {
            alert("Erro: ID do usuário inválido.");
            return;
        }
    
        // Cria um pacote completo para enviar à API, garantindo que nenhum campo seja undefined
        const dadosAtualizados = {
            id: usuarioId,
            Nome: nome || dadosOriginais.nome,
            Email: email || dadosOriginais.email,
            Endereco: endereco || dadosOriginais.endereco,
            Telefone: telefone || dadosOriginais.telefone,
            TipoUsuarioId: tipoUsuario || dadosOriginais.tipoUsuarioID
        };
    
        console.log("Enviando para API:", dadosAtualizados); // Depuração
    
        try {
            await UsuarioAPI.atualizarAsync(usuarioId, dadosAtualizados);
            alert("Usuário atualizado com sucesso!");
            navigate('/usuarios'); // Redireciona após atualização
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar usuário.");
        }
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Usuário</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={nome || ''}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndereco" className="mb-3">
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control
                                type="text"
                                value={endereco || ''}
                                onChange={(e) => setEndereco(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelefone" className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                value={telefone || ''}
                                onChange={(e) => setTelefone(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={email || ''}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTipoUsuario" className="mb-3">
                            <Form.Label>Tipo de Usuário</Form.Label>
                            <Form.Control
                                as="select"
                                value={tipoUsuario || ''}
                                onChange={(e) => setTipoUsuario(Number(e.target.value))}
                            >
                                <option value="">Selecione o tipo de usuário</option>
                                {TiposUsuarios.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Salvar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    );
}
