import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, Box, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
  getMedicamentos, 
  createMedicamento, 
  updateMedicamento, 
  deleteMedicamento,
  getCategorias 
} from '../service/farmaciaService';

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const initialState = {
    id: null,
    nombre: '',
    precio: '',
    stock: '',
    fecha_vencimiento: '',
    categoria_id: ''
  };

  const [medicamentoActual, setMedicamentoActual] = useState(initialState);

  useEffect(() => {
    cargarMedicamentos();
    cargarCategorias();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      const response = await getMedicamentos();
      const data = response.data || response;
      setMedicamentos(Array.isArray(data) ? data : data.medicamentos || []);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      mostrarAlerta('Error al obtener la lista de medicamentos', 'error');
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await getCategorias();
      const data = response.data || response;
      setCategorias(Array.isArray(data) ? data : data.categorias || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const mostrarAlerta = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleOpenModal = (med = initialState) => {
    setMedicamentoActual({
      id: med.id || med.id_medicamento || null,
      nombre: med.nombre || '',
      fecha_vencimiento: med.fecha_vencimiento || '',
      precio: med.precio || '',
      stock: med.stock || '',
      categoria_id: med.categoria_id || med.id_categoria || (med.categoria ? med.categoria.id : '')
    });
    setEditMode(!!(med.id || med.id_medicamento));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setMedicamentoActual(initialState);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setMedicamentoActual({
      ...medicamentoActual,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!medicamentoActual.nombre.trim() || !medicamentoActual.precio || !medicamentoActual.categoria_id) {
      mostrarAlerta('Nombre, precio y categoría son obligatorios', 'error');
      return;
    }

    const payload = {
      nombre: medicamentoActual.nombre.trim(),
      precio: parseFloat(medicamentoActual.precio),
      stock: parseInt(medicamentoActual.stock, 10) || 0,
      fecha_vencimiento: medicamentoActual.fecha_vencimiento || null,
      categoria_id: parseInt(medicamentoActual.categoria_id, 10)
    };

    try {
      if (editMode) {
        await updateMedicamento(medicamentoActual.id, payload);
        mostrarAlerta('Medicamento actualizado correctamente');
      } else {
        await createMedicamento(payload);
        mostrarAlerta('Medicamento creado correctamente');
      }
      handleCloseModal();
      cargarMedicamentos();
    } catch (error) {
      console.error('Error al guardar medicamento:', error.response?.data || error.message);
      mostrarAlerta(error.response?.data?.error || 'Error al guardar el medicamento', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      try {
        await deleteMedicamento(id);
        mostrarAlerta('Medicamento eliminado correctamente');
        cargarMedicamentos();
      } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        mostrarAlerta('Error al eliminar el medicamento', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Gestión de Medicamentos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Medicamento
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Vencimiento</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {medicamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay medicamentos registrados.
                </TableCell>
              </TableRow>
            ) : (
              medicamentos.map((med) => {
                const id = med.id || med.id_medicamento;
                const catNombre = med.categoria?.nombre || 
                  categorias.find(c => (c.id || c.id_categoria) === (med.categoria_id || med.id_categoria))?.nombre || '-';

                return (
                  <TableRow key={id} hover>
                    <TableCell>{id}</TableCell>
                    <TableCell>{med.nombre}</TableCell>
                    <TableCell>${med.precio}</TableCell>
                    <TableCell>{med.stock}</TableCell>
                    <TableCell>{catNombre}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenModal(med)}>
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

      
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <form onSubmit={handleSave}>
          <DialogTitle>
            {editMode ? 'Editar Medicamento' : 'Nuevo Medicamento'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre del Medicamento"
              type="text"
              fullWidth
              variant="outlined"
              value={medicamentoActual.nombre}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="fecha_vencimiento"
              label="Fecha de Vencimiento"
              type="date"
              fullWidth
              variant="outlined"
              value={medicamentoActual.fecha_vencimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              variant="outlined"
              value={medicamentoActual.precio}
              onChange={handleChange}
              required
            />

            <TextField
              margin="dense"
              name="stock"
              label="Stock / Cantidad"
              type="number"
              fullWidth
              variant="outlined"
              value={medicamentoActual.stock}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth margin="dense" required>
              <InputLabel id="categoria-select-label">Categoría</InputLabel>
              <Select
                labelId="categoria-select-label"
                name="categoria_id"
                value={medicamentoActual.categoria_id}
                label="Categoría"
                onChange={handleChange}
              >
                {categorias.map((cat) => {
                  const catId = cat.id || cat.id_categoria;
                  return (
                    <MenuItem key={catId} value={catId}>
                      {cat.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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