export default function LoadingDots({ size = 4, className = "" }) {
  return (
    <span
      className={`loading-dots ${className}`}
      style={{ "--dot-size": `${size}px` }}
      aria-label="Loading"
    >
      <span />
      <span />
      <span />
    </span>
  );
}
