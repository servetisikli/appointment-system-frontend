import { AppointmentProvider } from "./context/AppointmentContext";
import Home from "./pages/Home";
// Import other components as needed

function App() {
  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-100">
        <Home />
      </div>
    </AppointmentProvider>
  );
}

export default App;
