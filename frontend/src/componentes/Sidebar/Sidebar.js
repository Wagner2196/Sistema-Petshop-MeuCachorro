import style from "../Sidebar/Sidebar.module.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { MdGroup } from "react-icons/md";
import { FaSyringe } from "react-icons/fa6";
import { LuDog } from "react-icons/lu";
import { AiFillAlert } from "react-icons/ai";
import { FaSoap } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";


export function Sidebar({ children }) {
    return (
        <div>
            <div className={style.sidebar_conteudo}>
                <div className={style.sidebar_header}>
                    <Link to="/">
                        <img src={logo} alt="logoMeucachorro" className={style.logo} />
                    </Link>
                    <hr className={style.linha} />
                </div>

                <div className={style.sidebar_corpo}>
                    
                    <SidebarItem text="Usuários" link="/usuarios" logo={<MdGroup />} />
                    <SidebarItem text="Animais" link="/animais" logo={<LuDog />} />

                    <SidebarItem text="Veterinário" link="/veterinario" logo={<FaSyringe />} />
                    <SidebarItem text="Banho e Tosa" link="/banhoetosa" logo={<FaSoap />} />
                    <SidebarItem text="Animal Perdido" link="/animaisperdidos" logo={<AiFillAlert />} />
                     <SidebarItem text="Relatorios" link="/relatorios" logo={<TbReportSearch />} />

                </div>

            </div>
            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}
