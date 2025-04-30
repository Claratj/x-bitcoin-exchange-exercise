import { ExchangePage } from "./pages/ExchangePage/ExchangePage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Bitcoin Exchange</h1>
      </header>
      <main>
        <ExchangePage />
      </main>
    </div>
  );
}

export default App;
