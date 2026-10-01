import API from './api';

// Categorías
export const getCategorias = async () => (await API.get('/categorias')).data;
export const createCategoria = async (categoria) => (await API.post('/categorias', categoria)).data;
export const updateCategoria = async (id, categoria) => (await API.put(`/categorias/${id}`, categoria)).data;
export const deleteCategoria = async (id) => (await API.delete(`/categorias/${id}`)).data;

// Medicamentos
export const getMedicamentos = async () => (await API.get('/medicamentos')).data;
export const createMedicamento = async (medicamento) => (await API.post('/medicamentos', medicamento)).data;
export const updateMedicamento = async (id, medicamento) => (await API.put(`/medicamentos/${id}`, medicamento)).data;
export const deleteMedicamento = async (id) => (await API.delete(`/medicamentos/${id}`)).data;

// Empleados
export const getEmpleados = async () => (await API.get('/empleados')).data;
export const createEmpleado = async (empleado) => (await API.post('/empleados', empleado)).data;
export const updateEmpleado = async (id, empleado) => (await API.put(`/empleados/${id}`, empleado)).data;
export const deleteEmpleado = async (id) => (await API.delete(`/empleados/${id}`)).data;