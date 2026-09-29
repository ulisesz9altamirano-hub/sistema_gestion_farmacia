from flask import jsonify, request
from models.categorias import db
from models.medicamentos import Medicamento

def get_medicamentos():
    med=Medicamento.query.all()
    return jsonify([medicamento.to_dict() for medicamento in med]), 200

def get_medicamento(id):
    med=Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404
    return jsonify(med.to_dict()), 200
def create_medicamento():
    data = request.get_json()
    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    precio = data.get('precio')
    stock = data.get('stock')
    categoria_id = data.get('categoria_id')

    if not nombre or not nombre.strip():
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    if Medicamento.query.filter_by(nombre=nombre).first():
        return jsonify({'error': 'Ya existe un medicamento con ese nombre'}), 400

    nuevo_medicamento = Medicamento(
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        stock=stock,
        categoria_id=categoria_id
    )
    db.session.add(nuevo_medicamento)
    db.session.commit()

    return jsonify(nuevo_medicamento.to_dict()), 201

def update_medicamento(id):
    med=Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404
    data = request.get_json()
    med.nombre = data.get('nombre', med.nombre)
    med.descripcion = data.get('descripcion', med.descripcion)
    med.precio = data.get('precio', med.precio)
    med.stock = data.get('stock', med.stock)
    med.categoria_id = data.get('categoria_id', med.categoria_id)
    db.session.commit()
    return jsonify(med.to_dict()), 200

def delete_medicamento(id):
    med=Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404
    db.session.delete(med)
    db.session.commit()
    return jsonify({'message': 'Medicamento eliminado correctamente'}), 200