// Importaciones de React
import * as React from 'react';
import { useState, useEffect } from 'react';


// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper} from '@mui/material';
import { Fila } from './FilaComponent';

// Importación de Constantes
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const AdminPag = () => {
    
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

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/mostrarempresas',
            method: 'GET'
        })
        .then(res => {
            setEmpresas(res.data);
        })
        .catch(err => console.log(err))
    }, []);
   

    // PREGUNTAR INFO. DE USERDATA
    return (empresas.length > 0 && !!empresas[0].id && <div> 

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