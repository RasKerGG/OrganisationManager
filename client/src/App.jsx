import { Routes, Route} from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent.jsx";
import BodyComponent from "./components/BodyComponent.jsx";
import CertificateComponent from "./components/CertificateComponent.jsx";
import SettingsComponent from "./components/SettingsComponent.jsx";
import NotFoundComponent from "./components/NotFoundComponent.jsx";

function App() {
  return (
    <>
        <NavbarComponent />
        <Routes>
            <Route path="/" element={<BodyComponent/>} />
            <Route path="/certificate" element={<CertificateComponent/>}/>
            <Route path="/settings" element={<SettingsComponent/>}/>
            <Route path="*" element={<NotFoundComponent/>}/>
        </Routes>

    </>
  )
}

export default App
