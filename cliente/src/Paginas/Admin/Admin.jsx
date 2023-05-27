// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
// Importaciones de Componentes
import { AdminPag } from './Componentes/AdminPag';
import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Admin = () => {
  const [logoutError, setLogoutError] = useState();
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);

  const navigate = useNavigate();

  
    useEffect(() => { // Obtener User

      document.title = "OC.IO - ADMIN";
      axios({
          ...axiosConfig,
          url: 'http://localhost:8000/user',
          method: 'GET'          
      })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'admin');
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
          <Typography variant="h4" color="primary">ADMINISTRADOR</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          <Typography>{!!userData && userData.id}</Typography>
          <Typography>{!!userData && userData.userType}</Typography>
          <AdminPag />
        </Paper>
      </div> :       <Snackbar
      open={!finishLoading}
      autoHideDuration={1000}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'cliente' ? navigate('/cliente') : navigate('/') : navigate('/')}
    ><Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
    );
  };
  
  export default Admin;