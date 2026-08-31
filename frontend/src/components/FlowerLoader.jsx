import { assets } from "../assets/assets";

const FlowerLoader = ({ size = 140, duration = 1200 }) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${size}px`,
        aspectRatio: "717 / 1111",
        "--fill-duration": `${duration}ms`,
      }}
      role="status"
      aria-label="Loading"
    >
      {/* Circle */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            transform: "scale(0)",
            animation: `flower-loader-circle-scale 600ms var(--fill-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          }}
        >
          <div
            className="h-full w-full"
            style={{
              animation: `flower-loader-circle-rotate 1800ms calc(var(--fill-duration) + 600ms) linear infinite`,
            }}
          >
            <assets.Circle className="block h-full w-full" />
          </div>
        </div>
      </div>

      {/* Grey flower */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <assets.GrayFlower className="block h-full w-full" />
      </div>

      {/* Colored flower */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath: "inset(100% 0 0 0)",
          animation: `flower-loader-color-fill var(--fill-duration) cubic-bezier(0.65, 0, 1, 1) forwards`,
        }}
      >
        <assets.ColoredFlower className="block h-full w-full" />
      </div>
    </div>
  );
};

export default FlowerLoader;
