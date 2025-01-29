from server import db
from sqlalchemy.sql import func
from server.forms import BookForm
from flask import jsonify, request
from server.helper import book_to_dict, upload
from server.services.user import User

class Book(db.Model):
    __tablename__ = 'book'

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    is_borrowed = db.Column(db.Boolean, default=False, nullable=False)
    borrowed_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    borrowed_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    owner = db.relationship('User', back_populates='book', foreign_keys=[owner_id])
    borrower = db.relationship('User', foreign_keys=[borrowed_by])

    def __init__(self, title, author, owner_id):
        self.title = title
        self.author = author
        self.owner_id = owner_id

    def create_book(self, form_data, image):
        form = BookForm(form_data)
        if form.validate_on_submit():
            filename, file_path = upload(image)
            self.image_path = file_path
            db.session.add(self)
            db.session.commit()
            return jsonify({'book': book_to_dict(self)}), 200
        else:
            return jsonify({'errors': form.errors}), 400
        
    def update_book(self, form_data, image, book_id):
        # form = BookForm(form_data)
        # if form.validate_on_submit():
        #     book = Book.query.get(book_id)
        #     filename, file_path = upload(image)
        #     book.title = form.title.data
        #     book.author = form.author.data
        #     book.image_path = file_path
        #     db.session.add(book)
        #     db.session.commit()
        pass

    def set_as_borrowed(book_id):
        book = Book.query.get(book_id)
        if book:
            book.is_borrowed = True
            db.session.add(book)
            db.session.commit()
            return jsonify({'message': "Book set to borrowed"}), 200
        return jsonify({'error': "Book not found"}), 400

    def delete_book(book_id):
        book_to_delete = Book.query.get(book_id)
        if book_to_delete:
            db.session.delete(book_to_delete)
            db.session.commit()
            return jsonify({'message': "Book deleted successfully"}), 200
        return jsonify({'error': "Book not found"}), 400
    
    def get_book(book_id):
        book = Book.query.get(book_id)
        if book:
            return jsonify({'book': book_to_dict(book)}), 200
        return jsonify({'error': "Book not found"}), 400
    
    def get_user_books(user_id):
        user = User.query.get(user_id)
        if user:
            user_books = user.book      # Can be done by: Book.query.filter_by(user_id=user_id).all()
            books = []
            for book in user_books:
                books.append(book_to_dict(book))
            return jsonify({'books': books}), 200
        return jsonify({'error': "User not found"}), 400 
    
    def get_available_books():
        all_books = Book.query.filter_by(is_borrowed=False).all()
        books = []
        for book in all_books:
            books.append(book_to_dict(book))
        return jsonify({'books': books}), 200