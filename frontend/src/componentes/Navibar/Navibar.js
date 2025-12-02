import React from "react";
import { Link } from "react-router-dom";
import style from "./Navibar.module.css";

const Navbar = () => {
  return (
    <nav className={style.navbar}>
      <ul className={style.navList}>
        <li>
          <Link to="/login" className={style.navLink}>Login</Link>
        </li>
        <li>
          <a 
            href="https://api.whatsapp.com/send/?phone=35988272088&text&type=phone_number&app_absent=0" 
            className={style.navLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Contato
          </a>
        </li>
      </ul>
      <Link to="/login">
        <button className={style.loginButton}>Login</button>
      </Link>
    </nav>
  );
};

export default Navbar;
