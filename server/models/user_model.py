from server import db, bcrypt
from sqlalchemy.sql import func
from server.helper import to_dict, upload

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
    
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True)
    f_name = db.Column(db.String(255), nullable=False)
    l_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())

    book = db.relationship('Book', back_populates='owner', foreign_keys="Book.owner_id")
    
    def __init__(self, f_name, l_name, email, password, phone):
        self.f_name = f_name
        self.l_name = l_name
        self.email = email
        self.password = password
        self.phone = phone
        self.created_at 

    def add_user(self, image):
        """
        Add a new user to the database
        
        Keyword arguments:
        `image` -- Image of user profile
        Return: A JSON response containing the status of the user creation with the new user in case of success.
        """
        
        if image:
            filename, file_path = upload(image)
            self.image_path = file_path
        else:
            self.image_path = 'images/default_profile.jpg'
        self.password = bcrypt.generate_password_hash(self.password).decode('utf-8')
        db.session.add(self)
        db.session.commit()
        return to_dict(self)

    def update_user(self, form, image):
        """
        Update an existing user in the databse
        
        Keyword arguments:
        `user_id` -- The ID of the user to be updated
        Return: A JSON response containing the status of the user updating with the updated user in case of success.
        """

        self.f_name = form['f_name']
        self.l_name = form['l_name']
        self.email = form['email']
        self.password = bcrypt.generate_password_hash(form['password']).decode('utf-8')
        self.phone = form['phone']
        if image:
            filename, file_path = upload(image)
            self.image_path = file_path

        db.session.add(self)
        db.session.commit()
        return to_dict(self)

    def delete_user(self):
        """
        Delete a user from the database
        
        Keyword arguments:
        `user_id` -- The ID of the user to be deleted
        Return: A JSON response containing the status of the user deletion.
        """
        db.session.delete(self)
        db.session.commit()
        return {'message': 'User deleted successfully'}
    
    @staticmethod
    def get_user(user_id):
        """
        Fetch a user from the database.
        
        Keyword arguments:
        `user_id` -- The ID of the user to be fetched
        Return: A JSON response containing the status of the user fetching with the user in case of success.
        """
        
        user = User.query.get(user_id)
        if user:
            return to_dict(user)
        else:
            return None
    
    @staticmethod
    def get_all_users():
        """
        Fetching all users.
        
        Return: A JSON response containing the users list.
        """
        
        users = User.query.all()
        return [to_dict(user) for user in users]