import { Button } from "@/components/ui/button"
import {Toaster} from "sonner"
import AppRoutes from "./routes/AppRoutes";
import {UserProvider} from "./context/AuthContext.jsx";
function App() {
  return (
    <UserProvider>
      <AppRoutes />
      <Toaster />
    </UserProvider>
  )
}

export default App;