import * as React from "react";
import { styled } from "@mui/joy/styles";
import Input from "@mui/joy/Input";

const StyledInput = styled("input")({
  border: "none",
  minWidth: 0,
  outline: 0,
  padding: 0,
  paddingTop: "1em",
  flex: 1,
  width: "100%",
  minHeight: "var(--Input-minHeight)",
  boxSizing: "border-box",
  color: "inherit",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
  textOverflow: "ellipsis",
  "&::placeholder": {
    opacity: 0,
    transition: "0.1s ease-out",
  },
  "&:focus::placeholder": {
    opacity: 1,
  },
  "&:focus": {
    boxShadow: "none",
  },
  "&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label":
    {
      top: "0.5rem",
      fontSize: "0.75rem",
    },
  "&:focus ~ label": {
    color: "var(--Input-focusedHighlight)",
  },
  "&:-webkit-autofill": {
    alignSelf: "stretch",
  },
  "&:-webkit-autofill:not(* + &)": {
    marginInlineStart: "calc(-1 * var(--Input-paddingInline))",
    paddingInlineStart: "var(--Input-paddingInline)",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

const StyledLabel = styled("label")(({ theme }) => ({
  position: "absolute",
  lineHeight: 1,
  top: "calc((var(--Input-minHeight) - 1em) / 2)",
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
}));

const InnerInput = React.forwardRef(function InnerInput(props, ref) {
  const id = React.useId();
  return (
    <>
      <StyledInput {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Enter your email</StyledLabel>
    </>
  );
});

export default function NewsletterInput({ value, onChange }) {
  return (
    <Input
      slots={{ input: InnerInput }}
      slotProps={{
        input: {
          placeholder: "",
          type: "email",
          value: value,
          onChange: onChange,
        },
      }}
      sx={{
        "--Input-minHeight": "56px",
        "--Input-radius": "0px",
        paddingRight: 0,
        border: "1px solid black",
        boxShadow: "none !important",
        "&::before": {
          boxShadow: "none !important",
        },
        "&:focus-within": {
          borderColor: "var(--Input-focusedHighlight)", // Change this to your desired focus color
        },
      }}
      required
      className="w-full"
    />
  );
}
