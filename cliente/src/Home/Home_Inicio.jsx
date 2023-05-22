// Importaciones de React
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importaciones de Material UI
import { orange } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';

// Importaciones de Componentes
import {Encabezado} from '../Componentes/Encabezado';

//Importaciones de Páginas
import { Inicio } from '../Paginas/Inicio/Inicio';
import { Admin } from '../Paginas/Admin/Admin';
import { Empresa } from '../Paginas/Empresa/Empresa';
import { Cliente } from '../Paginas/Cliente/Cliente';


const Home = () => {
    // Preferencia por el modo oscuro
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Tema personalizado con color principal naranja
    const theme = React.useMemo(() => createTheme({
        palette: {
            mode: !!prefersDarkMode ? 'dark' : 'light',
            primary: {
                main: orange[500]
            }
        }
    }));
        
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Encabezado/>
        <Router>
            <Routes>
                <Route exact path="/" element={<Inicio />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/client" element={<Cliente />} />
            
            </Routes>
        </Router>
    </ThemeProvider>);
}
export default Home;