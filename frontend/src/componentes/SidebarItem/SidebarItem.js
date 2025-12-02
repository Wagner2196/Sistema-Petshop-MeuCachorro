import style from "../SidebarItem/SidebarItem.module.css"; // Certifique-se de que está importando o CSS corretamente
import { Link } from "react-router-dom";

export function SidebarItem({ text, link, logo }) {
    return (
        <Link to={link} className={style.sidebar_item}>
            <div className={style.logo_container}>
                {logo}
            </div>
            {/* Aplique a classe texto_link apenas ao texto */}
            <h3 className={style.texto_link}>{text}</h3>
        </Link>
    );
}
