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