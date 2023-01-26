import React from "react";

const navLinkItems = [
  "home",
  "about",
  "work",
  "skills",
  "testimonial",
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
          style={active === item ? { backgroundColor: "#EC3600" } : {}}
        >

        </a>
      ))}
    </div>
  );
};

export default NavigationDots;
