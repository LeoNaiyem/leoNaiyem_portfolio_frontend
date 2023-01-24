import { motion } from "framer-motion";
import React from "react";
import { images } from '../../constants';
import "./About.scss";

const abouts = [
  {
    title: "Web Developer",
    description: "I am a good web developer",
    imgUrl: images.about01,
  },
  {
    title: "Web Designer",
    description: "I am a good web developer",
    imgUrl: images.about02,
  },
  {
    title: "Web Developer",
    description: "I am a good web developer",
    imgUrl: images.about03,
  },
  {
    title: "Web Developer",
    description: "I am a good web developer",
    imgUrl: images.about04,
  },
];
const About = () => {
  return (
    <>
      <h1 className="head-text">
        I Know that
        <span> Good Apps</span> <br />
        means
        <span> Good Business</span>
      </h1>
      <div className="app__profiles">
        {abouts.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="app__profile-item"
            key={about.title + index}
          >
            <img src={about.imgUrl} alt={about.title} />
            <h2 className="bold-text" style={{ marginTop: 20 }}>
              {about.title}
            </h2>
            <h2 className="p-text" style={{ marginTop: 10 }}>
              {about.description}
            </h2>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default About;
