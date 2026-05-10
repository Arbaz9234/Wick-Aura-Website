import * as React from "react";

export default function NewsletterInput({ value, onChange }) {
  const id = React.useId();

  return (
    <div className="relative w-full border border-black focus-within:border-[#0B6BCB]">
      <input
        id={id}
        type="email"
        value={value}
        onChange={onChange}
        placeholder=" "
        required
        className={[
          "peer w-full min-h-[56px] px-3 pt-5 pb-2",
          "bg-transparent outline-none border-none",
          "text-base font-normal",
          "placeholder-transparent",
        ].join(" ")}
      />
      <label
        htmlFor={id}
        className={[
          "absolute left-3 top-1/2 -translate-y-1/2",
          "text-[#555E68] font-medium text-base",
          "transition-all duration-150 ease-out pointer-events-none",
          "peer-focus:top-3 peer-focus:translate-y-[-0.3rem] peer-focus:text-xs peer-focus:text-[#0B6BCB]",
          "peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs",
        ].join(" ")}
      >
        Enter your email
      </label>
    </div>
  );
}
