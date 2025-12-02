import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./Relatorios.module.css";
import { useState } from "react";
import { Table } from "react-bootstrap";
import RelatoriosAPI from "../../services/relatoriosAPI";

// --- Função para formatar moeda ---
const formatarMoeda = (valor) => {
  try {
    const numero =
      typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : valor;

    if (isNaN(numero)) return String(valor);

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch (e) {
    return String(valor);
  }
};

// --- Função para formatar datas ---
const formatarData = (dataStr) => {
  if (!dataStr) return "";

  const data = new Date(dataStr);

  if (isNaN(data.getTime())) return dataStr;

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
};

export function Relatorios() {
  const [dados, setDados] = useState(null);
  const [dataFiltro, setDataFiltro] = useState("");
  const [periodo, setPeriodo] = useState("dia");
  const [categoria, setCategoria] = useState("todos");
  const [tituloRelatorio, setTituloRelatorio] = useState("Selecione um Relatório");

  const nomesColunas = {
    Dono: "Dono",
    Animal: "Animal",
    Consulta: "Consulta",
    Data: "Data",
    Valor: "Valor (R$)",
    ValorTotal: "Valor Total (R$)",
    Media: "Média (R$)",
    AnimalID: "ID do Animal",
    NomeAnimal: "Nome do Animal",
    TotalConsultas: "Total de Consultas",
    ID: "ID",
    Nome: "Nome",
    Especie: "Espécie",
    Descricao: "Descrição",
  };

  const colunasMoeda = ["valor", "valortotal", "media", "totalfaturado"];

  async function buscar(tipo) {
    let titulo = "Relatório Não Definido";

    try {
      let resp = null;

      switch (tipo) {
        case "ConsultasCompleta":
          resp = await RelatoriosAPI.consultasCompletaAsync();
          titulo = "Relatório Geral de Consultas";
          break;

        case "ConsultasPorAnimal":
          resp = await RelatoriosAPI.consultasPorAnimalAsync();
          titulo = "Consultas por Animal";
          break;

        case "Top5Animais":
          resp = await RelatoriosAPI.top5AnimaisAsync();
          titulo = "Animais Mais Atendidos (Top 5)";
          break;

        case "AcimaMedia":
          resp = await RelatoriosAPI.acimaMediaAsync();
          titulo = "Consultas com Valor Acima da Média";
          break;

        case "AnimaisSemConsulta":
          resp = await RelatoriosAPI.animaisSemConsultaAsync();
          titulo = "Animais Sem Registro de Consultas";
          break;

        default:
          alert("Relatório inválido!");
          return;
      }

      setDados(resp);
      setTituloRelatorio(titulo);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar relatório!");
    }
  }

  async function buscarFaturamento() {
    if (!dataFiltro) {
      alert("Selecione uma data!");
      return;
    }

    try {
      const resp = await RelatoriosAPI.faturamentoAsync(
        periodo,
        dataFiltro,
        categoria
      );

      setDados(resp);
      setTituloRelatorio(`Faturamento: ${periodo.toUpperCase()} - ${categoria}`);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar faturamento!");
    }
  }

  // ---- Faturamento ----
  function renderizarFaturamento() {
    if (!dados) return "Nenhum dado carregado.";

    const detalhes = dados.detalhes || [];

    return (
      <div>
        <div className={style.caixa_relatorios}>
          <h3>Resumo - {dados.periodo?.toUpperCase()}</h3>
          <p><strong>Categoria:</strong> {dados.categoria}</p>
          <p><strong>Data Base:</strong> {dados.dataBase}</p>
          <p><strong>Quantidade de Consultas:</strong> {dados.quantidade}</p>
          <p><strong>Total Faturado:</strong> {formatarMoeda(dados.totalFaturado)}</p>
        </div>

        <div className={style.caixa_relatorios}>
          <h3>Detalhes das Consultas</h3>

          {detalhes.length === 0 ? (
            <p>Nenhuma consulta encontrada para esse filtro.</p>
          ) : (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Data/Hora</th>
                  <th>Animal</th>
                  <th>Dono</th>
                </tr>
              </thead>

              <tbody>
                {detalhes.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.servico}</td>
                    <td>{formatarMoeda(item.valor)}</td>
                    <td>{formatarData(item.data)}</td>
                    <td>{item.animal}</td>
                    <td>{item.dono}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    );
  }

  // ---- Tabela genérica ----
  function renderizarTabelaGenerica() {
    if (!Array.isArray(dados) || dados.length === 0) {
      return "Nenhum dado carregado.";
    }

    const colunas = Object.keys(dados[0]);

    return (
      <Table striped bordered responsive>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna}>{nomesColunas[coluna] || coluna}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dados.map((linha, i) => (
            <tr key={linha.ID || linha.AnimalID || i}>
              {colunas.map((coluna, j) => {
                const valor = linha[coluna];
                const nomeCol = coluna.toLowerCase();

                let valorFormatado = String(valor);

                if (colunasMoeda.includes(nomeCol)) {
                  valorFormatado = formatarMoeda(valor);
                }

                if (nomeCol === "data") {
                  valorFormatado = formatarData(valor);
                }

                return <td key={j}>{valorFormatado}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h1 className={style.titulo_branco}>Relatórios</h1>
          </div>

          <hr />

          <div className={style.caixa_relatorios}>
            <h2>Consultas Complexas</h2>

            <div className={style.botoes}>
              <button className={style.botao} onClick={() => buscar("ConsultasCompleta")}>
                Relatório Geral de Consultas
              </button>

              <button className={style.botao} onClick={() => buscar("ConsultasPorAnimal")}>
                Consultas por Animal
              </button>

              <button className={style.botao} onClick={() => buscar("Top5Animais")}>
                Animais Mais Atendidos
              </button>

              <button className={style.botao} onClick={() => buscar("AcimaMedia")}>
                Consultas com Valor Acima da Média
              </button>

              <button className={style.botao} onClick={() => buscar("AnimaisSemConsulta")}>
                Animais Sem Registro de Consultas
              </button>
            </div>
          </div>

          <hr />

          <div className={style.caixa_relatorios}>
            <h2>Faturamento</h2>

            <div className={style.filtros}>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className={style.select}
              >
                <option value="dia">Dia</option>
                <option value="semana">Semana</option>
                <option value="mes">Mês</option>
              </select>

              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                className={style.input}
              />

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={style.select}
              >
                <option value="todos">Todos os Serviços</option>
                <option value="veterinario">Veterinário</option>
                <option value="banhoetosa">Banho e Tosa</option>
              </select>

              <button className={style.botao} onClick={buscarFaturamento}>
                Buscar Faturamento
              </button>
            </div>
          </div>

          <hr />

          <div className={style.resultado}>
            <h2 className={style.subtitulo_branco}>{tituloRelatorio}</h2>

            {dados && !Array.isArray(dados) && dados.detalhes
              ? renderizarFaturamento()
              : Array.isArray(dados)
                ? renderizarTabelaGenerica()
                : "Nenhum dado carregado."
            }
          </div>
        </div>
      </Topbar>
    </Sidebar>
  );
}
