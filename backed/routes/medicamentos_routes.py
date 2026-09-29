from flask import Blueprint
from controllers.medicamentos_controller import (
    get_medicamentos,
    get_medicamento,
    create_medicamento,
    update_medicamento,
    delete_medicamento
)
medicamentos_bp = Blueprint('medicamentos', __name__)

medicamentos_bp.route('/api/medicamentos', methods=['GET'])(get_medicamentos)
medicamentos_bp.route('/api/medicamentos/<int:id>', methods=['GET'])(get_medicamento)
medicamentos_bp.route('/api/medicamentos', methods=['POST'])(create_medicamento)
medicamentos_bp.route('/api/medicamentos/<int:id>', methods=['PUT'])(update_medicamento)
medicamentos_bp.route('/api/medicamentos/<int:id>', methods=['DELETE'])(delete_medicamento)