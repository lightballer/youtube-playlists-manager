import Link from "next/link";

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorDisplay({
  error,
  onRetry,
  showRetry = false,
}: ErrorDisplayProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Something went wrong
        </h2>

        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              Try again
            </button>
          )}
          <Link
            href="/"
            className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/8 hover:border-cyan-500/30 text-text-primary font-medium py-3 px-6 rounded-xl transition-all duration-300 inline-block"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
