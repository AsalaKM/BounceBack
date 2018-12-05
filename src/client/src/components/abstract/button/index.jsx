import React from "react";
import "./index.css";
export default function index(props) {
  const { value, color, onClick, display } = props;
  return (
    <>
      <button className="button" style={{ background: color, display: display }} onClick={onClick}>
        {value}
      </button>
    </>
  );
}
