from server.forms import LoginForm
from flask import jsonify, session
from server.helper import to_dict
from server.services.user import User

class Authentication():
    """
    A class For user authentication.

    Methods:
    - login(form_data)
    - logout()
    """

    def is_logged_in():
        if 'user' in session:
            return jsonify({'logged_in': True, 'user': session['user']})
        else:
            return jsonify({'logged_in': False})

    def login(form_data):
        """
        Authenticating the user to log in.
        
        Keyword arguments:
        `form_data` -- Data of the register form
        Return: A JSON response containing the status of the user logging in with the user in case of success.
        """

        form = LoginForm(form_data)
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user and form.password.data == user.password:
                session['user'] = to_dict(user)
                print(session)
                return jsonify({'user': to_dict(user)}), 200
            else:
                return jsonify({'error': "Incorrect email or password"}), 400
        else:
            return jsonify({'errors': form.errors}), 400
    
    def logout():
        """
        The user logging out and clearing the session.
        
        Return: A JSON response containing the status of the user logging out.
        """

        session.clear()
        return jsonify({'message': "Logged out successfully"}), 201