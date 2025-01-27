from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

db = SQLAlchemy()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:gehad_db28@localhost/book_exchange'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "SECRET KEY"
app.permanent_session_lifetime = timedelta(days=5)

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)