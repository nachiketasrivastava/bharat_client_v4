import React from "react";

const UpperLine = ({ index }) => {
  return (
    <div
      style={{
        width: "2px",
        height:
          index === 2 ? "65px" : index === 4 ? "95px" : index === 5 ? "65px" : "35px",
        position: "absolute",
        top:
          index === 4
            ? "-5.3rem"
            : index === 2
            ? "-3.4rem"
            : index === 5
            ? "-3.5rem"
            : "-1.6rem",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "2px dotted #000",
      }}
    />
  );
};

export default UpperLine;
