import { useTheme } from "./ThemeContext";

export default function SettingsComponent() {
    const { theme, updateTheme } = useTheme();

    const handleThemeChange = (event) => {
        updateTheme(event.target.value);
    };

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