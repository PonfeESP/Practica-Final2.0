// Importaciones de React
import React, { useState } from 'react';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const Registro = () => {
  // Controlador de Usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [userType, setUserType] = useState('');
  //cliente
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDNI] = useState("");
  const [fechanacimiento, setFechaNac] = useState("");
  //empresa
  const [nombre_empresa, setNombreEmpresa] = useState("");
  const [cif, setCIF] = useState("");
  const [domicilio_social, setDomicilio] = useState("");
  const [capital_social, setCapital] = useState("");
  const [persona_responsable, setPersona] = useState("");


  // Controlador de Error en Usuario
  const [userError, setUserError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [telfError, setTelfError] = useState(false);
  const [userTypeError, setUserTypeError] = useState(false);
  //cliente
  const [nombreError, setNombreError] = useState(false);
  const [apellidosError, setApellidosError] = useState(false);
  const [dniError, setDNIError] = useState(false);
  const [f_nacError, setF_NACError] = useState(false);
  //empresa
  const [nEmpError, setnEmpError] = useState(false);
  const [cifError, setCIFError] = useState(false);
  const [domError, setDomError] = useState(false);
  const [capError, setCapError] = useState(false);
  const [persError, setPersError] = useState(false);

  const [registroError, setRegistroError] = useState("");
  const [registroError2, setRegistroError2] = useState("");

  // Controlador de Dialog
  const [open, setOpen] = useState(false);

  const performRegister = (event) => {
    event.preventDefault();
    //usuario
    setUserError(false);
    setEmailError(false);
    setPasswordError(false);
    setRegistroError('');
    setRegistroError2('');
    setTelfError(false);
    //empresa
    setCIFError(false);
    setCapError(false);
    setDomError(false);
    setnEmpError(false);
    setPersError(false);
    //cliente
    setDNIError(false);
    setApellidosError(false);
    setF_NACError(false);
    setNombreError(false);

    //usuario errores
    if (email === '') setUserError(true);
    if (password === '') setPasswordError(true);
    if (confirmPassword === '') setConfirmPasswordError(true);
    if (userType === '') setUserTypeError(true);
    if (telefono === '' || telefono.length < 9) setTelfError(true);
    //empresa errores
    if (cif === '' || cif.length < 9) setCIFError(true);
    if (capital_social === '') setCapError(true);
    if (domicilio_social === '') setDomError(true);
    if (nombre_empresa === '') setnEmpError(true);
    if (persona_responsable === '') setPersError(true);
    //cliente errores
    if (dni === '' || dni.length < 9) setDNIError(true);
    if (nombre === '') setNombreError(true);
    if (fechanacimiento === '' || fechanacimiento.length < 10) setF_NACError(true);
    if (apellidos === '') setApellidosError(true);

    if (!!email && !!password && !!confirmPassword && !!telefono && !!userType) {
      if (userType === 'empresa') {
        if (password !== confirmPassword) setRegistroError('Las contraseñas son distintas. Pruébelo de nuevo.');
        else {
          if (!!cif && !!capital_social && !!domicilio_social && !!nombre_empresa && !!persona_responsable) {
            axios({
              url: 'http://localhost:8000/registroempresa',
              method: 'POST',
              withCredentials: true,
              data: {
                email: email,
                password: password,
                cif: cif,
                capital_social: parseInt(capital_social),
                domicilio_social: domicilio_social,
                nombre_empresa: nombre_empresa,
                persona_responsable: persona_responsable,
                telefono: telefono
              },
            })
              .then((response) => {
                if (response.data.status === 'OK') {
                  setRegistroError('El usuario se ha registrado como Empresa Promotora.');
                } else {
                  setRegistroError('El usuario ya existe como Empresa Promotora.');
                }
              })
              .catch((error) => {
                console.log('Error en el registro:', error);
                setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
              });
          }
          else setRegistroError('Todos los campos son OBLIGATORIOS. Inténtelo de nuevo.');
        }
      } else {
        if (password !== confirmPassword) setRegistroError('Las contraseñas son distintas. Pruébelo de nuevo.');
        else {
          if (!!dni && !!nombre && !!fechanacimiento && !!apellidos) {
            axios({
              url: 'http://localhost:8000/registrocliente',
              method: 'POST',
              withCredentials: true,
              data: {
                email: email,
                password: password,
                dni: dni,
                nombre: nombre,
                apellidos: apellidos,
                fechanacimiento: fechanacimiento,
                telefono: telefono
              },
            })
              .then((response) => {
                if (response.data.status === 'OK') {
                  setRegistroError('El usuario se ha registrado como Cliente.');
                } else {
                  setRegistroError('El usuario ya existe como Cliente.');
                }
              })
              .catch((error) => {
                console.log('Error en el registro:', error);
                setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
              });
          }
          else setRegistroError('Todos los campos son OBLIGATORIOS. Inténtelo de nuevo.');
        }
      }
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

  // Controlador del Tipo de Usuario
  const handleUserType = (event) => {
    event.preventDefault();

    setUserType(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Registrarse</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registrarse</DialogTitle>
        <DialogContent>

          <DialogContentText>
            Por favor, complete el formulario de registro.
          </DialogContentText>

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
                <MenuItem value="empresa">Empresa Promotora</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>

              </Select>
            </FormControl>
          </Box>

          {userType === 'empresa' && <div>
            <TextField
              required
              onChange={(e) => setNombreEmpresa(e.target.value)}
              margin="dense"
              id="nombre_empresa"
              label="Nombre de la Empresa Promotora"
              fullWidth
              variant="standard"
              error={nEmpError}
              helperText={nEmpError && 'Indique el Nombre de la Empresa Promotora, por favor.'}
            />
            <TextField
              required
              onChange={(e) => setCIF(e.target.value)}
              margin="dense"
              id="cif"
              label="CIF de la Empresa"
              fullWidth
              variant="standard"
              inputProps={{ maxLength: 9 }}
              error={cifError}
              helperText={cifError && 'Indique el CIF de la Empresa Promotora, por favor.'}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                if (!allowedKeys.includes(e.key) && !/^[a-zA-Z0-9]+$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              required
              onChange={(e) => setDomicilio(e.target.value)}
              margin="dense"
              id="domicilio_social"
              label="Domicilio Social de la Empresa"
              fullWidth
              variant="standard"
              error={domError}
              helperText={domError && 'Indique el Domicilio Social de la Empresa Promotora, por favor.'}
            />
            <TextField
              required
              onChange={(e) => setCapital(e.target.value)}
              margin="dense"
              id="capital_social"
              label="Capital Social de la Empresa"
              fullWidth
              variant="standard"
              error={capError}
              helperText={capError && 'Indique el Capital Social de la Empresa Promotora, por favor.'}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                const isNumber = /^\d$/;
                if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                }
            }}
            />
            <TextField
              required
              onChange={(e) => setPersona(e.target.value)}
              margin="dense"
              id="persona_responsable"
              label="Responsable de la Empresa"
              fullWidth
              variant="standard"
              error={persError}
              helperText={persError && 'Indique el Nombre del Responsable de la Empresa Promotora, por favor.'}
            />
          </div>
          }

          {userType === 'cliente' && <div>
            <TextField
              required
              onChange={(e) => setNombre(e.target.value)}
              margin="dense"
              id="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              error={nombreError}
              helperText={nombreError && 'Indique su Nombre, por favor.'}
            />
            <TextField
              required
              onChange={(e) => setApellidos(e.target.value)}
              margin="dense"
              id="apellidos"
              label="Apellidos"
              fullWidth
              variant="standard"
              error={apellidosError}
              helperText={apellidosError && 'Indique al menos un Apellido, por favor.'}
            />
            <TextField
              required
              onChange={(e) => setDNI(e.target.value)}
              margin="dense"
              id="dni"
              label="DNI"
              fullWidth
              variant="standard"
              inputProps={{ maxLength: 9 }}
              error={dniError}
              helperText={dniError && 'Indique su DNI, por favor.'}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                if (!allowedKeys.includes(e.key) && !/^[a-zA-Z0-9]+$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              required
              onChange={(e) => setFechaNac(e.target.value)}
              margin="dense"
              id="fechanacimiento"
              label="Fecha de Nacimiento (YYYY-MM-DD)"
              fullWidth
              variant="standard"
              error={f_nacError}
              helperText={f_nacError && 'Indique su Fecha de Nacimiento, por favor.'}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                const isNumber = /^\d$/;
                const isSlash = /^[-]$/;
                if (!isNumber.test(e.key) && !isSlash.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            DEBE SER MAYOR DE 18 AÑOS
          </div>
          }

          <TextField
            required
            onChange={(e) => setTelefono(e.target.value)}
            margin="dense"
            id="telefono"
            label="Número de Teléfono del interesado"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 9 }}
            error={telfError}
            helperText={telfError && 'Por favor, ingrese un Número de Teléfono.'}
            onKeyDown={(e) => {
              // Permitir solo números y teclas especiales como retroceso y flechas
              const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
              const isNumber = /^\d$/;
              if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <TextField
            required
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
            id="email"
            label="Correo"
            fullWidth
            variant="standard"
            error={userError}
            helperText={userError && 'Por favor, ingrese un correo válido.'}
            error2={emailError}
            helperText2={emailError && 'Este email ya existe.'}
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
            error={passwordError}
            helperText={passwordError && 'Por favor, ingrese una contraseña.'}
          />
          <TextField
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
            id="confirm-password"
            label="Confirmar Contraseña"
            type="password"
            fullWidth
            variant="standard"
            error={confirmPasswordError}
            helperText={confirmPasswordError && 'Por favor, confirme su contraseña.'}
          />
          {registroError && <h4>{registroError}</h4>}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCELAR</Button>
          <Button onClick={performRegister}>REGISTRARSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};