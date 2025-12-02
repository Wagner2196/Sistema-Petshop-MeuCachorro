import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import style from "./Login.module.css";
import UsuarioAPI from "../../services/usuarioAPI";

export function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await UsuarioAPI.loginAsync(email, senha);

            alert("Login realizado com sucesso!");
            navigate("/usuarios");

        } catch (error) {
            console.error("Erro ao logar:", error);

            // 🔥 Status 400 (usuário não encontrado / senha errada)
            if (error.response?.status === 400) {
                const msg = error.response.data || "Email ou senha incorretos!";
                alert(msg);
                return;
            }

            // 🔥 Status 401 (não autorizado)
            if (error.response?.status === 401) {
                alert("Email ou senha incorretos!");
                return;
            }

            // 🔥 Mensagem específica da API
            if (error.response?.data?.message) {
                alert(error.response.data.message);
                return;
            }

            // 🔥 Erro genérico
            alert("Não foi possível realizar o login. Tente novamente.");
        }
    };

    return (
        <div className={style.pagina_conteudo}>
            <img src={logo} alt="Logo Meucachorro" className={style.logo} />

            <input
                type="email"
                className={style.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className={style.input}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            <button className={style.botao_entrar} onClick={handleLogin}>
                Entrar
            </button>
        </div>
    );
}
