import React from "react";

const SubscribeButton = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className="group px-10 py-4 min-h-[56px] bg-black relative custom-bg-transition hover:bg-white
"
      //   className=" hover:bg-gray-800 transition"
    >
      <span className="text-white text-xs group-hover:text-black">
        {children}
      </span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#0b6bcb] transition-all duration-100 group-hover:w-full only-hover-transition" />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#0b6bcb] transition-all delay-100 duration-100 group-hover:h-full only-hover-transition" />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#0b6bcb] transition-all delay-200 duration-100 group-hover:w-full only-hover-transition" />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#0b6bcb] transition-all delay-300 duration-100 group-hover:h-full only-hover-transition" />
    </button>
  );
};

export default SubscribeButton;
