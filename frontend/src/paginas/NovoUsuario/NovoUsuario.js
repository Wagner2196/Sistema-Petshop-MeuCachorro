import { useEffect, useState } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./NovoUsuario.module.css";
import { useNavigate } from "react-router-dom";
import UsuarioAPI from "../../services/usuarioAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button"

export function NovoUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [TiposUsuarios, setTiposUsuarios] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTiposUsuarios = async () => {
            try {
                const tipos = await UsuarioAPI.listarTiposUsuarioAsync();
                setTiposUsuarios(tipos);
            } catch (error) {
                console.error("Erro ao buscar tipos de usuários: ", error);
            }
        };

        fetchTiposUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            await UsuarioAPI.criarAsync(nome, email, senha, tipoUsuario, endereco, telefone);

            navigate('/usuarios');
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    };

    const isFormValid = () => {
        return nome && email && senha && tipoUsuario;
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Novo Usuário</h3>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu nome"
                                name="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndereco" className="mb-3">
                            <Form.Label>Endereco</Form.Label>
                            <Form.Control
                                type="Endereço"
                                placeholder="Digite seu endereco"
                                name="Endereco"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelefone" className="mb-3">
                            <Form.Label>Telefone </Form.Label>
                            <Form.Control
                                type="Contato"
                                placeholder="Digite seu telefone"
                                name="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu e-mail"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSenha" className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="******"
                                name="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTipoUsuario" className="mb-3">
                            <Form.Label>Tipo de Usuário</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipoUsuario"
                                value={tipoUsuario}
                                onChange={(e) => setTipoUsuario(e.target.value)}
                                required
                            >

                                <option value="">Selecione o tipo de usuário</option>
                                {TiposUsuarios.map((tipo) => (
                                    <option value={tipo.id}>{tipo.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={!isFormValid()}>
                            Salvar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    );
}