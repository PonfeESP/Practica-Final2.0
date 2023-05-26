// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';


// Importaciones de Componentes
import {ClientePag} from './Componentes/ClientePag';

export const Cliente = () => {
  const [userData, setUserData] = useState();
  const [logoutError, setLogoutError] = useState();

  const navigate = useNavigate();

    useEffect(() => {
      document.title = "CLIENTE";
    }, []);

    useEffect(() => { // Obtener User
      axios({
          url: 'http://localhost:8000/user',
          method: 'GET',
          withCredentials: true,
          //timeout: 5000,
          //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
      })
      .then(res => {
        setUserData(res.data);
      })
      .catch(err => console.log(err))
  }, []);

  const performLogout = (event) => {
    event.preventDefault();
    setLogoutError('');

    if(!!userData){
        axios({
            url: 'http://localhost:8000/logout',
            method: 'POST',
            //timeout: 5000,
            //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
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
      <div>
        <Paper>
          <Typography variant="h4" color="primary">CLIENTE</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          <Typography>{!!userData && userData.id}</Typography>
          <Typography>{!!userData && userData.userType}</Typography>
          <ClientePag />
        </Paper>
      </div>
    );
  };
  
  export default Cliente;