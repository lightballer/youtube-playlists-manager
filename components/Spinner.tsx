type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-cyan-500 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
