from flask import Blueprint, request, session
from server.services.auth import Authentication

auth = Blueprint('/', __name__, url_prefix='/auth')

@auth.route('/login', methods=['POST'])
def login():
    """
    Login end point.
    
    Return: A JSON response containing the status of the user logging in with the user in case of success.
    """
    
    return Authentication.login(request.form)


@auth.route('logout')
def logout():
    """
    Log out end point.

    Return: A JSON response containing the status of the user logging out.
    """
    
    return Authentication.logout()