import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "../Usuarios/Usuarios.module.css";
import { useState, useEffect, useCallback } from "react";
import UsuariosAPI from "../../services/usuarioAPI";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { Table, Modal, Button } from "react-bootstrap";

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("todos");

  const handleClickDeletar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    if (!usuarioSelecionado) return;

    try {
      await UsuariosAPI.deletarAsync(usuarioSelecionado.id);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((u) => u.id !== usuarioSelecionado.id)
      );
    } catch (error) {
      console.error("Erro ao deletar usuário: ", error.response || error.message);
    } finally {
      handleFecharModal();
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setUsuarioSelecionado(null);
  };

  const carregarUsuarios = useCallback(async () => {
    try {
      const listarUsuarios = await UsuariosAPI.listarAsync(true);
      setUsuarios(listarUsuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  // Filtrando os usuários por nome e tipo
  const usuariosFiltrados = usuarios
    .filter((usuario) =>
      usuario.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )
    .filter((usuario) =>
      tipoSelecionado === "todos" || usuario.tipoUsuarioNome === tipoSelecionado
    );

  // Extraindo tipos únicos para o select
  const tiposUsuarios = Array.from(
    new Set(usuarios.map((u) => u.tipoUsuarioNome))
  );

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h1>Usuários</h1>
            <Link to="/usuario/novo" className={style.botao_novo}>
              + Novo
            </Link>
          </div>

          {/* Filtros */}
          <div className={style.filtros}>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              className={style.input_pesquisa}
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />

            <select
              className={style.select_tipo}
              value={tipoSelecionado}
              onChange={(e) => setTipoSelecionado(e.target.value)}
            >
              <option value="todos">Todos os Tipos</option>
              {tiposUsuarios.map((tipo, idx) => (
                <option key={idx} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className={style.tabela}>
            <Table responsive>
              <thead className={style.tabela_cabecalho}>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tabela_corpo}>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.tipoUsuarioNome}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.endereco}</td>
                    <td>{usuario.telefone}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <Link
                        to={`/usuario/editar/${usuario.id}`}
                        className={style.botao_editar}
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => handleClickDeletar(usuario)}
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
              <Modal.Title>Confirmar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Tem certeza que deseja deletar o usuário {usuarioSelecionado?.nome}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleFecharModal}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeletar}>
                Deletar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Topbar>
    </Sidebar>
  );
}
