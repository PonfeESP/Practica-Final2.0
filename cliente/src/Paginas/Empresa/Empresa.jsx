// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// Importaciones de Componentes
import {EmpresaPag} from './Componentes/EmpresaPag';

// Importación de Constantes
import { axiosConfig } from '../../constant/axiosConfig.constant.js';

export const Empresa = () => {
  const [userData, setUserData] = useState();
  const [logoutError, setLogoutError] = useState();
  const [finishLoading, setFinishLoading] = useState(null);


  const [nombre, setNombre] = useState();
  const [artista, setArtista] = useState();
  const [ubicacion, setUbicacion] = useState();
  const [aforo, setAforo] = useState();
  const [descripcion, setDesc] = useState();
  const [fecha, setFecha] = useState();
  const [hora, setHora] = useState();
  const [precio_entrada, setPrecio] = useState();

  const [nombreError, setNombError] = useState(false);
  const [artistaError, setArtistaError] = useState(false);
  const [ubicacionError, setUbiError] = useState(false);
  const [aforoError, setAforoError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [horaError, setHoraError] = useState(false);
  const [precioError, setPrecioError] = useState(false);

  const [eventoError, setEventError] = useState('');

  const [open, setOpen] = useState(false);

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
      setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'empresa');
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

    const crearEvento = (event) => {
        event.preventDefault();
        
        setAforoError(false);
        setPrecioError(false);
        setArtistaError(false);
        setDescError(false);
        setFechaError(false);
        setHoraError(false);
        setNombError(false);
        setUbiError(false);

        if(aforo === '' || !parseInt(aforo) || parseInt(aforo)<1) setAforoError(true);
        if(precio_entrada === '' || !Number(precio_entrada) || Number(precio_entrada)<0) setPrecioError(true);
        if(artista === '') setArtistaError(true);
        if(descripcion === '') setDescError(true);
        if(fecha === '') setFechaError(true);
        if(hora === '') setHoraError(true);
        if(nombre === '') setNombError(true);
        if(ubicacion === '') setUbiError(true);

        if(aforoError===false && precioError===false && artistaError===false && descError===false && fechaError===false && horaError===false && nombreError===false && ubicacionError===false){
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/registroeventos',
                method: 'POST',
                data: {
                  nombre: nombre,
                  artista: artista,
                  ubicacion: ubicacion,
                  aforo: parseInt(aforo),
                  descripcion: descripcion,
                  fecha: fecha,
                  hora: hora,
                  precio_entrada: Number(precio_entrada),
                  empresa_promotora_id: userData.id
                },
              })
              .then((response) => {
                  if (response.data.status === 'OK') {
                      setEventError('El Evento ha sido creado con Éxito.');
                  } else {
                      setEventError(response.data.status);
                  }
              })
              .catch((error) => {
                  console.log('Error en la creación del evento:', error);
                  setEventError('Error en la creación del Evento.');
              });
        }
        
    };

    // Abrir Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };


    //AÑADIR VERIFICADA O NO
    return (!!finishLoading ?
      <div>
        <Paper>
          <Typography variant="h4" color="primary">EMPRESA PROMOTORA</Typography>
          <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
          <Typography>{!!userData && userData.id}</Typography>
          <Typography>{!!userData && userData.userType}</Typography>
          {!!logoutError && <Typography>{logoutError}</Typography>}
          
          <Button onClick={handleClickOpen}>CREAR EVENTO</Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>CREAR EVENTO</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Por favor, complete el siguiente formulario para crear un evento a su nombre.
            </DialogContentText>
            <TextField
                required
                onChange={(e) => setNombre(e.target.value)}
                margin="dense"
                id="nombre"
                label="Nombre del Evento"
                fullWidth
                variant="standard"
                error={nombreError}
                helperText={nombreError && 'Indique el Nombre del Evento'}
            />
            <TextField
                required
                onChange={(e) => setArtista(e.target.value)}
                margin="dense"
                id="artista"
                label="Artista Principal del Evento"
                fullWidth
                variant="standard"
                error={artistaError}
                helperText={artistaError && 'Indique el Artista que participará'}
            />
            <TextField
                required
                onChange={(e) => setUbicacion(e.target.value)}
                margin="dense"
                id="ubicacion"
                label="Ubicación que tendrá lugar el Evento"
                fullWidth
                variant="standard"
                error={ubicacionError}
                helperText={ubicacionError && 'Indique el lugar que tendrá el Evento'}
            />
            <TextField
                required
                onChange={(e) => setAforo(e.target.value)}
                margin="dense"
                id="aforo"
                label="Aforo del Evento"
                fullWidth
                variant="standard"
                error={aforoError}
                helperText={aforoError && 'Indique el Aforo Máximo del Evento'}
            />
            <TextField
                required
                onChange={(e) => setDesc(e.target.value)}
                margin="dense"
                id="descripcion"
                label="Detalles del Evento a crear"
                fullWidth
                variant="standard"
                error={descError}
                helperText={descError && 'Indique toda información relevante del Evento'}
            />
            <TextField
                required
                onChange={(e) => setFecha(e.target.value)}
                margin="dense"
                id="fecha"
                label="Fecha en la que se realizará el Evento (YYYY-MM-DD)"
                fullWidth
                variant="standard"
                error={fechaError}
                helperText={fechaError && 'Indique la Fecha del Evento'}
            />
            <TextField
                required
                onChange={(e) => setHora(e.target.value)}
                margin="dense"
                id="hora"
                label="Hora en la que se realizará el Evento (HH:MM)"
                fullWidth
                variant="standard"
                error={horaError}
                helperText={horaError && 'Indique una Hora del Evento Válido'}
            />
            <TextField
                required
                onChange={(e) => setPrecio(e.target.value)}
                margin="dense"
                id="precio"
                label="Precio de las Entradas"
                fullWidth
                variant="standard"
                error={precioError}
                helperText={precioError && 'Indique un Precio Válido de las Entradas/Persona'}
            />
            {eventoError && <p>{eventoError}</p>}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>CANCELAR</Button>
            <Button onClick={crearEvento}>CREAR EVENTO</Button>
            </DialogActions>
          </Dialog>
            
          <EmpresaPag />
        </Paper>
      </div> :
      <Snackbar
      open={!finishLoading}
      autoHideDuration={2000}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      onClose={() => !!userData ? userData.userType === 'admin' ? navigate('/admin') : userData.userType === 'cliente' ? navigate('/cliente') : navigate('/') : navigate('/')}>
      <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
    );
  };
  
  export default Empresa;