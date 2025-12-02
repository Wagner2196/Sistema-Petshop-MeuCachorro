import style from "../BanhoTosa/BanhoTosa.module.css";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Modal, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import consultasAPI from "../../../services/consultaAPI";

export function BanhoEtosa() {
    const [consultas, setConsultas] = useState([]);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const hoje = new Date().toISOString().split('T')[0];
    const [dataFiltro, setDataFiltro] = useState(hoje);
    const [mostrarTodas, setMostrarTodas] = useState(false); // ✅ Novo estado

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
            const listarConsultas = await consultasAPI.listarVeterinario(true);
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

    const consultasFiltradas = consultas
        .filter((consulta) => {
            if (mostrarTodas) return true; // ✅ Mostra tudo se checkbox estiver marcado
            if (!dataFiltro) return true;
            const dataConsulta = new Date(consulta.dataConsulta).toISOString().split('T')[0];
            return dataConsulta === dataFiltro;
        })
        .sort((a, b) => {
            const horaA = new Date(a.dataConsulta).getHours() * 60 + new Date(a.dataConsulta).getMinutes();
            const horaB = new Date(b.dataConsulta).getHours() * 60 + new Date(b.dataConsulta).getMinutes();
            return horaA - horaB;
        });

    if (loading) {
        return <div>Carregando consultas...</div>;
    }

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <div className={style.pagina_cabecalho}>
                        <h3>Banho e Tosa</h3>
                        <div className={style.filtro_data}>
                            <label htmlFor="filtroData">Filtrar por data:</label>
                            <input
                                type="date"
                                id="filtroData"
                                value={dataFiltro}
                                onChange={(e) => setDataFiltro(e.target.value)}
                                className={style.input_filtro}
                                disabled={mostrarTodas} // ✅ Desativa quando checkbox estiver marcado
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
                                    <th>Nome Animal</th>
                                    <th>Dono</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={style.tabela_corpo}>
                                {consultasFiltradas.map((consulta) => (
                                    <tr key={consulta.id}>
                                        <td>
                                            {new Date(consulta.dataConsulta).toLocaleDateString()}{" "}
                                            {new Date(consulta.dataConsulta).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>{consulta.animalNome}</td>
                                        <td>{consulta.donoNome}</td>
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
