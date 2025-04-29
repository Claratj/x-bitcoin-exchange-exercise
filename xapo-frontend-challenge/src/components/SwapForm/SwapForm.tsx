import { BuySellToggle } from "../BuySellToggle/BuySellToggle";
import { ConfirmButton } from "../ConfirmButton/ConfirmButton";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput";
import { useExchangeLogic } from "../../hooks/useExchangeLogic";

export const SwapForm = () => {
  const {
    mode,
    exchangeRate,
    isLoading,
    btcAmount,
    usdAmount,
    isSuccess,
    toggleMode,
    handleBtcChange,
    handleUsdChange,
    confirmSwap,
    resetFields,
    setIsSuccess,
  } = useExchangeLogic();

  if (isSuccess) {
    return (
      <div>
        <h2>✅ Swap Confirmed!</h2>
        <button
          onClick={() => {
            setIsSuccess(false);
            resetFields();
          }}
        >
          Make another swap
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Bitcoin Exchange</h1>
      <p>Coming soon...</p>
    </div>
  );
};
