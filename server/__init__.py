from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:<yourpassword>@localhost/book_exchange'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['WTF_CSRF_ENABLED'] = False
    app.secret_key = 'SECRET KEY'
    app.permanent_session_lifetime = timedelta(days=5)
    CORS(app, supports_credentials=True)

    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        from server.controllers.user_controller import user_api  
        from server.controllers.auth import auth
        from server.controllers.book_controller import book_api
        from server.controllers.notification_controller import not_api
        app.register_blueprint(user_api)
        app.register_blueprint(auth)
        app.register_blueprint(book_api)
        app.register_blueprint(not_api)

    return app