import style from "./Home.module.css";
import fachada from "../../assets/fachada01.jpeg";
import x from "../../assets/logoX.png";
import facebook from "../../assets/logoFacebook.png";
import instagram from "../../assets/logoInstagram.png";
import quemSomos from "../../assets/quemSomos.jpeg";
import NossaMissao from "../../assets/nossaMissao.jpeg";
import produtosPet from "../../assets/produtosPet.jpg";
import Navbar from "../../componentes/Navibar/Navibar";  // Corrigido para importação padrão

export function Home() {
  return (
    <div className={style.conteudo}>
      <Navbar /> {/* O Navbar agora está importado corretamente */}
      <div className={style.titulo}>
        <h2>Bem-vindo ao Meucachorro.com!</h2>
      </div>

      <div className={style.texto}>
        <h2>🐶 Quem Somos </h2>
        <p>
          No MeuCachorro.com, somos apaixonados por pets! ❤️ Nosso objetivo é oferecer tudo o que seu melhor amigo precisa para viver feliz, saudável e cheio de energia. Desde ração e petiscos até brinquedos, acessórios e serviços especializados, cuidamos do seu cãozinho com todo o carinho que ele merece.
          <img className={style.imagem} src={quemSomos} alt="Imagem representativa" />
        </p>
      </div>

      <div className={style.texto}>
        <h2>🏡 Nossa História</h2>
        <p>
          Tudo começou com o amor incondicional pelos animais. Percebemos que muitas pessoas buscavam produtos e serviços de qualidade para seus cães, mas tinham dificuldades em encontrar tudo em um só lugar. Foi assim que nasceu o MeuCachorro.com, um petshop feito por quem ama cachorros, para quem ama cachorros! 🐕
          <img className={style.imagemDireita} src={fachada} alt="Fachada do petshop" />
        </p>
      </div>

      <div className={style.texto}>
        <h2>💙 Nossa Missão</h2>
        <p>
          Nosso compromisso é garantir o bem-estar e a felicidade dos pets e de seus tutores. Trabalhamos com marcas confiáveis, produtos selecionados e um atendimento que coloca o amor pelos animais sempre em primeiro lugar.
          <img className={style.imagem} src={NossaMissao} alt="Imagem representativa" />
        </p>
      </div>

      <div className={style.texto}>
        <h2>🐾 O Que Oferecemos?</h2>
        <ul>
          <li>✅ Produtos de alta qualidade para cães de todas as idades e raças</li>
          <li>✅ Rações e petiscos nutritivos e saudáveis</li>
          <li>✅ Brinquedos e acessórios para momentos de diversão</li>
          <li>✅ Atendimento dedicado para tirar suas dúvidas e ajudar na melhor escolha</li>
        </ul>
        <img className={style.imagemDireita} src={produtosPet} alt="Imagem representativa" />
      </div>

      <footer className={style.rodape}>
        <div className={style.redeSociais}>
          <h3>🚀 Siga-nos nas redes sociais e acompanhe as novidades!</h3>
          <div className={style.iconesRedes}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={x} alt="Twitter" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
