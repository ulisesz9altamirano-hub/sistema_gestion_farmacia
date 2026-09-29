from flask import Blueprint
from controllers.categorias_controller import get_categorias, create_categoria, update_categoria, delete_categoria

categorias_bp = Blueprint('categorias', __name__)

categorias_bp.route('/api/categorias', methods=['GET'])(get_categorias)
categorias_bp.route('/api/categorias', methods=['POST'])(create_categoria)
categorias_bp.route('/api/categorias/<int:id>', methods=['PUT'])(update_categoria)
categorias_bp.route('/api/categorias/<int:id>', methods=['DELETE'])(delete_categoria)
