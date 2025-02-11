from flask import Blueprint, request
from server.services.user import UserService

user_api = Blueprint('user', __name__, url_prefix='/user')

@user_api.route('/register', methods=['POST'])
def register():
    """
    Register end point.

    This endpoint accepts the following form data:
    - `f_name`: The user's first name.
    - `l_name`: The user's last name.
    - `email`: The user's email address.
    - `password`: The user's password.
    - `phone`: The user's phone number.
    
    Return: A JSON response containing the status of the user creation with the new user in case of success.
    """
    
    image = request.files['profile_image']
    return UserService.add_user(request.form, image)

@user_api.route('/update-user', methods=['POST'])
def update_user():
    """
    Update user end point.

    This endpoint accepts the following form data:
    - `f_name`: The user's first name.
    - `l_name`: The user's last name.
    - `email`: The user's email address.
    - `password`: The user's password.
    - `phone`: The user's phone number.
    
    Return: A JSON response containing the status of the user updating with the updated user in case of success.
    """
    
    return UserService.update_user(request.form, request.files['profile_image'])

@user_api.route('/delete-user', methods=['GET'])
def delete_user():
    """
    Delete user end point.
    
    Return: A JSON response containing the status of the user deletion.
    """
    
    user_id = request.args.get('user_id')
    return UserService.delete_user(user_id)

@user_api.route('/get-user', methods=['GET'])
def get_user():
    """
    Get user by id.
    
    Query parameters:
    - `user_id`: The ID of the user to fetch.

    Return: A JSON response containing the user.
    """
    
    user_id = request.args.get('user_id')
    return UserService.get_user(user_id)

@user_api.route('/get-all-users', methods=['GET'])
def get_all_user():
    """
    Get all users.

    Return: A JSON response containing a list of all users.
    """

    return UserService.get_all_users()