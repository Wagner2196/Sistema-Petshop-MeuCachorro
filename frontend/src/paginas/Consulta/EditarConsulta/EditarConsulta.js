import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./EditarConsulta.module.css";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import ConsultaAPI from "../../../services/consultaAPI";
import UsuarioAPI from "../../../services/usuarioAPI";
import AnimaisAPI from "../../../services/animaisAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

export function EditarConsulta() {
    const { id } = useParams();
    const [usuarios, setUsuarios] = useState([]);
    const [animais, setAnimais] = useState([]);

    const [dataConsulta, setDataConsulta] = useState('');
    const [horaConsulta, setHoraConsulta] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('');
    const [usuarioID, setUsuarioID] = useState('');
    const [animalID, setAnimalID] = useState('');

    const navigate = useNavigate();

    const carregarUsuariosEAnimais = useCallback(async () => {
        try {
            const listarUsuarios = await UsuarioAPI.listarAsync(true);
            const listaAnimais = await AnimaisAPI.listarAsync(true);
            setUsuarios(listarUsuarios);
            setAnimais(listaAnimais);
        } catch (error) {
            console.error("Erro ao carregar usuários e animais:", error);
        }
    }, []);

    const carregarConsulta = useCallback(async () => {
        try {
            const consulta = await ConsultaAPI.obterAsync(id);
            console.log("Dados da consulta carregados:", consulta);

            setDataConsulta(consulta.dataConsulta.split("T")[0]);
            setHoraConsulta(consulta.dataConsulta.split("T")[1].substring(0, 5));
            setDescricao(consulta.descricao);
            setValor(consulta.valor);
            setTipoConsulta(consulta.tipoConsultaID.toString());
            setUsuarioID(consulta.usuarioID.toString());
            setAnimalID(consulta.animalID.toString());
        } catch (error) {
            console.error("Erro ao carregar consulta:", error);
            alert("Erro ao carregar dados da consulta. Tente novamente.");
        }
    }, [id]);

    useEffect(() => {
        carregarUsuariosEAnimais();
        carregarConsulta();
    }, [carregarUsuariosEAnimais, carregarConsulta]);

    const isFormValid = () => {
        return dataConsulta && horaConsulta && descricao && valor && usuarioID && animalID && tipoConsulta;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        const dataHora = `${dataConsulta}T${horaConsulta}:00`;

        const consultaAtualizada = {
            Id: parseInt(id),
            DataConsulta: dataHora,
            Descricao: descricao,
            Valor: parseFloat(valor),
            UsuarioID: parseInt(usuarioID),
            AnimalID: parseInt(animalID),
            TipoConsultaID: parseInt(tipoConsulta),
            TipoConsulta: parseInt(tipoConsulta)
        };

        console.log("Dados a serem enviados:", consultaAtualizada);

        try {
            await ConsultaAPI.atualizarAsync(consultaAtualizada);
            navigate(-1);
        } catch (error) {
            console.error(
                "Erro ao atualizar consulta:",
                error.response ? error.response.data : error
            );
        }
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Editar Consulta</h3>

                    <Form onSubmit={handleSubmit} className={style.formulario}>
                        <Form.Group controlId="dataConsulta">
                            <Form.Label>Data da Consulta</Form.Label>
                            <Form.Control
                                type="date"
                                value={dataConsulta}
                                onChange={(e) => setDataConsulta(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="horaConsulta">
                            <Form.Label>Hora da Consulta</Form.Label>
                            <Form.Control
                                type="time"
                                value={horaConsulta}
                                onChange={(e) => setHoraConsulta(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="descricao" className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="valor" className="mb-3">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="number"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="tipoConsulta" className="mb-3">
                            <Form.Label>Tipo de Consulta</Form.Label>
                            <Form.Select
                                value={tipoConsulta}
                                onChange={(e) => setTipoConsulta(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                <option value="0">Veterinário</option>
                                <option value="1">Banho e Tosa</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="usuarioID" className="mb-3">
                            <Form.Label>Dono do Animal</Form.Label>
                            <Form.Select
                                value={usuarioID}
                                onChange={(e) => setUsuarioID(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                {usuarios.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="animalID" className="mb-3">
                            <Form.Label>Animal</Form.Label>
                            <Form.Select
                                value={animalID}
                                onChange={(e) => setAnimalID(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                {animais.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Salvar Alterações
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    );
}
