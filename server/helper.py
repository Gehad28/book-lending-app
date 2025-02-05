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
        'phone': user.phone,
        'image_path': user.image_path
    }

def book_to_dict(book):
    return {
        'book_id': book.book_id,
        'title': book.title,
        'author': book.author,
        'image_path': book.image_path,
        'is_borrowed': book.is_borrowed,
        'owner_id': book.owner_id,
        'borrowd_by': book.borrowed_by,
        'borrow_req': book.borrow_req
    }

def notification_to_dict(notification):
    return {
        'id': notification.id,
        'book_id': notification.book_id,
        'message': notification.message,
        'status': notification.status,
        'owner_id': notification.owner_id,
        'borrowd_id': notification.borrower_id
    }

def upload(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    file_path = '/'.join(['images', filename])
    return filename, file_path