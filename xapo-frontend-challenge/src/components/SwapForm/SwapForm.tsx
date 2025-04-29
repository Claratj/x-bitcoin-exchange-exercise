import { useExchangeLogic } from "../../hooks/useExchangeLogic";

export const SwapForm = () => {
  const {
    isSuccess,

    resetFields,
    setIsSuccess,
  } = useExchangeLogic();

  if (isSuccess) {
    return (
      <div>
        <h2>Swap Confirmed!</h2>
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
