// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';



// Importaciones de Componentes
import {ClientePag} from './Componentes/ClientePag';
import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Cliente = () => {
  const [logoutError, setLogoutError] = useState();
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => { // Obtener User

    document.title = "OC.IO - CLIENTE";
    axios({
        ...axiosConfig,
        url: 'http://localhost:8000/user',
        method: 'GET'          
    })
    .then(res => {
      setUserData(res.data);
      setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'cliente');
      })
      .catch(err => console.log(err))
  }, []);

  const performLogout = (event) => {
    event.preventDefault();
    setLogoutError('');

    if(!!userData){
        axios({
          ...axiosConfig,
            url: 'http://localhost:8000/logout',
            method: 'POST'
            
        }).then((response) =>{
            if(response.data.status === 'Ok')
                navigate('/'); // Navega a la página de Inicio
            else
                setLogoutError(response.data.error);
        })
        .catch((error) => {
            console.log('Error en el cierre de sesión');
            setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
        })
    }
};
  
    return (
      !!finishLoading ?
      <div>
        <Paper>
          <Typography variant="h4" color="primary">CLIENTE</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          {!!logoutError && <Typography>{logoutError}</Typography>}

          <ClientePag />
        </Paper>
      </div>
      :
      <Snackbar
      open={!finishLoading}
      autoHideDuration={2000}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'admin' ? navigate('/admin') : navigate('/') : navigate('/')}>
      <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
    );
  };
  
  export default Cliente;