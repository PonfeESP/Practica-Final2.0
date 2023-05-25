// Importaciones de React
import React, { useEffect } from 'react';

// Importaciones de Material UI
import { Paper, Typography } from '@mui/material';

// Importaciones de Componentes
import { AdminPag } from './Componentes/AdminPag';

export const Admin = () => {
    useEffect(() => {
      document.title = "ADMIN";
    }, []);
  
    return (
      <div>
        <Paper>
          <Typography variant="h4" color="primary">ADMINISTRADOR</Typography>
          <AdminPag />
        </Paper>
      </div>
    );
  };
  
  export default Admin;