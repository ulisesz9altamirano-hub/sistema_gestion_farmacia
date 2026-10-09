import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  InputBase
} from '@mui/material';
import {
  LocalPharmacy as LocalPharmacyIcon,
  Inventory as InventoryIcon,
  Medication as MedicationIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

// Menú simplificado solo con lo que tienes en el backend
const menuModules = [
  {
    label: 'Inventario',
    icon: <InventoryIcon fontSize="small" />,
    children: [
      { label: 'Medicamentos', path: '/medicamentos', icon: <MedicationIcon fontSize="small" /> },
      { label: 'Categorías', path: '/categorias', icon: <CategoryIcon fontSize="small" /> },
    ]
  },
  {
    label: 'Administración',
    icon: <SettingsIcon fontSize="small" />,
    children: [
      { label: 'Empleados', path: '/empleados', icon: <PeopleIcon fontSize="small" /> },
    ]
  }
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuOpen = (event, menuLabel) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menuLabel);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;
  const isMenuActive = (module) => module.children.some(child => location.pathname === child.path);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5, minHeight: '64px' }}>
            
            {/* 1. LOGO */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: { xs: 2, md: 4 },
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.25)', transform: 'scale(1.05)' },
                }}
              >
                <LocalPharmacyIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.2, color: '#fff' }}>
                  PharmaPro
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Sistema de Gestión
                </Typography>
              </Box>
            </Box>

            {/* 2. NAVEGACIÓN DESKTOP */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 0.5 }}>
                <Button
                  onClick={() => navigate('/')}
                  sx={{
                    color: isActivePath('/') ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                    fontWeight: isActivePath('/') ? 600 : 500,
                    px: 2, py: 1, borderRadius: '8px',
                    background: isActivePath('/') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }
                  }}
                >
                  Dashboard
                </Button>

                {menuModules.map((module) => {
                  const isActive = isMenuActive(module);
                  const isOpen = activeMenu === module.label;

                  return (
                    <Button
                      key={module.label}
                      onClick={(e) => handleMenuOpen(e, module.label)}
                      endIcon={<ArrowDownIcon sx={{ fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
                      sx={{
                        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                        fontWeight: isActive ? 600 : 500,
                        px: 2, py: 1, borderRadius: '8px',
                        background: isActive || isOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        '&:hover': { background: 'rgba(255, 255, 255, 0.1)', color: '#fff' },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {module.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* 3. BARRA DE BÚSQUEDA Y MENÚ MÓVIL (Sin notificaciones ni perfil) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                px: 1.5, py: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:focus-within': { bgcolor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)' }
              }}>
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 20, mr: 1 }} />
                <InputBase
                  placeholder="Buscar..."
                  inputProps={{ 'aria-label': 'buscar' }}
                  sx={{ color: '#fff', fontSize: '0.9rem', width: { md: '150px', lg: '200px' } }}
                />
              </Box>

              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff', ml: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 4. MENÚ DESPLEGABLE (DROPDOWN) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            minWidth: '200px',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            }
          }
        }}
      >
        {activeMenu && menuModules.find(m => m.label === activeMenu)?.children.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <MenuItem 
              key={item.path} 
              onClick={() => handleNavigate(item.path)}
              sx={{ 
                py: 1.5, px: 2, borderRadius: '8px', mx: 1, width: 'auto',
                bgcolor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#2563eb' : '#334155',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#2563eb' : '#64748b', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }} 
              />
            </MenuItem>
          );
        })}
      </Menu>

      {/* 5. DRAWER MÓVIL (Simplificado) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: '#ffffff',
            color: '#334155',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
          }
        }}
      >
        {/* Header del Drawer Móvil */}
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="700" color="#1e3a8a">Menú</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Buscador Móvil */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f5f9', borderRadius: '8px', px: 1.5, py: 1 }}>
            <SearchIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
            <InputBase placeholder="Buscar..." sx={{ color: '#334155', fontSize: '0.9rem', width: '100%' }} />
          </Box>
        </Box>

        {/* Lista de Opciones Móvil */}
        <List sx={{ px: 2, pt: 1 }}>
          <ListItemButton 
            onClick={() => handleNavigate('/')} 
            selected={isActivePath('/')} 
            sx={{ borderRadius: '8px', mb: 1, color: isActivePath('/') ? '#2563eb' : '#334155' }}
          >
            <ListItemIcon sx={{ color: isActivePath('/') ? '#2563eb' : '#64748b', minWidth: 40 }}>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>

          {menuModules.map((module) => (
            <Box key={module.label} sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, px: 2, mb: 0.5, display: 'block' }}>
                {module.label}
              </Typography>
              {module.children.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive}
                    sx={{ 
                      borderRadius: '8px', mb: 0.5, pl: 3,
                      bgcolor: isActive ? '#eff6ff' : 'transparent',
                      color: isActive ? '#2563eb' : '#334155',
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#2563eb' : '#64748b', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }} />
                  </ListItemButton>
                );
              })}
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;