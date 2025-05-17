import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavbarComponent() {
    const [theme, setTheme] = useState('light');
    const muiTheme = useTheme();

    const fetchTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme);
        document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    };

    useEffect(() => {
        fetchTheme();
    }, [theme]);


    const navItems = [
        { name: 'Главная', path: '/' },
        { name: 'Отчет', path: '/certificate' },
        { name: 'Настройки', path: '/settings' }
    ];

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'var(--navbar-bg)',
                borderBottom: '1px solid var(--border-color)',
                boxShadow: 'none'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    component="a"
                    href="#"
                    sx={{
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        mr: 2
                    }}
                >
                    Навигация
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            href={item.path}
                            sx={{
                                color: 'var(--text-color)',
                                textTransform: 'none',
                                mx: 1,
                                fontSize: '16px'
                            }}
                            variant="text"
                        >
                            {item.name}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}