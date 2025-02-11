from server import db
from sqlalchemy.sql import func
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
    notifications = db.relationship('Notification', backref='book', cascade='all, delete')

    def __init__(self, title, author):
        self.title = title
        self.author = author

    def create_book(self, image):
        if image:
            filename, file_path = upload(image)
            self.image_path = file_path
        else:
            return {'errors': {'image': "This field is required"}}
        db.session.add(self)
        db.session.commit()
        return book_to_dict(self)
    
    def update_book(self, form, image):
        if (image):
            filename, file_path = upload(image)
            self.image_path = file_path
        self.title = form['title_up']        
        self.author = form['author_up']
        db.session.commit()
        return book_to_dict(self)
    
    def borrow_book(self):
        self.borrow_req = True
        db.session.add(self)
        db.session.commit()
        return book_to_dict(self)

    def set_as_borrowed(self, borrower_id, flag):
        self.is_borrowed = flag
        self.borrow_req = flag
        if flag and borrower_id:
            self.borrowed_by = borrower_id
        else:
            self.borrowed_by = None
        db.session.commit()
        return {'message': "Book updated"}

    def delete_book(self):
        db.session.delete(self)
        db.session.commit()
        return {'message': "Book deleted successfully"}
    
    @staticmethod
    def get_book(book_id):
        book = Book.query.get(book_id)
        owner = to_dict(book.owner)
        book = book_to_dict(book)
        book.update({'owner': owner})
        return book
    
    @staticmethod
    def get_user_books(user_id):
        user = User.query.get(user_id)
        user_books = user.book  
        return [{'owner': to_dict(user), **book_to_dict(book)} for book in user_books]
    
    @staticmethod
    def get_borrowed_books(user_id):
        user_books = Book.query.filter_by(borrowed_by=user_id).all()
        return [{'owner': to_dict(User.query.get(book.owner_id)), **book_to_dict(book)} for book in user_books]
    
    @staticmethod
    def get_available_books(user_id):
        all_books = Book.query.filter(Book.is_borrowed == False, Book.owner_id != user_id).all()
        return [{'owner': to_dict(book.owner), **book_to_dict(book)} for book in all_books]