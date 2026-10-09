import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, Box, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem, Chip, Tooltip, Avatar, 
  Grid, Card, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LocalPharmacyTwoToneIcon from '@mui/icons-material/LocalPharmacyTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

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

  // Función auxiliar para calcular el estado del stock
  const getStockStatus = (stock) => {
    const numStock = parseInt(stock, 10) || 0;
    if (numStock === 0) return { color: '#dc2626', bg: '#fef2f2', label: 'Sin stock', icon: '⚠️' };
    if (numStock < 10) return { color: '#ea580c', bg: '#fff7ed', label: 'Stock bajo', icon: '📉' };
    if (numStock < 50) return { color: '#ca8a04', bg: '#fefce8', label: 'Stock medio', icon: '📊' };
    return { color: '#16a34a', bg: '#f0fdf4', label: 'Stock alto', icon: '✅' };
  };

  // Función auxiliar para calcular días hasta vencimiento
  const getVencimientoStatus = (fecha) => {
    if (!fecha) return { color: '#64748b', bg: '#f1f5f9', label: 'Sin fecha', days: null };
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: '#dc2626', bg: '#fef2f2', label: 'Vencido', days: diffDays };
    if (diffDays <= 30) return { color: '#dc2626', bg: '#fef2f2', label: `${diffDays} días`, days: diffDays };
    if (diffDays <= 90) return { color: '#ca8a04', bg: '#fefce8', label: `${diffDays} días`, days: diffDays };
    return { color: '#16a34a', bg: '#f0fdf4', label: `${diffDays} días`, days: diffDays };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header Sección - Diseño moderno con gradiente */}
      <Card 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 5, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                backdropFilter: 'blur(10px)',
                width: 64, 
                height: 64, 
                borderRadius: 3,
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <LocalPharmacyTwoToneIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px" sx={{ mb: 0.5 }}>
                Gestión de Medicamentos
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Controla el inventario de tu farmacia
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Box 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                backdropFilter: 'blur(10px)',
                px: 3, 
                py: 1.5, 
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="800">
                {medicamentos.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {medicamentos.length === 1 ? 'Medicamento' : 'Medicamentos'}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{ 
                borderRadius: 3, 
                px: 3, 
                py: 1.5, 
                textTransform: 'none', 
                fontWeight: 700,
                bgcolor: '#ffffff',
                color: '#667eea',
                '&:hover': { 
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nuevo Medicamento
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Tabla Principal - Diseño mejorado */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: 5, 
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          bgcolor: '#ffffff'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Medicamento
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Precio
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Stock
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Vencimiento
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Categoría
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {medicamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#f1f5f9', width: 80, height: 80 }}>
                      <LocalPharmacyTwoToneIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" fontWeight="600">
                      No hay medicamentos registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comienza agregando tu primer medicamento al inventario
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              medicamentos.map((med, index) => {
                const id = med.id || med.id_medicamento;
                const catNombre = med.categoria?.nombre || 
                  categorias.find(c => (c.id || c.id_categoria) === (med.categoria_id || med.id_categoria))?.nombre || '-';
                
                const stockStatus = getStockStatus(med.stock);
                const vencStatus = getVencimientoStatus(med.fecha_vencimiento);
                const initials = (med.nombre || 'MED').substring(0, 2).toUpperCase();
                const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57'];
                const bgColor = colors[index % colors.length];
                
                return (
                  <TableRow 
                    key={id} 
                    hover 
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                        '& .action-buttons': { opacity: 1 }
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#64748b', fontWeight: 600, py: 2.5 }}>
                      <Box 
                        component="span"
                        sx={{ 
                          bgcolor: '#f1f5f9', 
                          color: '#475569',
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}
                      >
                        #{id}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: bgColor,
                            width: 40,
                            height: 40,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#ffffff'
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Typography variant="body2" fontWeight="700" color="#0f172a">
                          {med.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AttachMoneyIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                        <Typography variant="body2" fontWeight="700" color="#0f172a">
                          ${parseFloat(med.precio).toFixed(2)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Tooltip title={stockStatus.label} arrow>
                        <Chip 
                          label={`${stockStatus.icon} ${med.stock}`}
                          size="small" 
                          sx={{ 
                            backgroundColor: stockStatus.bg, 
                            color: stockStatus.color, 
                            fontWeight: 700,
                            borderRadius: 2,
                            '& .MuiChip-label': { px: 1.5 }
                          }} 
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      {med.fecha_vencimiento ? (
                        <Tooltip title={`Vence: ${new Date(med.fecha_vencimiento).toLocaleDateString()}`} arrow>
                          <Chip 
                            label={`${new Date(med.fecha_vencimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} (${vencStatus.label})`}
                            size="small" 
                            sx={{ 
                              backgroundColor: vencStatus.bg, 
                              color: vencStatus.color, 
                              fontWeight: 600,
                              borderRadius: 2,
                              '& .MuiChip-label': { px: 1.5 }
                            }} 
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin fecha</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      {catNombre && catNombre !== '-' ? (
                        <Chip 
                          label={catNombre} 
                          size="small" 
                          icon={<CategoryIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{ 
                            backgroundColor: '#ede9fe', 
                            color: '#6d28d9', 
                            fontWeight: 600,
                            borderRadius: 2,
                            '& .MuiChip-label': { px: 1.5 }
                          }} 
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin categoría</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.5 }}>
                      <Box display="flex" justifyContent="center" gap={1} className="action-buttons" sx={{ opacity: 0.7, transition: 'opacity 0.2s' }}>
                        <Tooltip title="Editar medicamento" arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenModal(med)}
                            sx={{ 
                              backgroundColor: '#eff6ff', 
                              color: '#2563eb',
                              '&:hover': { 
                                backgroundColor: '#dbeafe',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar medicamento" arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleDelete(id)}
                            sx={{ 
                              backgroundColor: '#fef2f2', 
                              color: '#dc2626',
                              '&:hover': { 
                                backgroundColor: '#fee2e2',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal / Dialog - Diseño moderno */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: { 
            borderRadius: 5, 
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <form onSubmit={handleSave}>
          {/* Header del Modal */}
          <Box sx={{ 
            background: editMode 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: '#ffffff',
            position: 'relative'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.25)', 
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {editMode ? <EditTwoToneIcon /> : <MedicalServicesIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="800">
                    {editMode ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {editMode ? 'Actualiza la información del medicamento' : 'Completa los datos del nuevo medicamento'}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseModal} size="small" sx={{ color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <DialogContent sx={{ p: 3, pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  name="nombre"
                  label="Nombre del Medicamento"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={medicamentoActual.nombre}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MedicalServicesIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="precio"
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={medicamentoActual.precio}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="stock"
                  label="Stock / Cantidad"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={medicamentoActual.stock}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="fecha_vencimiento"
                  label="Fecha de Vencimiento"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={medicamentoActual.fecha_vencimiento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel 
                    id="categoria-select-label"
                    sx={{
                      '&.Mui-focused': { color: '#667eea' }
                    }}
                  >
                    Categoría
                  </InputLabel>
                  <Select
                    labelId="categoria-select-label"
                    name="categoria_id"
                    value={medicamentoActual.categoria_id}
                    label="Categoría"
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <CategoryIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea'
                      }
                    }}
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
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
            <Button 
              onClick={handleCloseModal} 
              variant="outlined"
              sx={{ 
                borderRadius: 3, 
                textTransform: 'none',
                px: 3,
                py: 1.2,
                fontWeight: 600,
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': { 
                  borderColor: '#cbd5e1',
                  bgcolor: '#f8fafc'
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                borderRadius: 3, 
                textTransform: 'none', 
                px: 4,
                py: 1.2,
                fontWeight: 700,
                background: editMode 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {editMode ? '💾 Guardar Cambios' : '✨ Crear Medicamento'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Notificaciones Snackbar - Mejorado */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({ ...alert, open: false })}
          variant="filled"
          iconMapping={{
            success: <CheckCircleIcon />,
            error: <ErrorIcon />,
            warning: <WarningIcon />,
            info: <InfoIcon />
          }}
          sx={{ 
            borderRadius: 3, 
            width: '100%',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            '& .MuiAlert-message': { fontWeight: 600 }
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}