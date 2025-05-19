import { Routes, Route} from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent.jsx";
import BodyComponent from "./components/BodyComponent.jsx";
import CertificateComponent from "./components/CertificateComponent.jsx";
import SettingsComponent from "./components/SettingsComponent.jsx";
import NotFoundComponent from "./components/NotFoundComponent.jsx";
import { ThemeProvider } from "./components/ThemeContext";
function App() {
  return (
    <>
        <ThemeProvider>
        <NavbarComponent />
        <Routes>
            <Route path="/" element={<BodyComponent/>} />
            <Route path="/certificate" element={<CertificateComponent/>}/>
            <Route path="/settings" element={<SettingsComponent/>}/>
            <Route path="*" element={<NotFoundComponent/>}/>
        </Routes>
        </ThemeProvider>
    </>
  )
}

export default App
