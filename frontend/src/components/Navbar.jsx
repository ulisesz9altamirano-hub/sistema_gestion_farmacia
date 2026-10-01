import React from 'react';
import {AppBar, Toolbar, Typography, Button, Container} from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

const Navbar = ({currentTab, setCurrentTab}) => {
    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <LocalPharmacyIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sistema Farmacia
                    </Typography>
                    <Button
                        color={currentTab === 'categorias' ? 'secondary' : 'inherit'}
                        variant={currentTab === 'categorias' ? 'contained' : 'text'}
                        onClick={() => setCurrentTab('categorias')}
                    >
                        Categorías
                    </Button>
                    <Button
                        color={currentTab === 'medicamentos' ? 'secondary' : 'inherit'}
                        variant={currentTab === 'medicamentos' ? 'contained' : 'text'}
                        onClick={() => setCurrentTab('medicamentos')}
                    >
                        Medicamentos
                    </Button>
                    <Button
                        color={currentTab === 'empleados' ? 'secondary' : 'inherit'}
                        variant={currentTab === 'empleados' ? 'contained' : 'text'}
                        onClick={() => setCurrentTab('empleados')}
                    >
                        Empleados
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;