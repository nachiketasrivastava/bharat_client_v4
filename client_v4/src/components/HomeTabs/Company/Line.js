import React from "react";

const Line = ({ index }) => {
  return (
    <div
      style={{
        width: "2px",
        height:
          index === 8 ? "35px" : index >= 1 && index <= 4 ? "65px" : "50px",
        position: "absolute",
        bottom:
          index === 8
            ? "-1.5rem"
            : index >= 1 && index <= 4
            ? "-3.4rem"
            : "-2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "2px dotted #000",
      }}
    />
  );
};

export default Line;
