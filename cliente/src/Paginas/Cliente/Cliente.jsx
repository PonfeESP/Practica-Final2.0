// Importaciones de React
import React, { useEffect } from 'react';

// Importaciones de Material UI
import { Paper, Typography } from '@mui/material';

// Importaciones de Componentes
import {ClientePag} from './Componentes/ClientePag';

export const Cliente = () => {
    useEffect(() => {
      document.title = "CLIENTE";
    }, []);
  
    return (
      <div>
        <Paper>
          <Typography variant="h4" color="primary">CLIENTE</Typography>
          <ClientePag />
        </Paper>
      </div>
    );
  };
  
  export default Cliente;