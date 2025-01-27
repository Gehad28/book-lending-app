from flask import Blueprint, request, session
from server.services.auth import Authentication

auth = Blueprint('/', __name__, url_prefix='/auth')

@auth.route('/login', methods=['POST'])
def login():
    return Authentication.login(request.form)


@auth.route('logout')
def logout():
    return Authentication.logout()