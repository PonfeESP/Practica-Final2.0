// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';

// Importaciones de Componentes
import { AdminPag } from './Componentes/AdminPag';
import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Admin = () => {
  const [userData, setUserData] = useState();
  const [logoutError, setLogoutError] = useState();

  const navigate = useNavigate();

    useEffect(() => {
      document.title = "ADMIN";
    }, []);
  
    useEffect(() => { // Obtener User
      axios({
          ...axiosConfig,
          url: 'http://localhost:8000/user',
          method: 'GET'          
      })
      .then(res => {
        setUserData(res.data);
        if(userData==='Sesión no iniciada!')
          navigate('/');
        else{
          if(!!userData.userType){
            if(userData.userType!=='admin'){
              if(userData.userType === 'cliente')
                navigate('/cliente');
              else{
                if(userData.userType === 'empresa')
                  navigate('/empresa');
                else
                  navigate('/');
              }
            }
          }
          else{
            navigate('/');
          }
        }
          
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
      <div>
        <Paper>
          <Typography variant="h4" color="primary">ADMINISTRADOR</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          <Typography>{!!userData && userData.id}</Typography>
          <Typography>{!!userData && userData.userType}</Typography>
          <AdminPag />
        </Paper>
      </div>
    );
  };
  
  export default Admin;