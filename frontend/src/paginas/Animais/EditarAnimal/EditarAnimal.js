import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import style from "../Animais/Animais.module.css";
import { useNavigate, useParams } from "react-router-dom";
import UsuarioAPI from "../../../services/usuarioAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import AnimaisAPI from "../../../services/animaisAPI";

export function EditarAnimal() {
    const { animalId } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [raca, setRaca] = useState('');
    const [especie, setEspecie] = useState('');
    const [urlImagem, setUrlImagem] = useState('');
    const [imagem, setImagem] = useState(null);
    const [usuarioID, setUsuarioID] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [dadosOriginais, setDadosOriginais] = useState(null);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [achado, setAchado] = useState(false); // Novo estado para o status de achado

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setUrlImagem(URL.createObjectURL(file));
        }
    };

    const carregarUsuarios = useCallback(async () => {
        try {
            const listarUsuarios = await UsuarioAPI.listarAsync(true);
            setUsuarios(listarUsuarios);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }, []);

    useEffect(() => {
        if (animalId && !dadosCarregados) {
            const buscarDadosAnimal = async () => {
                try {
                    const animal = await AnimaisAPI.obterAsync(animalId);
                    setDadosOriginais(animal);
                    setNome(animal.nome);
                    setRaca(animal.raca);
                    setEspecie(animal.especie);
                    setUrlImagem(animal.urlImagem);
                    setUsuarioID(animal.usuarioID);
                    setAchado(animal.achado); // Carrega o status de achado
                    setDadosCarregados(true);
                } catch (error) {
                    console.error("Erro ao buscar dados do animal: ", error);
                    alert("Erro ao carregar os dados do animal.");
                    navigate('/animais');
                }
            };
            buscarDadosAnimal();
        }

        carregarUsuarios();
    }, [animalId, dadosCarregados, navigate, carregarUsuarios]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dadosOriginais) {
            alert("Os dados do animal não foram carregados corretamente.");
            return;
        }

        const formData = new FormData();
        formData.append("ID", animalId);
        formData.append("Nome", nome.trim());
        formData.append("Raca", raca.trim());
        formData.append("Especie", especie.trim());
        formData.append("UsuarioID", usuarioID);
        formData.append("Achado", achado); // Adiciona o status de achado

        if (imagem) {
            formData.append("Imagem", imagem);
        }

        try {
            const response = await AnimaisAPI.atualizarAsync(animalId, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Resposta da atualização:", response);
            navigate("/animais");
        } catch (error) {
            console.error("Erro ao atualizar animal:", error.response ? error.response.data : error.message);
            alert("Erro ao atualizar o animal.");
        }
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Animal</h3>

                    {urlImagem && (
                        <div className="mb-3">
                            <img 
                                src={urlImagem} 
                                alt="Imagem do Animal" 
                                style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "10px", display: "block", marginBottom: "10px" }} 
                            />
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNome" className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome do animal" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formRaca" className="mb-3">
                            <Form.Label>Raça</Form.Label>
                            <Form.Control type="text" placeholder="Digite a raça do animal" value={raca} onChange={(e) => setRaca(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formEspecie" className="mb-3">
                            <Form.Label>Espécie</Form.Label>
                            <Form.Control type="text" placeholder="Digite a espécie do animal" value={especie} onChange={(e) => setEspecie(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formUsuario" className="mb-3">
                            <Form.Label>Dono do Animal</Form.Label>
                            <Form.Control as="select" value={usuarioID} onChange={(e) => setUsuarioID(e.target.value)} required>
                                <option value="">Selecione o dono</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formAchado" className="mb-3">
                            <Form.Label>Status de Perdido</Form.Label>
                            <Form.Control
                                as="select"
                                value={achado}
                                onChange={(e) => setAchado(e.target.value === "true")} // Converte para booleano
                                required
                            >
                                <option value="true">Encontrado</option>
                                <option value="false">Perdido</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formImagemAnimal" className="mb-3">
                            <Form.Label>Imagem do Animal</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Atualizar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    );
}
