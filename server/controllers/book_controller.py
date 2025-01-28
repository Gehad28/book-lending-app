from flask import Blueprint, request, session
from server.services.book import Book

book_api = Blueprint('book', __name__, url_prefix='/book')

@book_api.route('/add-book', methods=['POST'])
def add_book():
    data = request.form.to_dict()
    user = session['user']
    new_book = Book(data['title'], data['author'], user['user_id'])
    return new_book.create_book(request.form, request.files['image'])

def update_book():
    pass

@book_api.route('/set-as-borrowed')
def set_as_borrowed():
    book_id = request.args.get('book_id')
    return Book.set_as_borrowed(book_id)

@book_api.route('/delete-book')
def delete_book():
    book_id = request.args.get('book_id')
    return Book.delete_book(book_id)

@book_api.route('/get-book')
def get_book():
    book_id = request.args.get('book_id')
    return Book.get_book(book_id)

@book_api.route('/get-user-books')
def get_user_books():
    user_id = session['user']['user_id']
    return Book.get_user_books(user_id)

@book_api.route('/get-all-books')
def get_available_books():
    return Book.get_available_books()