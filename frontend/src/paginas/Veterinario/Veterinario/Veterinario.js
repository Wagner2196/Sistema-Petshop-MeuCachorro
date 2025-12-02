import style from "../Veterinario/Veterinario.module.css"; // Ajuste o caminho do CSS
import { Sidebar } from "../../../componentes/Sidebar/Sidebar"; // Ajuste o caminho do Sidebar
import { Topbar } from "../../../componentes/Topbar/Topbar"; // Ajuste o caminho do Topbar
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Modal, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import consultasAPI from "../../../services/consultaAPI"; // Certifique-se de que este caminho está correto

export function Veterinario() {
    const [consultas, setConsultas] = useState([]);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const hoje = new Date().toISOString().split("T")[0];
    const [dataFiltro, setDataFiltro] = useState(hoje);
    const [mostrarTodas, setMostrarTodas] = useState(false); // NOVO: controle do checkbox

    const handleClickDeletar = (consulta) => {
        setConsultaSelecionada(consulta);
        setMostrarModal(true);
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
        setConsultaSelecionada(null);
    };

    const handleDeletar = async () => {
        if (!consultaSelecionada) return;
        try {
            await consultasAPI.deletarAsync(consultaSelecionada.id);
            setConsultas((prevConsultas) =>
                prevConsultas.filter((c) => c.id !== consultaSelecionada.id)
            );
        } catch (error) {
            console.error("Erro ao deletar consulta:", error);
        } finally {
            handleFecharModal();
        }
    };

    async function carregarConsultas() {
        setLoading(true);
        try {
            const listarConsultas = await consultasAPI.listarBanhoTosaAsync(true);
            setConsultas(listarConsultas);
            console.log("Consultas de Banho e Tosa carregadas:", listarConsultas);
        } catch (error) {
            console.error("Erro ao carregar consultas de Banho e Tosa:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarConsultas();
    }, []);

    if (loading) {
        return <div>Carregando consultas...</div>;
    }

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Veterinario</h3>

                        {/* 🔽 Filtro por data com checkbox "Mostrar todas" */}
                        <div className={style.filtro_data}>
                            <label htmlFor="filtroData">Filtrar por data:</label>
                            <input
                                type="date"
                                id="filtroData"
                                value={dataFiltro}
                                onChange={(e) => setDataFiltro(e.target.value)}
                                className={style.input_filtro}
                                disabled={mostrarTodas}
                            />

                            <label style={{ marginLeft: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={mostrarTodas}
                                    onChange={(e) => setMostrarTodas(e.target.checked)}
                                />{" "}
                                Mostrar todas
                            </label>
                        </div>

                        <Link to="/consultas/novo" className={style.botao_novo_usuario}>
                            Nova Consulta
                        </Link>
                    </div>

                    <div className={style.tabela}>
                        <Table responsive>
                            <thead className={style.tabela_cabecalho}>
                                <tr>
                                    <th>Data / Horas</th>
                                    <th>Dono</th>
                                    <th>Nome Animal</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>
                                {consultas
                                    .filter((consulta) =>
                                        mostrarTodas
                                            ? true
                                            : consulta.dataConsulta.split("T")[0] === dataFiltro
                                    )

                                    .map((consulta) => (
                                        <tr key={consulta.id}>
                                            <td>
                                                {new Date(consulta.dataConsulta).toLocaleDateString()}{" "}
                                                {new Date(consulta.dataConsulta).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td>{consulta.donoNome}</td>
                                            <td>{consulta.animalNome}</td>
                                            <td>{consulta.descricao}</td>
                                            <td>
                                                {consulta.valor.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/consultas/editar/${consulta.id}`}
                                                    className={style.botao_editar}
                                                >
                                                    <MdEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleClickDeletar(consulta)}
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

                    <Modal show={mostrarModal} onHide={handleFecharModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Excluir Consulta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Você tem certeza que deseja excluir esta consulta?
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
