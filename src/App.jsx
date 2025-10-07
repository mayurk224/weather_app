import Home from "./pages/Home";
import { SpeedDialProvider } from "./components/SpeedDialContext";

const App = () => {
  return (
    <SpeedDialProvider>
      <div>
        <Home />
      </div>
    </SpeedDialProvider>
  );
};

export default App;
