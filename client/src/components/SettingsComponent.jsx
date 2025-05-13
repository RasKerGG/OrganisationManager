import {useEffect, useState} from "react";

export default function SettingsComponent() {
    const [theme, setTheme] = useState("light");
    const [font, setFont] = useState();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme === "dark" ? "dark-theme" : "";
    }, []);

    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.body.className = newTheme === "dark" ? "dark-theme" : "";
    }

    return (
        <div className="settings-container">
            <h2>Настройки</h2>
            <div className="form-group">
                <label>Тема оформления:</label>
                <select
                    value={theme}
                    onChange={handleThemeChange}
                    className="theme-select"
                >
                    <option value="light">Светлая</option>
                    <option value="dark">Темная</option>
                </select>
            </div>
        </div>
    )
}