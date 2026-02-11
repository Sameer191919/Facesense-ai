export default function AnimatedButton({
  children,
  onClick,
  className = "",
  type = "button"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-purple-600
        transition-all duration-300
        hover:scale-105
        active:scale-95
        hover:shadow-lg hover:shadow-indigo-500/40
        before:absolute before:inset-0
        before:bg-white/10 before:opacity-0
        hover:before:opacity-100
        before:transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}
