import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, Box, Alert, Snackbar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
  getEmpleados, 
  createEmpleado, 
  updateEmpleado, 
  deleteEmpleado 
} from '../service/farmaciaService';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const initialState = { 
    id: null, 
    nombre: '', 
    apellido: '', 
    dni: '', 
    email: '', 
    cargo: '' 
  };

  const [empleadoActual, setEmpleadoActual] = useState(initialState);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await getEmpleados();
      const data = response.data || response;
      setEmpleados(Array.isArray(data) ? data : data.empleados || []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      mostrarAlerta('Error al obtener la lista de empleados', 'error');
    }
  };

  const mostrarAlerta = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleOpenModal = (emp = initialState) => {
    setEmpleadoActual({
      id: emp.id || emp.id_empleado || null,
      nombre: emp.nombre || '',
      apellido: emp.apellido || '',
      dni: emp.dni || '',
      email: emp.email || '',
      cargo: emp.cargo || emp.puesto || ''
    });
    setEditMode(!!(emp.id || emp.id_empleado));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEmpleadoActual(initialState);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEmpleadoActual({
      ...empleadoActual,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!empleadoActual.nombre.trim() || !empleadoActual.apellido.trim() || !empleadoActual.dni.trim()) {
      mostrarAlerta('Nombre, apellido y DNI son obligatorios', 'error');
      return;
    }

    const payload = {
      nombre: empleadoActual.nombre.trim(),
      apellido: empleadoActual.apellido.trim(),
      dni: empleadoActual.dni.trim(),
      email: empleadoActual.email.trim() || null,
      cargo: empleadoActual.cargo.trim() || null
    };

    try {
      if (editMode) {
        await updateEmpleado(empleadoActual.id, payload);
        mostrarAlerta('Empleado actualizado correctamente');
      } else {
        await createEmpleado(payload);
        mostrarAlerta('Empleado creado correctamente');
      }
      handleCloseModal();
      cargarEmpleados();
    } catch (error) {
      console.error('Error al guardar el empleado:', error.response?.data || error.message);
      mostrarAlerta(error.response?.data?.error || 'Error al guardar el empleado', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await deleteEmpleado(id);
        mostrarAlerta('Empleado eliminado correctamente');
        cargarEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        mostrarAlerta('Error al eliminar el empleado', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Gestión de Empleados
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Empleado
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DNI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay empleados registrados.
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((emp) => {
                const id = emp.id || emp.id_empleado;
                return (
                  <TableRow key={id} hover>
                    <TableCell>{id}</TableCell>
                    <TableCell>{emp.dni || '-'}</TableCell>
                    <TableCell>{emp.nombre}</TableCell>
                    <TableCell>{emp.apellido}</TableCell>
                    <TableCell>{emp.email || '-'}</TableCell>
                    <TableCell>{emp.cargo || emp.puesto || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenModal(emp)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal / Dialog Crear y Editar */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <form onSubmit={handleSave}>
          <DialogTitle>
            {editMode ? 'Editar Empleado' : 'Nuevo Empleado'}
          </DialogTitle>
          <DialogContent display="flex" flexDirection="column" gap={2}>
            <TextField
              autoFocus
              margin="dense"
              name="dni"
              label="DNI"
              type="text"
              fullWidth
              variant="outlined"
              value={empleadoActual.dni}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              variant="outlined"
              value={empleadoActual.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="apellido"
              label="Apellido"
              type="text"
              fullWidth
              variant="outlined"
              value={empleadoActual.apellido}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={empleadoActual.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="cargo"
              label="Cargo"
              type="text"
              fullWidth
              variant="outlined"
              value={empleadoActual.cargo}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Notificaciones Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}