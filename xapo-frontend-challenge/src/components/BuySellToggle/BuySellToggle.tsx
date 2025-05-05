import "./BuySellToggle.css";

type Props = {
  mode: "buy" | "sell";
  onToggle: () => void;
};

export const BuySellToggle = ({ mode, onToggle }: Props) => {
  const isBuy = mode === "buy";

  return (
    <div
      className="toggle-container"
      role="region"
      aria-label="Exchange mode selection"
    >
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isBuy}
          onChange={onToggle}
          role="switch"
          aria-checked={isBuy}
          aria-label={`Exchange mode: ${mode}`}
        />
        <span className="slider" aria-hidden="true">
          <span className="toggle-pill" />
        </span>
      </label>
    </div>
  );
};
