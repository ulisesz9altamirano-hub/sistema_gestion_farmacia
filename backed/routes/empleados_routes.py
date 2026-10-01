from flask import Blueprint
from controllers.empleado_controller import (
    get_empleados,
    get_empleado,
    create_empleado,
    update_empleado,
    delete_empleado
)

# El nombre debe coincidir exactamente con el que importas en app.py
empleados_bp = Blueprint('empleados', __name__)

# Rutas para listado y creación (/api/empleados)
@empleados_bp.route('/', methods=['GET'])
@empleados_bp.route('', methods=['GET'])
def route_get_empleados():
    return get_empleados()

@empleados_bp.route('/', methods=['POST'])
@empleados_bp.route('', methods=['POST'])
def route_create_empleado():
    return create_empleado()

# Rutas para operaciones por ID (/api/empleados/<int:id>)
@empleados_bp.route('/<int:id>', methods=['GET'])
@empleados_bp.route('/<int:id>/', methods=['GET'])
def route_get_empleado(id):
    return get_empleado(id)

@empleados_bp.route('/<int:id>', methods=['PUT'])
@empleados_bp.route('/<int:id>/', methods=['PUT'])
def route_update_empleado(id):
    return update_empleado(id)

@empleados_bp.route('/<int:id>', methods=['DELETE'])
@empleados_bp.route('/<int:id>/', methods=['DELETE'])
def route_delete_empleado(id):
    return delete_empleado(id)