import React from "react";

export default function Title(props) {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <h2>
        {props.text1}{" "}
        <span className="text-gray-700 font-medium">{props.text2}</span>
      </h2>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  );
}
