// Importaciones de React
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import {Box, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper} from '@mui/material';
import Button from '@mui/material/Button';

// Componente de Visualización de Empresas
export const Fila = fila => {
    

    const [verifError, setVerifError] = useState('');
    const [elimError, setElimError] = useState('');

    const navigate = useNavigate();

    const performVerif = (idEmp) => {
        //Verificar userData.userType
        setVerifError('');
        axios({
            url: 'http://localhost:8000/verificarempresa',
            method: 'PUT',
            withCredentials: true,
            data: {
              id: idEmp
            },
        })
        .then((response) => {
            if (response.data.status === 'OK') {
                setVerifError('Empresa Verificada con EXITO');
                navigate('/admin');
            } else {
            setVerifError(response.data.error);
            }
        })
        .catch((error) => {
            console.log('Error en la verificación:', error);
            setVerifError('Error en la verificación. Inténtalo de nuevo, por favor.');
        });
    }


    //NO FUNCIONA
    const performBajaEmpresa = (idEmp) => {
        //Verificar userData.userType
        axios({
            url: 'http://localhost:8000/eliminarempresa',
            method: 'DELETE',
            withCredentials: true,
            data: {
              id: idEmp
            },
        })
        .then((response) => {
            if (response.data.status === 'OK') {
                setElimError('Empresa Eliminada con EXITO');
                navigate('/admin');
            } else {
            setElimError(response.data.error);
            }
        })
        .catch((error) => {
            console.log('Error en la eliminación:', error);
            setElimError('Error en la eliminación. Inténtalo de nuevo, por favor.');
        });
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Typography>{fila.fila.nombre_empresa}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.cif}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.domicilio_social}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.capital_social}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.persona_responsable}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.email}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.telefono}</Typography>
                </TableCell>
                {fila.fila.verificada===false && <TableCell align="center"><Button onClick={() => performVerif(fila.fila.id)}>VERIFICAR</Button></TableCell>}
                <TableCell align="center"><Button onClick={() => performBajaEmpresa(fila.fila.id)}>ELIMINAR EMPRESA</Button></TableCell>
            </TableRow>
            {!!verifError && <Typography>{verifError}</Typography>}
            {!!elimError && <Typography>{elimError}</Typography>}
        </React.Fragment>
    );
}

export const AdminPag = () => {
    const [userData, setUserData] = useState();

    //Declaración Empresas
    const [empresas, setEmpresas] = useState([{
        id: null,
        nombre_empresa: null,
        email: null,
        password: null,
        cif: null,
        domicilio_social: null,
        telefono: null,
        persona_responsable:null,
        capital_social: null,
        verificada: null
    }]);

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

    useEffect(() => {
        axios({
            url: 'http://localhost:8000/mostrarempresas',
            method: 'GET',
        })
        .then(res => {
            setEmpresas(res.data);
        })
        .catch(err => console.log(err))
    }, []);

    const performLogout = (event) => {
    /*event.preventDefault();
    setLogoutError('');

    if(!!userData){
        axios({
            url: 'http://localhost:8000/logout',
            method: 'POST',
            //timeout: 5000,
            //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
        }).then((response) =>{
            if(response.data.status === 'Ok')
                //return redirect("/");
                navigate('/'); // Navega a la página de Inicio
            else
                setLogoutError(response.data.error);
        })
        .catch((error) => {
            console.log('Error en el cierre de sesión');
            setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
        })
    }*/
  };
    // PREGUNTAR INFO. DE USERDATA
    return (empresas.length > 0 && !!empresas[0].id && <div> 
        <Button onClick={performLogout}>ELIMINAR CUENTA</Button>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>EMPRESA</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>CIF</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>DOMICILIO</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>CAPITAL</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>RESPONSABLE</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>EMAIL</Typography></TableCell>
                        <TableCell><Typography sx={{fontWeight: 'bold'}}>TELÉFONO</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {empresas.map((empresa) => (
                        <Fila fila={empresa} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
        
      );
}

export default AdminPag;