from flask import Blueprint
from controllers.medicamentos_controller import (
    get_medicamentos,
    get_medicamento,
    create_medicamento,
    update_medicamento,
    delete_medicamento
)

medicamentos_bp = Blueprint('medicamentos', __name__)


@medicamentos_bp.route('/', methods=['GET'])
@medicamentos_bp.route('', methods=['GET'])
def route_get_medicamentos():
    return get_medicamentos()

@medicamentos_bp.route('/', methods=['POST'])
@medicamentos_bp.route('', methods=['POST'])
def route_create_medicamento():
    return create_medicamento()


@medicamentos_bp.route('/<int:id>', methods=['GET'])
@medicamentos_bp.route('/<int:id>/', methods=['GET'])
def route_get_medicamento(id):
    return get_medicamento(id)

@medicamentos_bp.route('/<int:id>', methods=['PUT'])
@medicamentos_bp.route('/<int:id>/', methods=['PUT'])
def route_update_medicamento(id):
    return update_medicamento(id)

@medicamentos_bp.route('/<int:id>', methods=['DELETE'])
@medicamentos_bp.route('/<int:id>/', methods=['DELETE'])
def route_delete_medicamento(id):
    return delete_medicamento(id)