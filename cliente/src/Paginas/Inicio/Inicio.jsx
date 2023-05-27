// Importaciones de React
import {useEffect} from 'react';
import * as React from 'react';

// Importaciones de Material UI
import {Paper} from '@mui/material';


// Importaciones de Componentes
import { Login } from '../../Componentes/Login';
import { Registro } from '../../Componentes/Registro';

export const Inicio = () => {
    useEffect(() => {
        document.title = "Iniciar Sesión - OC.IO";
    }, []);

    return(
        <Paper>
            <Login/>
            <Registro/>
        </Paper>
    );
};
