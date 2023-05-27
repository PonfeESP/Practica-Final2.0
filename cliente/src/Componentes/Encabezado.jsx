// Importaciones de React
import {React, useState, useEffect} from 'react';

// Importación de Axios
import axios from 'axios';

// Importación de Material UI/Icons UI
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';

export const Encabezado = () => {
    // Control del Navegador (Tamaños)
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    // Control de Usuario
    const [userData, setUserData] = useState();
  

  

  // Nombres de página - REVISAR
  const pags = !!userData ? [{
    type: userData.userType,
    title: userData.userType,
    path: '/'+userData.userType
  }] : [{
    title: 'Inicio',
    path: '/'
  },{
    title: 'Iniciar sesión',
  }, {
    title: 'Registrarse'
  }]

  // Evento Cerrar Sesión
  /*

  // Evento Eliminar Cuenta
  const performDelete = (event) => {
    event.preventDefault();
    setBorrarCuentaError('');

    if(!!userData){
      if(userData.userType === 'cliente'){
        axios({
            url: 'http://localhost:8000/eliminarcliente',
            method: 'DELETE',
            //timeout: 5000,
            //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
            data:{
                email: userData.email// REVISAR
            }
        }).then((response) =>{
            if(response.data.status === 'OK')
              //return redirect("/");
                navigate('/'); // Navega a la página de Inicio
            else
                setBorrarCuentaError(response.data.error);
        })
        .catch((error) => {
            console.log('Error en el cierre de sesión');
            setBorrarCuentaError('Error en el Cierre de Sesión. Inténtelo más tarde.');
        })
    }
    if(userData.userType === 'empresa'){
        axios({
            url: 'http://localhost:8000/eliminarempresa',
            method: 'DELETE',
            //timeout: 5000,
            //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
            data:{
                email: userData.email
            }
        }).then((response) =>{
            if(response.data.status === 'OK')
              //return redirect("/");
                navigate('/'); // Navega a la página de Inicio
            else
                setBorrarCuentaError(response.data.error);
        })
        .catch((error) => {
            console.log('Error en el cierre de sesión');
            setBorrarCuentaError('Error en el Cierre de Sesión. Inténtelo más tarde.');
        })
      }
    }
  };*/

  // Opción Cerrar Sesión
  const ajustes = !!userData ? ['Cerrar sesión'] : [];

  // Responsive
  const handleOpenNavMenu = event => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = event => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OC.IO
          </Typography>


          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OC.IO
          </Typography>
          
        </Toolbar>
        
      </Container>
    </AppBar>
  );
}