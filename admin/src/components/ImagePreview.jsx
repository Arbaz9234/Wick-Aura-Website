import { useEffect } from "react";

export default function ImagePreview({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl leading-none hover:opacity-80"
      >
        &times;
      </button>
      <img
        src={src}
        alt="Preview"
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
