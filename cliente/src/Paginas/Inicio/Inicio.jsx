// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';

// Importación de Axios
import axios from 'axios';

// Importaciones de Componentes
import { Login } from '../../Componentes/Login';
import { Registro } from '../../Componentes/Registro';
import { axiosConfig } from '../../constant/axiosConfig.constant';


export const Inicio = () => {

  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);

  const navigate = useNavigate();

  
    useEffect(() => { // Obtener User

      document.title = "OC.IO - INICIO";
      axios({
        ...axiosConfig,
        url: 'http://localhost:8000/user',
        method: 'GET'          
        })
        .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType);        
        })
        .catch(err => console.log(err))
    }, []);

    return(
        !finishLoading ?
        <Paper>
            <Login/>
            <Registro/>
        </Paper>
        : <Snackbar
        open={!!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'cliente' ? navigate('/cliente') : navigate('/admin') : navigate('/admin')}>
        <Alert severity="error">Ya has iniciado sesión</Alert></Snackbar>
    );
};

/*

      axios({
          ...axiosConfig,
          url: 'http://localhost:8000/user',
          method: 'GET'          
      })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType);        
    })
        .catch(err => console.log(err))
*/