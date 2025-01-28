from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'server/images'

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

def book_to_dict(book):
    return {
        'book_id': book.book_id,
        'title': book.title,
        'author': book.author,
        'image_path': book.image_path,
        'is_borrowed': book.is_borrowed,
        'owner_id': book.owner_id,
        'borrowd_by': book.borrowed_by
    }

def upload(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    file_path = '/'.join(['images', filename])
    return filename, file_path