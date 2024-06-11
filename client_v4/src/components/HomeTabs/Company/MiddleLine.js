import React from "react";

const MiddleLine = () => {
  return (
    <div
      style={{
        width: "140%",
        height: "2px",
        backgroundColor: "transparent",
        borderBottom: "2px dotted #000",
        position: "absolute",
        bottom: "-2.5rem",
        left: "50%",
      }}
    />
  );
};

export default MiddleLine;
