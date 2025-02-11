from server.forms import RegisterForm
from flask import jsonify
from server.models.user_model import User



class UserService:
    def add_user(form_data, image):
        """
        Add a new user to the database
        
        Keyword arguments:
        `form_data` -- Data of the register form
        `image` -- Image of user profile
        Return: A JSON response containing the status of the user creation with the new user in case of success.
        """
        
        form = RegisterForm(form_data)
        if form.validate_on_submit():
            new_user = User(form.f_name.data, form.l_name.data, form.email.data, form.password.data, form.phone.data)
            user_data = new_user.add_user(image)
            return jsonify({'user': user_data}), 200
        else:
            return jsonify({'errors': form.errors}), 400