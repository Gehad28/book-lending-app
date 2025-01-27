from server.forms import LoginForm
from server import db
from flask import jsonify, session
from server.helper import to_dict
from server.services.user import User

class Authentication():
    def login(form_data):
        form = LoginForm(form_data)
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user and form.password.data == user.password:
                session['user'] = user.user_id
                return jsonify({'user': to_dict(user)}), 200
            else:
                return jsonify({'error': "Incorrect email or password"}), 400
        else:
            return jsonify({'errors': form.errors}), 400
        
    def logout():
        session.clear()
        return jsonify({'message': "Logged out successfully"}), 201