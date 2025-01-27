from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length, Regexp

class RegisterForm(FlaskForm):
    message = "This filed is required"
    f_name = StringField('f_name', validators=[DataRequired(message)])
    l_name = StringField('l_name', validators=[DataRequired(message)])
    email = StringField('email', validators=[DataRequired(message), Email()])
    password = StringField('password', validators=[DataRequired(message), Length(min=6, message="Password must be at least 6 characters")])
    phone = StringField('phone', validators=[DataRequired(message), 
                                            Length(min=11, max=11, message="Phone number must be 11 digits."),
                                            Regexp(r'^\+?2?\d{11}$', message="Invalid phone number.")])
    # ^: Ensures the beginning of the string
    # \+: Escape because the + is a special ch of regex
    # ?: Means optional
    # $: Ensures the ending of the string
    submit = SubmitField('Submit')