import { motion } from "framer-motion";
import React, { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { images } from "../../constants";
import "./Navbar.scss";

const navLinkItems = ["home", "about", "work", "skills", "contact"];
const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="logo" />
      </div>
      <ul className="app__navbar-links">
        {navLinkItems.map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div/>
            <a href={`# ${item}`}>{item}</a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-menu">
        <HiMenuAlt4 onClick={() => setToggle(true)} />

        {toggle && (
          <motion.div
            whileInView={{ x: [0, 300] }}
            transition={{ duration: 0.85, easing: "easeOut" }}
          >
            <HiX onClick={() => setToggle(false)} />
            <ul>
              {navLinkItems.map((item) => (
                <li key={item}>
                  <div/>
                  <a href={`# ${item}`} onClick={() => setToggle(false)}>{item}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;