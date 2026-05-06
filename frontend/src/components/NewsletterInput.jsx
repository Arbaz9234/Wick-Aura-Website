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
// import * as React from "react";
// import { styled } from "@mui/joy/styles";
// import Input from "@mui/joy/Input";

// const StyledInput = styled("input")({
//   border: "none",
//   minWidth: 0,
//   outline: 0,
//   padding: 0,
//   paddingTop: "1em",
//   flex: 1,
//   width: "100%",
//   minHeight: "var(--Input-minHeight)",
//   boxSizing: "border-box",
//   color: "inherit",
//   backgroundColor: "transparent",
//   fontFamily: "inherit",
//   fontSize: "inherit",
//   fontStyle: "inherit",
//   fontWeight: "inherit",
//   lineHeight: "inherit",
//   textOverflow: "ellipsis",
//   "&::placeholder": {
//     opacity: 0,
//     transition: "0.1s ease-out",
//   },
//   "&:focus::placeholder": {
//     opacity: 1,
//   },
//   "&:focus": {
//     boxShadow: "none",
//   },
//   "&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label":
//     {
//       top: "0.5rem",
//       fontSize: "0.75rem",
//     },
//   "&:focus ~ label": {
//     color: "var(--Input-focusedHighlight)",
//   },
//   "&:-webkit-autofill": {
//     alignSelf: "stretch",
//   },
//   "&:-webkit-autofill:not(* + &)": {
//     marginInlineStart: "calc(-1 * var(--Input-paddingInline))",
//     paddingInlineStart: "var(--Input-paddingInline)",
//     borderTopLeftRadius: 0,
//     borderBottomLeftRadius: 0,
//   },
// });

// const StyledLabel = styled("label")(({ theme }) => ({
//   position: "absolute",
//   lineHeight: 1,
//   top: "calc((var(--Input-minHeight) - 1em) / 2)",
//   color: theme.vars.palette.text.tertiary,
//   fontWeight: theme.vars.fontWeight.md,
//   transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
// }));

// const InnerInput = React.forwardRef(function InnerInput(props, ref) {
//   const id = React.useId();
//   return (
//     <>
//       <StyledInput {...props} ref={ref} id={id} />
//       <StyledLabel htmlFor={id}>Enter your email</StyledLabel>
//     </>
//   );
// });

// export default function NewsletterInput({ value, onChange }) {
//   return (
//     <Input
//       slots={{ input: InnerInput }}
//       slotProps={{
//         input: {
//           placeholder: "",
//           type: "email",
//           value: value,
//           onChange: onChange,
//         },
//       }}
//       sx={{
//         "--Input-minHeight": "56px",
//         "--Input-radius": "0px",
//         paddingRight: 0,
//         border: "1px solid black",
//         boxShadow: "none !important",
//         "&::before": {
//           boxShadow: "none !important",
//         },
//         "&:focus-within": {
//           borderColor: "var(--Input-focusedHighlight)", // Change this to your desired focus color
//         },
//       }}
//       required
//       className="w-full"
//     />
//   );
// }
