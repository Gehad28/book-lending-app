from flask import Blueprint, render_template, request, session
from server.services.user import User

auth = Blueprint('/', __name__, url_prefix='/auth')

@auth.route('/login', methods=['POST'])
def login():
    data = request.form.to_dict()
    user = User.login(data['email'], data['password'])
    session['user'] = user.user_id
    return {
        'user_id': user.user_id, 
        'f_name': user.f_name,
        'l_name': user.l_name,
        'email': user.email,
        'password': user.password,
        'phone': user.phone
    }, 201


@auth.route('logout')
def logout():
    session.clear()
    return "Logged out successfully", 201