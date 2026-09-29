from flask import jsonify, request
from models.categorias import db    
from models.empleados import Empleado


def get_empleados():
    empleados = Empleado.query.all()
    return jsonify([empleado.to_dict() for empleado in empleados]), 200

def get_empleado(id):
    empleado = Empleado.query.get(id)
    if not empleado:
        return jsonify({'error': 'Empleado no encontrado'}), 404
    return jsonify(empleado.to_dict()), 200

def create_empleado():
    data = request.get_json()

    if not data.get('nombre') or not data.get('nombre').strip():
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    if not data.get('dni') or not data.get('dni').strip():
        return jsonify({'error': 'El DNI es obligatorio'}), 400

    nuevo_empleado = Empleado(
        nombre=data.get('nombre'),
        apellido=data.get('apellido'),
        dni=data.get('dni'),
        email=data.get('email'),
        cargo=data.get('cargo'),

    )
    db.session.add(nuevo_empleado)
    db.session.commit()
    return jsonify(nuevo_empleado.to_dict()), 201

def update_empleado(id):
    empleado = Empleado.query.get(id)
    if not empleado:
        return jsonify({'error': 'Empleado no encontrado'}), 404

    data = request.get_json()
    empleado.nombre = data.get('nombre', empleado.nombre)
    empleado.apellido = data.get('apellido', empleado.apellido)
    empleado.dni = data.get('dni', empleado.dni)
    empleado.email = data.get('email', empleado.email)
    empleado.cargo = data.get('cargo', empleado.cargo)

    db.session.commit()
    return jsonify(empleado.to_dict()), 200

def delete_empleado(id):
    empleado = Empleado.query.get(id)
    if not empleado:
        return jsonify({'error': 'Empleado no encontrado'}), 404

    db.session.delete(empleado)
    db.session.commit()
    return jsonify({'message': 'Empleado eliminado correctamente'}), 200

