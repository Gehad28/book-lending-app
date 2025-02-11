from server import db, bcrypt
from sqlalchemy.sql import func
from server.forms import RegisterForm, UpdateUserForm
from flask import jsonify, session
from server.helper import to_dict, upload
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

    def update_user(form_data, image):
        """
        Update an existing user in the databse
        
        Keyword arguments:
        `user_id` -- The ID of the user to be updated
        Return: A JSON response containing the status of the user updating with the updated user in case of success.
        """
        user_id = session['user']['user_id']
        user_to_update = User.query.get(user_id)
        if not user_to_update:
            return jsonify({'error': "User not found"})
        
        form = UpdateUserForm(form_data)
        if form.validate_on_submit():
                user_data = user_to_update.update_user(form_data, image)
                return jsonify({'updated_user': user_data}), 200
        return jsonify({'errors': form.errors}), 400

    def delete_user(user_id):
        """
        Delete a user from the database
        
        Keyword arguments:
        `user_id` -- The ID of the user to be deleted
        Return: A JSON response containing the status of the user deletion.
        """
        
        user_to_delete = User.query.get(user_id) 
        if not user_to_delete:
            return jsonify({'message': "User not found"}), 400
        
        message = user_to_delete.delete_user()
        return jsonify({'message': message}), 200

    def get_user(user_id):
        """
        Fetch a user from the database.
        
        Keyword arguments:
        `user_id` -- The ID of the user to be fetched
        Return: A JSON response containing the status of the user fetching with the user in case of success.
        """
        
        user = User.get_user(user_id)
        if user:
            return jsonify({'user': to_dict(user)}), 200
        return jsonify({'error': "User not found"}), 400

    def get_all_users():
        """
        Fetching all users.
        
        Return: A JSON response containing the users list.
        """
        
        users = User.get_all_users()
        return jsonify({'users': users}), 200