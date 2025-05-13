import {useEffect, useState} from "react";

export default function NavbarComponent() {
    const [theme, setTheme] = useState('light')

    const fetchTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme);
        document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    }

    useEffect(() => {
        fetchTheme();
    }, [theme]);

    return (
        <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
             style={{
                 backgroundColor: 'var(--navbar-bg)',
                 borderBottom: '1px solid var(--border-color)'
             }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#" style={{color: 'var(--text-color)'}}>
                    Навигация
                </a>
                <button className="navbar-toggler"
                        type="button"
                        style={{borderColor: 'var(--text-color)'}}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link"
                           href="/"
                           style={{color: 'var(--text-color)'}}>
                            Главная
                        </a>
                        <a className="nav-link"
                           href="/certificate"
                           style={{color: 'var(--text-color)'}}>
                            Отчет
                        </a>
                        <a className="nav-link"
                           href="/settings"
                           style={{color: 'var(--text-color)'}}>
                            Настройки
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}