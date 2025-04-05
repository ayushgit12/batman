from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os

mongo = PyMongo()


def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    
    mongo.init_app(app)
    CORS(app)
    app.secret_key = os.getenv("FLASK_SECRET_KEY")

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.stock_routes import stock_bp
    from app.routes.watchlist_routes import watchlist_bp
    from app.routes.upstox_routes import upstox_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(stock_bp)
    app.register_blueprint(watchlist_bp)
    app.register_blueprint(upstox_bp)

    # Serve frontend
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.route('/<path:path>')
    def catch_all(path):
        return app.send_static_file('index.html')

    return app
