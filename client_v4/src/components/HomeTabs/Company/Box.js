import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { flashAtom } from "../../../store";

const Box = ({ label, value, index }) => {
  const [flash, setFlash] = useRecoilState(flashAtom);
  useEffect(() => setFlash(false), []);
  useEffect(() => {
    let timeout;
    if (flash) {
      timeout = setTimeout(() => {
        setFlash(false);
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [flash]);
  return (
    <div
      style={{
        width: "60px",
        height:
          index === 0 || 8 - index === 0
            ? "200px"
            : index === 1 || 8 - index === 1
            ? "170px"
            : index === 2 || 8 - index === 2
            ? "140px"
            : index === 3 || 8 - index === 3
            ? "110px"
            : "80px",
        backgroundColor: flash ? "#609DA1" : "#E07E65",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top:
            index === 0 || 8 - index === 0
              ? "-10rem"
              : index === 1 || 8 - index === 1
              ? "-10.95rem"
              : index === 2 || 8 - index === 2
              ? "-11.9rem"
              : index === 3 || 8 - index === 3
              ? "-12.8rem"
              : "-13.7rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2px",
        }}
      >
        {label?.split(" ")?.map((lab) => (
          <div>{lab}</div>
        ))}
      </div>
      <div style={{ color: "white" }}>{value}</div>
    </div>
  );
};

export default Box;
