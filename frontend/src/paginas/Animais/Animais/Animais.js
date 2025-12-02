import style from "../Animais/Animais.module.css";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Modal, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import animaisAPI from "../../../services/animaisAPI";

export function Animais() {
    const [animais, setAnimais] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [termoBusca, setTermoBusca] = useState("");
    const [especies, setEspecies] = useState([]); // Para armazenar as espécies únicas
    const [especieSelecionada, setEspecieSelecionada] = useState("Todas"); // Para o filtro de espécies

    const handleClickDeletar = (animal) => {
        setUsuarioSelecionado(animal);
        setMostrarModal(true);
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
        setUsuarioSelecionado(null);
    };

    const handleDeletar = async () => {
        if (!usuarioSelecionado) return;
        try {
            await animaisAPI.deletarAsync(usuarioSelecionado.id);
            alert("Animal excluído com sucesso!");
            setAnimais((prevAnimais) =>
                prevAnimais.filter((a) => a.id !== usuarioSelecionado.id)
            );
        } catch (error) {
            console.error("Erro ao deletar animal:", error);
            alert("Erro ao excluir o animal. Tente novamente.");
        } finally {
            handleFecharModal();
        }
    };

    async function carregarAnimais() {
        try {
            const listarAnimais = await animaisAPI.listarAsync(true);
            setAnimais(listarAnimais);

            // Extrair as espécies únicas
            const especiesUnicas = [...new Set(listarAnimais.map((a) => a.especie))].sort();
            setEspecies(especiesUnicas); // Atualiza o estado com as espécies únicas
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            alert("Erro ao carregar os animais. Tente novamente.");
        }
    }

    useEffect(() => {
        carregarAnimais();
    }, []);

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Animais</h3>
                        <Link to="/animais/novo" className={style.botao_novo_usuario}>
                            Novo Animal
                        </Link>
                    </div>

                    {/* Filtros de busca */}
                    <div className={style.filtros}>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            className={style.input_pesquisa}
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />

                        <select
                            className={style.select_filtro}
                            value={especieSelecionada}
                            onChange={(e) => setEspecieSelecionada(e.target.value)}
                        >
                            <option value="Todas">Todas as Espécies</option>
                            {especies.map((especie) => (
                                <option key={especie} value={especie}>
                                    {especie}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tabela de animais */}
                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Nome</th>
                                    <th>Espécie</th>
                                    <th>Raça</th>
                                    <th>Dono</th>
                                    <th>Perdido</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>
                                {animais
                                    .filter((animal) =>
                                        animal.nome.toLowerCase().includes(termoBusca.toLowerCase())
                                    )
                                    .filter((animal) =>
                                        especieSelecionada === "Todas"
                                            ? true
                                            : animal.especie === especieSelecionada
                                    )
                                    .sort((a, b) => a.nome.localeCompare(b.nome))
                                    .map((animal) => (
                                        <tr key={animal.id}>
                                            <td>{animal.nome}</td>
                                            <td>{animal.especie}</td>
                                            <td>{animal.raca}</td>
                                            <td>{animal.dono}</td>
                                            <td>{animal.achado === false ? "Sim" : "Não"}</td>
                                            <td>
                                                <Link
                                                    to={`/animais/editar/${animal.id}`}
                                                    className={style.botao_editar}
                                                >
                                                    <MdEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleClickDeletar(animal)}
                                                    className={style.botao_deletar}
                                                >
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Modal de confirmação */}
                    <Modal show={mostrarModal} onHide={handleFecharModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Excluir Animal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Você tem certeza que deseja excluir este animal?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleFecharModal}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDeletar}>
                                Excluir
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Topbar>
        </Sidebar>
    );
}
