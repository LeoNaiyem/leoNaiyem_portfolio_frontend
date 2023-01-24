import React from "react";
import { BsGithub, BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const SocialMedia = () => {
  return (
    <div className="app__social">
      <div>
        <a
          href="https://www.linkedin.com/in/naiyem-hossain-a94b961a2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn />
        </a>
      </div>
      <div>
        <a href="https://www.instagram.com/leonaiyem/" target="_blank" rel="noopener noreferrer">
          <BsInstagram />
        </a>
      </div>
      <div>
        <a href="https://github.com/leonaiyem" target="_blank" rel="noopener noreferrer">
          <BsGithub />
        </a>
      </div>
      <div>
        <a href="https://www.facebook.com/MuhammadNaiyemHossain/" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
