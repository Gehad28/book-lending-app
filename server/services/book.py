from server import db
from sqlalchemy.sql import func
from server.forms import BookForm, UpdateBookForm
from flask import jsonify, request, session
from server.helper import book_to_dict, upload, to_dict
from server.services.user import User
from server.models.book_model import Book

class BookSevice:
    def create_book(form_data, image):
        form = BookForm(form_data)
        if form.validate_on_submit():
            user = session['user']
            new_book = Book(form.title.data, form.author.data)
            new_book.owner_id = user['user_id']
            book_data = new_book.create_book(image)
            return jsonify({'book': book_data, 'message': "Book added successfully"}), 200
        else:
            return jsonify({'errors': form.errors}), 400
    
    def update_book(form_data, image):
        book = Book.query.get(request.args.get("book_id"))
        if not book:
            return jsonify({'error': "Book not found"}), 400
        
        form = UpdateBookForm(form_data)
        if form.validate_on_submit():
            book_data = book.update_book(form_data, image)
            return jsonify({'book': book_data, 'message': "Book updated successfully"}), 200
        return jsonify({'errors': form.errors}), 400
    
    def borrow_book(book_id):
        book = Book.query.get(book_id)
        if book:
            book_data = book.borrow_book()
            return jsonify({'book': book_data}), 200
        return jsonify({'error': 'Book not found'})

    def set_as_borrowed(book_id, borrower_id, flag):
        book = Book.query.get(book_id)
        if book:
            message = book.set_as_borrowed(borrower_id, flag)
            return jsonify({'message': message}), 200
        return jsonify({'error': "Book not found"}), 400

    def delete_book(book_id):
        book_to_delete = Book.query.get(book_id)
        if book_to_delete:
            message = book_to_delete.delete_book()
            return jsonify({'message': message}), 200
        return jsonify({'error': "Book not found"}), 400
    
    def get_book(book_id):
        book = Book.get_book(book_id)
        if book:
            return jsonify({'book': book}), 200
        return jsonify({'error': "Book not found"}), 400
    
    def get_user_books():
        user_books = Book.get_user_books(session['user']['user_id'])
        if user_books:
            return jsonify({'books': user_books}), 200
        return jsonify({'message': 'No books found'}), 200
    
    def get_borrowed_books():
        books = Book.get_borrowed_books(session['user']['user_id'])
        if books:
                return jsonify({'books': books}), 200
        return jsonify({'message': "No borrowed books"}), 200 
    
    def get_available_books():
        all_books = Book.get_available_books(session['user']['user_id'])
        if all_books:
            return jsonify({'books': all_books}), 200
        return jsonify({'message': 'No books found'}), 200