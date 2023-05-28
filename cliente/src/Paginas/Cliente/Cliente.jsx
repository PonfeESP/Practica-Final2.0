// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// Importaciones de Componentes
import {ClientePag} from './Componentes/ClientePag';
import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Cliente = () => {
  const [logoutError, setLogoutError] = useState();
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);

  //Control de Dialogs
  const [click, setClick] = useState(false);

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

const eliminarCuenta = (idClient) => { //Eliminación de la cuenta actual
  if(!!userData){
    axios({
      ...axiosConfig,
        url: 'http://localhost:8000/eliminarcliente',
        method: 'DELETE',
        data: {id: idClient}
        
    }).then((response) =>{
        if(response.data.status === 'Ok')
            navigate('/'); // Navega a la página de Inicio
        else
            setLogoutError(response.data.error);
    })
    .catch((error) => {
        console.log('Error en la eliminación de cuenta');
        setLogoutError('Error en la eliminación de cuenta. Inténtelo más tarde.');
    })
  }
}

  // Abrir Dialog Eliminar
    const clickEliminar = () => {
        setClick(true);
    };

    // Cerrar Dialog Eliminar
    const eliminarClose = () => {
        setClick(false);
    };
  
    return (
      !!finishLoading ?
      <div>
        <Paper>
          <Typography variant="h4" color="primary">CLIENTE</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          {!!logoutError && <Typography>{logoutError}</Typography>}
          <Button onClick={clickEliminar}>ELIMINAR CUENTA</Button>
          <Dialog open={click} onClose={eliminarClose}>
            <DialogTitle>ELIMINAR CLIENTE</DialogTitle>
            <DialogContent>
            <DialogContentText>
                ¿De verdad desea eliminar su cuenta?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={eliminarClose}>CANCELAR</Button>
            <Button onClick={() => eliminarCuenta(userData.id)}>ELIMINAR CUENTA</Button>
            </DialogActions>
            </Dialog>

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