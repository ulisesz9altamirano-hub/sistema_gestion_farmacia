from flask import Blueprint
from controllers.categorias_controller import (
    get_categorias,
    create_categoria,
    update_categoria,
    delete_categoria
)

categorias_bp = Blueprint('categorias', __name__)

# Rutas para /api/categorias y /api/categorias/
@categorias_bp.route('/', methods=['GET'])
@categorias_bp.route('', methods=['GET'])
def route_get_categorias():
    return get_categorias()

@categorias_bp.route('/', methods=['POST'])
@categorias_bp.route('', methods=['POST'])
def route_create_categoria():
    return create_categoria()

# Rutas para /api/categorias/<id> y /api/categorias/<id>/
@categorias_bp.route('/<int:id>', methods=['PUT'])
@categorias_bp.route('/<int:id>/', methods=['PUT'])
def route_update_categoria(id):
    return update_categoria(id)

@categorias_bp.route('/<int:id>', methods=['DELETE'])
@categorias_bp.route('/<int:id>/', methods=['DELETE'])
def route_delete_categoria(id):
    return delete_categoria(id)