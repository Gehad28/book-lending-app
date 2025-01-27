
def to_dict(user):
    """
    Converting the user record into a dictionary.
    
    Keyword arguments:
    user -- The user record from the database.
    Return: The user record as a dictionary.
    """
    
    return {
        'user_id': user.user_id,
        'f_name': user.f_name,
        'l_name': user.l_name,
        'email': user.email,
        'password': user.password,
        'phone': user.phone
    }