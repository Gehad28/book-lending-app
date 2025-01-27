from server import db
from sqlalchemy.sql import func
from server.forms import RegisterForm
from flask import jsonify
from server.helper import to_dict

class User(db.Model):
    """
    A User class that is connected with the User table in the database.
    
    Properties:
    - `user_id`: The ID of the user.
    - `f_name`: The user's first name.
    - `l_name`: The user's last name.
    - `email`: The user's email address.
    - `password`: The user's password.
    - `phone`: The user's phone number.

    Methods:
    - add_user(form_data)
    - update_user(form_data)
    - delete_user(user_id)
    - get_user(user_id)
    - get_all_users()
    """
    
    user_id = db.Column(db.Integer, primary_key=True)
    f_name = db.Column(db.String(255), nullable=False)
    l_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    def __init__(self, f_name, l_name, email, password, phone):
        self.f_name = f_name
        self.l_name = l_name
        self.email = email
        self.password = password
        self.phone = phone

    def add_user(self, form_data):
        """
        Add a new user to the database
        
        Keyword arguments:
        `form_data` -- Data of the register form
        Return: A JSON response containing the status of the user creation with the new user in case of success.
        """
        
        form = RegisterForm(form_data)
        if form.validate_on_submit():
            db.session.add(self)
            db.session.commit()
            return jsonify({'user': to_dict(self)}), 200
        else:
            return jsonify({'errors': form.errors}), 400

    def update_user(self, user_id):
        """
        Update an existing user in the databse
        
        Keyword arguments:
        `user_id` -- The ID of the user to be updated
        Return: A JSON response containing the status of the user updating with the updated user in case of success.
        """
        
        user_to_update = User.query.get(user_id)
        if user_to_update:
            if not self.f_name or not self.email or not self.password or not self.phone:
                raise ValueError("Complete required fields")
            else:
                user_to_update.f_name = self.f_name
                user_to_update.l_name = self.l_name
                user_to_update.email = self.email
                user_to_update.password = self.password
                user_to_update.phone = self.phone

                db.session.add(user_to_update)
                db.session.commit()
                return user_to_update
        return "User not found"

    def delete_user(user_id):
        """
        Delete a user from the database
        
        Keyword arguments:
        `user_id` -- The ID of the user to be deleted
        Return: A JSON response containing the status of the user deletion.
        """
        
        user_to_delete = User.query.get_or_404(user_id)
        if user_to_delete:
            db.session.delete(user_to_delete)
            db.session.commit()
            return jsonify({'message': "User deleted successfully"}), 200
        return jsonify({'message': "User not found"}), 400
    
    def get_user(user_id):
        """
        Fetch a user from the database.
        
        Keyword arguments:
        `user_id` -- The ID of the user to be fetched
        Return: A JSON response containing the status of the user fetching with the user in case of success.
        """
        
        return jsonify({'user': to_dict(User.query.get(user_id))}), 200
    
    def get_all_users():
        """
        Fetching all users.
        
        Return: A JSON response containing the status of the users fetching with the users list in case of success.
        """
        
        users = User.query.all()
        users_list = []
        for user in users:
            users_list.append(to_dict(user))
        return jsonify({'users': users_list}), 200