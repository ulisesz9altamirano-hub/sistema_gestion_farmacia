from flask import jsonify, request
from models.categorias import Categoria, db

def get_categorias():
    categorias = Categoria.query.all()
    return jsonify([categoria.to_dict() for categoria in categorias]), 200

def get_categoria_by_id(id):
    categoria = Categoria.query.get(id)
    if not categoria:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    return jsonify(categoria.to_dict()), 200

def create_categoria():
    data = request.get_json()
    nombre = data.get('nombre')
    
    if not nombre or not nombre.strip():
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    if Categoria.query.filter_by(nombre=nombre).first():
        return jsonify({'error': 'Ya existe una categoría con ese nombre'}), 400

    nueva_categoria = Categoria(nombre=nombre)
    db.session.add(nueva_categoria)
    db.session.commit()

    return jsonify(nueva_categoria.to_dict()), 201

def update_categoria(id):
    categoria = Categoria.query.get(id)
    if not categoria:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    data = request.get_json()
    categoria.nombre = data.get('nombre', categoria.nombre)
    db.session.commit()
    return jsonify(categoria.to_dict()), 200

def delete_categoria(id):
    categoria = Categoria.query.get(id)
    if not categoria:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    db.session.delete(categoria)
    db.session.commit()
    return jsonify({'message': 'Categoría eliminada correctamente'}), 200