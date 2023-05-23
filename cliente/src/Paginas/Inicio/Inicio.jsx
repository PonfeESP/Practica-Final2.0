// Importaciones de React
import {useEffect} from 'react';
import * as React from 'react';

// Importaciones de Material UI
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import {Paper, Typography, AppBar, Box, Toolbar, IconButton, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';

// Importaciones de Componentes
import { Login } from '../../Componentes/Login';
import { Registro } from '../../Componentes/Registro';

export const Inicio = () => {
    useEffect(() => {
        document.title = "Iniciar Sesión - OC.IO";
    }, []);

    return(
        <Paper>
            <Typography>Inicia sesión AHORA en OC.IO</Typography>
            <Login/>
            <Registro/>

        </Paper>
    );
};