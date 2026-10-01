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
  getCategorias, 
  createCategoria, 
  updateCategoria, 
  deleteCategoria 
} from '../service/farmaciaService';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [categoriaActual, setCategoriaActual] = useState({ id: null, nombre: '', descripcion: '' });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await getCategorias();
      const data = response.data || response;
      setCategorias(Array.isArray(data) ? data : data.categorias || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      mostrarAlerta('Error al obtener la lista de categorías', 'error');
    }
  };

  const mostrarAlerta = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleOpenModal = (cat = { id: null, nombre: '', descripcion: '' }) => {
    setCategoriaActual({
      id: cat.id || cat.id_categoria || null,
      nombre: cat.nombre || ''
    });
    setEditMode(!!(cat.id || cat.id_categoria));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCategoriaActual({ id: null, nombre: '', descripcion: '' });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setCategoriaActual({
      ...categoriaActual,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoriaActual.nombre.trim()) {
      mostrarAlerta('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    try {
      if (editMode) {
        await updateCategoria(categoriaActual.id, categoriaActual);
        mostrarAlerta('Categoría actualizada correctamente');
      } else {
        await createCategoria(categoriaActual);
        mostrarAlerta('Categoría creada correctamente');
      }
      handleCloseModal();
      cargarCategorias();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      mostrarAlerta('Error al guardar la categoría', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await deleteCategoria(id);
        mostrarAlerta('Categoría eliminada correctamente');
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        mostrarAlerta('Error al eliminar la categoría', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Gestión de Categorías
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Categoría
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay categorías registradas.
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((cat) => {
                const id = cat.id || cat.id_categoria;
                return (
                  <TableRow key={id} hover>
                    <TableCell>{id}</TableCell>
                    <TableCell>{cat.nombre}</TableCell>
                    <TableCell>{cat.descripcion || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenModal(cat)}>
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
            {editMode ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogContent display="flex" flexDirection="column" gap={2}>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre de Categoría"
              type="text"
              fullWidth
              variant="outlined"
              value={categoriaActual.nombre}
              onChange={handleChange}
              required
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