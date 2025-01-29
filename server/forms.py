from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField
from wtforms.validators import DataRequired, Email, Length, Regexp, ValidationError

class RegisterForm(FlaskForm):
    """
    A class that extends `FlaskForm` and defines the registration form.
    
    Properties:
    - f_name: The user's first name.
    - l_name: The user's last name.
    - email: The user's email address.
    - password: The user's password.
    - phone: The user's phone number.
    - submit: The submit input
    """
    
    message = "This filed is required"
    f_name = StringField('f_name', validators=[DataRequired(message)])
    l_name = StringField('l_name', validators=[DataRequired(message)])
    email = StringField('email', validators=[DataRequired(message), Email()])
    password = PasswordField('password', validators=[DataRequired(message), Length(min=6, message="Password must be at least 6 characters")])
    phone = StringField('phone', validators=[DataRequired(message), 
                                            Length(min=11, max=11, message="Phone number must be 11 digits."),
                                            Regexp(r'^\+?2?\d{11}$', message="Invalid phone number.")])
    # ^: Ensures the beginning of the string
    # \+: Escape because the + is a special ch of regex
    # ?: Means optional
    # $: Ensures the ending of the string
    submit = SubmitField('Submit')

    def validate_email(self, field):
        from server.services.user import User
        if User.query.filter_by(email=field.data).first():
            raise ValidationError("Email already exists")

class LoginForm(FlaskForm):
    """
    A class that extends `FlaskForm` and defines the login form.
    
    Properties:
    - email: The user's email address.
    - password: The user's password.
    - submit: The submit input
    """
        
    message = "Incorrect email or password"
    email = StringField('email', validators=[DataRequired(message), Email()])
    password = PasswordField('password', validators=[DataRequired(message)])
    submit = SubmitField('Submit')

class BookForm(FlaskForm):
    message = "This field is required"
    title = StringField('title', validators=[DataRequired(message)])
    author = StringField('author', validators=[DataRequired(message)])
    # image = FileField('image', validators=[DataRequired(message), Regexp('^.*\.(jpg|jpeg|png)$', message="Invalid File extention")])
    submit = SubmitField('Submit')