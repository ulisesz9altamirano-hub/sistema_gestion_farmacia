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
    print("Payload recibido en backend:", data)  # Ver qué llega exactamente en la terminal

    if not data:
        return jsonify({'error': 'No se enviaron datos en la petición'}), 400

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    dni = data.get('dni')
    email = data.get('email')
    cargo = data.get('cargo')

    if not nombre or not str(nombre).strip():
        return jsonify({'error': 'El campo "nombre" es obligatorio'}), 400

    if not dni or not str(dni).strip():
        return jsonify({'error': 'El campo "dni" es obligatorio'}), 400

    if not apellido or not str(apellido).strip():
        return jsonify({'error': 'El campo "apellido" es obligatorio'}), 400

    try:
        nuevo_empleado = Empleado(
            nombre=nombre.strip(),
            apellido=apellido.strip(),
            dni=str(dni).strip(),
            email=email.strip() if email else None,
            cargo=cargo.strip() if cargo else None
        )
        db.session.add(nuevo_empleado)
        db.session.commit()

        return jsonify(nuevo_empleado.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print("Error en base de datos:", str(e))
        return jsonify({'error': f'Error en base de datos: {str(e)}'}), 400

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

