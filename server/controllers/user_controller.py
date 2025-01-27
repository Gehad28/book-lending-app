from flask import Blueprint, request, jsonify
from server.services.user import User

user_api = Blueprint('user', __name__, url_prefix='/user')

@user_api.route('/register', methods=['POST'])
def register():
    data = request.form.to_dict()
    new_user = User(data['f_name'], data['l_name'], data['email'], data['password'], data['phone'])
    return new_user.add_user(request.form)

@user_api.route('/update-user', methods=['POST'])
def update_user():
    data = request.form.to_dict()
    updated_user = User(data['f_name'], data['l_name'], data['email'], data['email'], data['phone'])
    user = updated_user.update_user(data['user_id'])
    return {
        'user_id': user.user_id,
        'f_name': user.f_name,
        'l_name': user.l_name,
        'email': user.email,
        'password': user.password,
        'phone': user.phone
    }, 201

@user_api.route('/delete-user', methods=['GET'])
def delete_user():
    user_id = request.args.get('user_id')
    return User.delete_user(user_id)

@user_api.route('/get-user', methods=['GET'])
def get_user():
    user_id = request.args.get('user_id')
    return User.get_user(user_id)

@user_api.route('/get-all-users', methods=['GET'])
def get_all_user():
    return User.get_all_users()