// Importaciones de React
import {React, useState, useEffect} from 'react';

// Importación de Axios
import axios from 'axios';

// Importación de Material UI/Icons UI
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export const Encabezado = () => {
    // Control del Navegador (Tamaños)
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    // Control de Usuario
    const [userData, setUserData] = useState();
    const [logoutError, setLogoutError] = useState();
    const [borrarCuentaError, setBorrarCuentaError] = useState();
    setLogoutError('');
    setBorrarCuentaError('');

    // Control de Redirecciones
    const navigate = useNavigate();
  
  useEffect(() => { // Obtener User
      axios({
          url: 'http://localhost:8080/user',
          method: 'GET',
          withCredentials: true,
      })
      .then(res => {
        setUserData(res.data);
      })
      .catch(err => console.log(err))
  }, []);

  

  // Nombres de página
  const pags = !!userData ? [{
    title: 'Admin',
    path: '/admin'
  }, {
    title: 'Empresa',
    path: '/empresa'
  }, {
    title: 'Cliente',
    path: '/client'
  }, {
    title: 'Inicio',
    path: '/'
  }] : [{
    title: 'Iniciar sesión',
  }, {
    title: 'Registrarse'
  }]

  const performLogout = (event) => {
    event.preventDefault();
    setLogoutError('');

    if(!!userData){
        axios({
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

  const performDelete = (event) => {
    event.preventDefault();
    setBorrarCuentaError('');

    if(!!userData){
        if(userData.userType === 'cliente'){
            axios({
                url: 'http://localhost:8000/eliminarcliente',
                method: 'DELETE',
                data:{
                    email: userData.userType
                }
            }).then((response) =>{
                if(response.data.status === 'OK')
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
                data:{
                    email: userData.userType
                }
            }).then((response) =>{
                if(response.data.status === 'OK')
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
  };

  const ajustes = !!userData ? ['Cerrar sesión'] : [];

  const noAdmin = (!!userData && userData.userType==='admin') ? [] : ['Eliminar cuenta'];

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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pags.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>


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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pags.map((page) => (
              <Button
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={page.path}
              >
                {page.title}
              </Button>
            ))}
          </Box>


          {!!userData && <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Ajustes">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {ajustes.map((setting) => (
                <MenuItem key={setting} onClick={performLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}

              {noAdmin.map((nA) => (
                <MenuItem key={nA} onClick={performDelete}>
                  <Typography textAlign="center">{nA}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>}
        </Toolbar>
        <Typography textAlign="center">{logoutError}</Typography>
      </Container>
    </AppBar>
  );
}