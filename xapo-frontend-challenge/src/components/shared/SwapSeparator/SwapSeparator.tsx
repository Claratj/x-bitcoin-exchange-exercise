import "./SwapSeparator.css";

interface SwapSeparatorProps {
  onClick?: () => void;
}

export function SwapSeparator({ onClick }: SwapSeparatorProps) {
  return (
    <button
      type="button"
      className="swap-separator"
      onClick={onClick}
      aria-label="Swap input order"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="swap-arrows"
      >
        <path
          d="M4 2.66667L1.33333 5.33333L4 8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13.3333L14.6667 10.6667L12 8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1.33333 5.33333H14.6667" strokeLinecap="round" />
        <path d="M1.33333 10.6667H14.6667" strokeLinecap="round" />
      </svg>
    </button>
  );
}
