import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "../../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../../componentes/Topbar/Topbar";
import style from "../Animais/Animais.module.css";
import { useNavigate } from "react-router-dom";
import UsuarioAPI from "../../../services/usuarioAPI";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import AnimaisAPI from "../../../services/animaisAPI";

export function NovoAnimal() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState('');
  const [imagem, setImagem] = useState(null);
  const [urlImagem, setUrlImagem] = useState('');
  const [usuarioID, setUsuarioID] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const navigate = useNavigate();

  const carregarUsuarios = useCallback(async () => {
    try {
      const listarUsuarios = await UsuarioAPI.listarAsync(true);
      setUsuarios(listarUsuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setUrlImagem(URL.createObjectURL(file));
    }
  };

  const isFormValid = () => {
    return [nome, raca, especie, usuarioID].every(val => val && val.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');

    if (!isFormValid()) {
      setMensagemErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      const novoAnimal = {
        nome,
        raca,
        especie,
        UsuarioID: Number(usuarioID),
        imagem,
      };

      await AnimaisAPI.criarAsync(novoAnimal);
      setMensagemSucesso('Animal cadastrado com sucesso!');
      setTimeout(() => {
        navigate('/animais');
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar animal:", error);
      setMensagemErro('Erro ao salvar animal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <h3>Novo Animal</h3>

          {urlImagem && (
            <div className="mb-3">
              <img
                src={urlImagem}
                alt="Imagem do Animal"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  borderRadius: "10px",
                  display: "block",
                  marginBottom: "10px"
                }}
              />
            </div>
          )}

          {mensagemErro && <Alert variant="danger">{mensagemErro}</Alert>}
          {mensagemSucesso && <Alert variant="success">{mensagemSucesso}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNome" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do animal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formRaca" className="mb-3">
              <Form.Label>Raça</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a raça do animal"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEspecie" className="mb-3">
              <Form.Label>Espécie</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a espécie do animal"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formUsuario" className="mb-3">
              <Form.Label>Dono do Animal</Form.Label>
              <Form.Control
                as="select"
                value={usuarioID}
                onChange={(e) => setUsuarioID(e.target.value)}
                required
              >
                <option value="">Selecione o dono</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                ))}
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

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Form>
        </div>
      </Topbar>
    </Sidebar>
  );
}
