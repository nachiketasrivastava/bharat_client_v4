import React from "react";

const ConversionUpperRate = ({ rate, type, index }) => {
  return (
    <div
      style={{
        width: "60px",
        height: "20px",
        backgroundColor: "rgba(209, 213, 219, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
        position: "absolute",
        top: (type === "rate" || (type === "▵t" && index !== 2)) ? "-5rem" : "-7rem",
        left: (index === 2 || index === 5) ? "190%" : index === 4 ? "120%" : "125%",
        transform: "translateX(-50%)",
      }}
    >
      {`${rate}${type === "rate" ? "%" : ""}`}
    </div>
  );
};

export default ConversionUpperRate;
