import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./NovaConsulta.module.css";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import ConsultaAPI from "../../../services/consultaAPI";
import UsuarioAPI from "../../../services/usuarioAPI";
import AnimaisAPI from "../../../services/animaisAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

export function NovaConsulta() {
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

    const carregarConsultas = useCallback(async () => {
        try {
            const listarUsuarios = await UsuarioAPI.listarAsync(true);
            setUsuarios(listarUsuarios);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }, []);

    const carregarAnimais = useCallback(async () => {
        try {
            const listaAnimais = await AnimaisAPI.listarAsync(true);
            setAnimais(listaAnimais);
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
        }
    }, []);

    const tiposConsulta = [
        { id: 0, nome: "Veterinário" },
        { id: 1, nome: "Banho e Tosa" },
    ];

    useEffect(() => {
        carregarConsultas();
        carregarAnimais();
    }, [carregarConsultas, carregarAnimais]);

    // ⏱️ Define a data e hora atuais automaticamente
    useEffect(() => {
        const agora = new Date();
        const dataFormatada = agora.toISOString().split("T")[0];
        const horaFormatada = agora.toTimeString().slice(0, 5);
        setDataConsulta(dataFormatada);
        setHoraConsulta(horaFormatada);
    }, []);

    const isFormValid = () => {
        return dataConsulta && horaConsulta && descricao && valor && usuarioID && animalID && tipoConsulta;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const dataHora = `${dataConsulta}T${horaConsulta}`;

        const novaConsulta = {
            dataConsulta: dataHora,
            descricao,
            valor: parseFloat(valor),
            usuarioID: parseInt(usuarioID),
            animalID: parseInt(animalID),
            tipoConsultaID: parseInt(tipoConsulta),
        };

        try {
            await ConsultaAPI.criarAsync(novaConsulta);
            navigate(-1);
        } catch (error) {
            console.error("Erro ao criar consulta:", error);
        }
    };

    return (
        <Sidebar>
            <Topbar>
                <div className={style.pagina_conteudo}>
                    <h3>Nova Consulta</h3>

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

                        <Form.Group className="mb-3" controlId="descricao">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descrição da consulta"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="valor">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Valor da consulta"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tipoConsulta">
                            <Form.Label>Tipo de Consulta</Form.Label>
                            <Form.Control
                                as="select"
                                value={tipoConsulta}
                                onChange={(e) => setTipoConsulta(e.target.value)}
                                required
                            >
                                <option value="">Selecione o tipo de consulta</option>
                                {tiposConsulta.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formUsuario" className="mb-3">
                            <Form.Label>Dono do Animal</Form.Label>
                            <Form.Control
                                as="select"
                                value={usuarioID}
                                onChange={(e) => {
                                    setUsuarioID(e.target.value);
                                    setAnimalID("");
                                }}
                                required
                            >
                                <option value="">Selecione o dono</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formAnimal" className="mb-3">
                            <Form.Label>Animal</Form.Label>
                            <Form.Control
                                as="select"
                                value={animalID}
                                onChange={(e) => setAnimalID(e.target.value)}
                                required
                            >
                                <option value="">Selecione o animal</option>
                                {animais
                                    .filter((animal) => animal.usuarioID === parseInt(usuarioID))
                                    .map((animal) => (
                                        <option key={animal.id} value={animal.id}>
                                            {animal.nome}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </div>
            </Topbar>
        </Sidebar>
    );
}
