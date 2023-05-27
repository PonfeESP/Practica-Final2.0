// Importaciones de React
import * as React from 'react';
import { useState, useEffect } from 'react';


// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

// Importación de Componente
import { Fila } from './FilaComponente';

// Importación de Constantes
import { axiosConfig } from '../../../constant/axiosConfig.constant.js';
export const EmpresaPag = () => {
    
    //Declaración Empresas
    const [eventos, setEventos] = useState([{
        id: null,
        nombre: null,
        artista: null,
        ubicacion: null,
        aforo: null,
        descripcion: null,
        fecha: null,
        hora: null,
        precio_entrada: null,
        empresa_promotora_id: null,
        aforo_ocupado: null,
        cancelada: null
    }]);


    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/mostrareventos/empresa',
            method: 'GET'
            
        })
        .then(res => {
            setEventos(res.data);
        })
        .catch(err => console.log(err))
    }, []);


    return(eventos.length > 0 && !!eventos[0].id ? <div> 
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>NOMBRE EVENTO</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>ARTISTA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>UBICACIÓN</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>AFORO</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>DESCRIPCIÓN</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>FECHA Y HORA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>PRECIO/ENTRADA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>AFORO OCUPADO</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eventos.map((evento) => (
                        evento.aforo !== evento.aforo_ocupado && evento.cancelada === false && (
                            <Fila
                                evento={evento}
                            />
                        )
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div> : <Typography sx={{ fontWeight: 'bold' }}>NO TIENES NINGÚN EVENTO. CREA UNO!</Typography>
    );
}

export default EmpresaPag;