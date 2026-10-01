from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models.categorias import db, Categoria
from models.medicamentos import Medicamento
from models.empleados import Empleado

from routes.categorias_routes import categorias_bp
from routes.medicamentos_routes import medicamentos_bp
from routes.empleados_routes import empleados_bp

app=Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)



app.register_blueprint(categorias_bp, url_prefix='/api/categorias')
app.register_blueprint(medicamentos_bp, url_prefix='/api/medicamentos')
app.register_blueprint(empleados_bp, url_prefix='/api/empleados')

@app.route('/', methods=['GET'])
def index():
    return jsonify({'mensaje': 'API Sistema de Gestión para Farmacias'}), 200

@app.route('/api/dashboard', methods=['GET'])
def get_deshboard_data():
    return jsonify({
        'total_categorias': Categoria.query.count(),
        'total_medicamentos': Medicamento.query.count(),
        'total_empleados': Empleado.query.count()
    }), 200 

if __name__ == '__main__':
    app.run(debug=True, port=5000)
