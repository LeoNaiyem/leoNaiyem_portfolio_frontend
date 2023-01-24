import React from "react";

const navLinkItems = [
  "home",
  "about",
  "work",
  "skills",
  "testimonials",
  "contact",
];
const NavigationDots = ({ active }) => {
  return (
    <div className="app__navigation">
      {navLinkItems.map((item, index) => (
        <a
          href={`#${item}`}
          key={item + index}
          className="app__navigation-dot"
          style={active === item ? { backgroundColor: "#313BAC" } : { }}
        >
          
        </a>
      ))}
    </div>
  );
};

export default NavigationDots;
