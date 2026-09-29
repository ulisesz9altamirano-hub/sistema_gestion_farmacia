from flask import Blueprint
from controllers.empleado_controller import (
    get_empleados,
    get_empleado,
    create_empleado,
    update_empleado,
    delete_empleado
)
empleados_bp = Blueprint('empleados', __name__)

empleados_bp.route('/api/empleados', methods=['GET'])(get_empleados)
empleados_bp.route('/api/empleados/<int:id>', methods=['GET'])(get_empleado)
empleados_bp.route('/api/empleados', methods=['POST'])(create_empleado)
empleados_bp.route('/api/empleados/<int:id>', methods=['PUT'])(update_empleado)
empleados_bp.route('/api/empleados/<int:id>', methods=['DELETE'])(delete_empleado)