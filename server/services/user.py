from server import db
from sqlalchemy.sql import func
from server.forms import RegisterForm
from flask import jsonify
from server.helper import to_dict

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    f_name = db.Column(db.String(255), nullable=False)
    l_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    def __init__(self, f_name, l_name, email, password, phone):
        self.f_name = f_name
        self.l_name = l_name
        self.email = email
        self.password = password
        self.phone = phone

    def add_user(self, form_data):
        form = RegisterForm(form_data)
        if form.validate_on_submit():
            db.session.add(self)
            db.session.commit()
            return jsonify({'user': to_dict(self)}), 200
        else:
            return jsonify({'errors': form.errors}), 400

    def update_user(self, user_id):
        user_to_update = User.query.get(user_id)
        if user_to_update:
            if not self.f_name or not self.email or not self.password or not self.phone:
                raise ValueError("Complete required fields")
            else:
                user_to_update.f_name = self.f_name
                user_to_update.l_name = self.l_name
                user_to_update.email = self.email
                user_to_update.password = self.password
                user_to_update.phone = self.phone

                db.session.add(user_to_update)
                db.session.commit()
                return user_to_update
        return "User not found"

    def delete_user(user_id):
        user_to_delete = User.query.get_or_404(user_id)
        if user_to_delete:
            db.session.delete(user_to_delete)
            db.session.commit()
            return "User deleted successfully"
        return "User not found"
    
    def get_user(user_id):
        return User.query.get(user_id)
    
    def get_all_users():
        return User.query.all()