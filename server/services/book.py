from server import db
from sqlalchemy.sql import func
from server.forms import BookForm, UpdateBookForm
from flask import jsonify, request, session
from server.helper import book_to_dict, upload, to_dict
from server.services.user import User

class Book(db.Model):
    __tablename__ = 'book'

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    is_borrowed = db.Column(db.Boolean, default=False, nullable=False)
    borrow_req = db.Column(db.Boolean, default=False, nullable=False)
    borrowed_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    borrowed_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    owner = db.relationship('User', back_populates='book', foreign_keys=[owner_id])
    borrower = db.relationship('User', foreign_keys=[borrowed_by])

    def __init__(self, title, author):
        self.title = title
        self.author = author
        # self.owner_id = owner_id

    def create_book(self, form_data, image):
        form = BookForm(form_data)
        if form.validate_on_submit():
            if 'user' in session:
                user = session['user']
                self.owner_id = user['user_id']
                if image:
                    filename, file_path = upload(image)
                    self.image_path = file_path
                else:
                    return jsonify({'errors': {'image': "This field is required"}}), 400
                db.session.add(self)
                db.session.commit()
                return jsonify({'book': book_to_dict(self), 'message': "Book added successfully"}), 200
            return jsonify({'error': "Not authorized"}), 401
        else:
            return jsonify({'errors': form.errors}), 400
    
    def update_book(form_data, image):
        form = UpdateBookForm(form_data)
        if form.validate_on_submit():
            book = Book.query.get(request.args.get("book_id"))
            if (image):
                filename, file_path = upload(image)
                book.image_path = file_path
            book.title = form.title_up.data        # Already set in Book(data['title']) !!!!!!
            book.author = form.author_up.data
            db.session.add(book)
            db.session.commit()
            return jsonify({'book': book_to_dict(book), 'message': "Book updated successfully"}), 200
        return jsonify({'errors': form.errors})
    
    def borrow_book(book_id):
        book = Book.query.get(book_id)
        if book:
            book.borrow_req = True
            db.session.add(book)
            db.session.commit()

    def set_as_borrowed(book_id, borrower_id, flag):
        book = Book.query.get(book_id)
        if book:
            book.is_borrowed = flag
            book.borrow_req = flag
            if flag and borrower_id:
                book.borrowed_by = borrower_id
            else:
                book.borrowed_by = None
            db.session.add(book)
            db.session.commit()
            return jsonify({'message': "Book updated"}), 200
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
        owner = to_dict(book.owner)
        book = book_to_dict(book)
        book.update({'owner': owner})
        if book:
            return jsonify({'book': book}), 200
        return jsonify({'error': "Book not found"}), 400
    
    def get_user_books():
        user = User.query.get(session['user']['user_id'])
        if user:
            user_books = user.book  
            books = []
            for book in user_books:
                book = book_to_dict(book)
                book.update({'owner': to_dict(user)})
                books.append(book)
            return jsonify({'books': books}), 200
        return jsonify({'error': "User not found"}), 400 
    
    def get_available_books():
        user_id = session['user']['user_id']
        all_books = Book.query.filter(Book.is_borrowed == False, Book.owner_id != user_id).all()
        books = []
        for book in all_books:
            owner = to_dict(book.owner)
            book = book_to_dict(book)
            book.update({'owner': owner})
            books.append(book)
        return jsonify({'books': books}), 200