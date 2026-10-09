import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, Box, Alert, 
  Snackbar, Chip, Tooltip, Avatar, Grid, Card, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

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
              <PeopleAltTwoToneIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px" sx={{ mb: 0.5 }}>
                Gestión de Empleados
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Administra tu equipo de trabajo de forma eficiente
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
                {empleados.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {empleados.length === 1 ? 'Empleado' : 'Empleados'}
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
              Nuevo Empleado
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
                DNI
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Personal
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Contacto
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Cargo
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#334155', py: 2.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#f1f5f9', width: 80, height: 80 }}>
                      <PeopleAltTwoToneIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" fontWeight="600">
                      No hay empleados registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comienza agregando tu primer empleado al sistema
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((emp, index) => {
                const id = emp.id || emp.id_empleado;
                const cargoNombre = emp.cargo || emp.puesto;
                const initials = `${(emp.nombre || '')[0] || ''}${(emp.apellido || '')[0] || ''}`.toUpperCase();
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
                    <TableCell sx={{ fontWeight: 500, color: '#334155', py: 2.5 }}>
                      {emp.dni || '-'}
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: bgColor,
                            width: 40,
                            height: 40,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#ffffff'
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#0f172a">
                            {`${emp.nombre} ${emp.apellido}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Empleado
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', py: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                        <Typography variant="body2" color="inherit">
                          {emp.email || '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      {cargoNombre ? (
                        <Chip 
                          label={cargoNombre} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#ede9fe', 
                            color: '#6d28d9', 
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 1,
                            '& .MuiChip-label': { px: 1.5 }
                          }} 
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin cargo</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.5 }}>
                      <Box display="flex" justifyContent="center" gap={1} className="action-buttons" sx={{ opacity: 0.7, transition: 'opacity 0.2s' }}>
                        <Tooltip title="Editar empleado" arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenModal(emp)}
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
                        <Tooltip title="Eliminar empleado" arrow>
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
                  {editMode ? <EditTwoToneIcon /> : <BadgeTwoToneIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="800">
                    {editMode ? 'Editar Empleado' : 'Nuevo Empleado'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {editMode ? 'Actualiza la información del empleado' : 'Completa los datos del nuevo empleado'}
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
                  name="dni"
                  label="DNI"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={empleadoActual.dni}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeTwoToneIcon sx={{ color: '#94a3b8' }} />
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
                  name="nombre"
                  label="Nombre"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={empleadoActual.nombre}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#94a3b8' }} />
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
                  name="apellido"
                  label="Apellido"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={empleadoActual.apellido}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#94a3b8' }} />
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
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={empleadoActual.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#94a3b8' }} />
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
                  name="cargo"
                  label="Cargo / Puesto"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={empleadoActual.cargo}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon sx={{ color: '#94a3b8' }} />
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
              {editMode ? '💾 Guardar Cambios' : '✨ Crear Empleado'}
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