// Importaciones de React
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import {Box, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper} from '@mui/material';
import Button from '@mui/material/Button';
import { Fila } from './FilaComponent';

export const AdminPag = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState();
    const [logoutError, setLogoutError] = useState();

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
                //return redirect("/");
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
    // PREGUNTAR INFO. DE USERDATA
    return (empresas.length > 0 && !!empresas[0].id && <div> 
        <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
        <Typography>{!!userData && userData.id}</Typography>
        <Typography>{!!userData && userData.userType}</Typography>

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