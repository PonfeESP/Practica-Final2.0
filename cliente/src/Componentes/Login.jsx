// Importaciones de React
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
//import { Typography } from '@mui/material'; COMPROBAR RECOGIDA DE TIPO DE USUARIO

// Importaciones de ICONS
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';


export const Login = () => {
    // Control de Inicio Sesión
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [userError, setUserError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userTypeError, setUserTypeError] = useState(false);
    const [registroError, setRegistroError] = useState('');

    // Control de Redirecciones
    const navigate = useNavigate();

    // Control del Dialog
    const [open, setOpen] = useState(false);

    const performLogin = (event) => {
        event.preventDefault();

        setUserError(false);
        setPasswordError(false);
        setRegistroError('');
    
        if (email === '') setUserError(true);
        if (password === '') setPasswordError(true);
        if (userType === '') setUserTypeError(true);
    
        if (!!email && !!password && !!userType) {
          if(userType==='admin'){
            axios({
                url: 'http://localhost:8000/loginAdmin',
                method: 'POST',
                withCredentials: true,
                data: {
                  email,
                  password,
                },
            })
            .then((response) => {
                if (response.data.status === 'OK') {
                navigate('/admin');
                } else {
                setRegistroError('El usuario introducido no se encuentra registrado como Administrador.');
                }
            })
            .catch((error) => {
                console.log('Error en el inicio de sesión:', error);
                setRegistroError('Error en el inicio de sesión. Inténtalo de nuevo, por favor.');
            });
          }
          else{
            if(userType==='empresa'){
                axios({
                    url: 'http://localhost:8000/loginEmpresa',
                    method: 'POST',
                    withCredentials: true,
                    data: {
                      email: email,
                      password: password
                    },
                })
                .then((response) => {
                    if (response.data.status === 'OK') {
                    navigate('/empresa'); 
                    } else {
                    setRegistroError('El usuario introducido no se encuentra registrado como Empresa Promotora.');
                    }
                })
                .catch((error) => {
                    console.log('Error en el inicio de sesión:', error);
                    setRegistroError('Error en el inicio de sesión. Inténtalo de nuevo, por favor.');
                });
            }
            else{
                axios({
                    url: 'http://localhost:8000/loginCliente',
                    method: 'POST',
                    withCredentials: true,
                    data: {
                      email: email,
                      password: password
                    },
                })
                .then((response) => {
                    if (response.data.status === 'OK') {
                    navigate('/cliente');
                    } else {
                    setRegistroError('El usuario introducido no se encuentra registrado como Cliente.');
                    }
                })
                .catch((error) => {
                    console.log('Error en el inicio de sesión:', error);
                    setRegistroError('Error en el inicio de sesión. Inténtalo de nuevo, por favor.');
                });
            }
          }
        }
        else{
            setRegistroError('Todos los campos son OBLIGATORIOS. Inténtalo de nuevo, por favor.');
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

    // Controlar Tipo de Usuario
    const handleUserType = (event) => {
        event.preventDefault();

        setUserType(event.target.value);
    };

    return(
        <div>
        <Button onClick={handleClickOpen}>Iniciar sesión</Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Iniciar sesión</DialogTitle>
            <DialogContent>
            <TextField
                required
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                id="email"
                label="Correo"
                type={"email"}
                fullWidth
                variant="standard"
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
            />
            <TextField
                required
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                id="password"
                label="Contraseña"
                type="password"
                fullWidth
                variant="standard"
            />
            <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="user-type">Usuario</InputLabel>
              <Select
                autoFocus
                value={userType}
                onChange={handleUserType}
                label="userType"
                inputProps={{
                  name: 'user-type',
                  id: 'user-type',
                }}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="empresa">Empresa Promotora</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
                
              </Select>
            </FormControl>
            </Box>
            

            {registroError && <p>{registroError}</p>}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>CANCELAR</Button>
            <Button onClick={performLogin}>INICIAR SESIÓN</Button>
            </DialogActions>
        </Dialog>
    </div>
    );
};