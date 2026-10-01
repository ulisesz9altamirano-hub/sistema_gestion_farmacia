# controllers/medicamentos_controller.py

from flask import request, jsonify
from models.medicamentos import Medicamento  # O el nombre de tu modelo

def get_medicamentos():
    medicamentos = Medicamento.query.all()
    return jsonify([m.to_dict() for m in medicamentos]), 200

def get_medicamento(id):
    med = Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404
    return jsonify(med.to_dict()), 200

def create_medicamento():
    data = request.get_json() or {}
    
    nombre = data.get('nombre')
    precio = data.get('precio')
    stock = data.get('stock', 0)
    categoria_id = data.get('categoria_id') or data.get('id_categoria')
    fecha_vencimiento = data.get('fecha_vencimiento')

    if not nombre or precio is None or not categoria_id or not fecha_vencimiento:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    try:
        nuevo = Medicamento(
            nombre=nombre.strip(),
            descripcion=data.get('descripcion', ''),
            precio=float(precio),
            stock=int(stock),
            fecha_vencimiento=fecha_vencimiento,
            categoria_id=int(categoria_id)
        )
        db.session.add(nuevo)
        db.session.commit()
        return jsonify(nuevo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def update_medicamento(id):
    med = Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404

    data = request.get_json() or {}
    med.nombre = data.get('nombre', med.nombre).strip()
    med.descripcion = data.get('descripcion', med.descripcion)
    if 'precio' in data:
        med.precio = float(data['precio'])
    if 'stock' in data:
        med.stock = int(data['stock'])
    if 'fecha_vencimiento' in data:
        med.fecha_vencimiento = data['fecha_vencimiento']
    if 'categoria_id' in data:
        med.categoria_id = int(data['categoria_id'])

    try:
        db.session.commit()
        return jsonify(med.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# --- ESTA ES LA FUNCIÓN QUE FALTABA O TENÍA OTRO NOMBRE ---
def delete_medicamento(id):
    med = Medicamento.query.get(id)
    if not med:
        return jsonify({'error': 'Medicamento no encontrado'}), 404

    try:
        db.session.delete(med)
        db.session.commit()
        return jsonify({'message': 'Medicamento eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400