from server import db
from sqlalchemy.sql import func
from server.forms import BookForm, UpdateBookForm
from flask import jsonify, request, session
from server.helper import notification_to_dict
from server.services.user import User

class Notification(db.Model):
    __tablename__ = "notification"

    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='Unread', nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    book = db.relationship('Book', backref='notification')
    owner = db.relationship('User', backref='recieved_notifications', foreign_keys=[owner_id])
    borrower = db.relationship('User', backref='sent_notifications', foreign_keys=[borrower_id])

    def __init__(self, book_id,owner_id):
        self.book_id = book_id
        self.owner_id = owner_id

    def create_notification(self):
        self.borrower_id = session['user']['user_id']
        borrower = User.query.get(self.borrower_id)
        self.message = f'{borrower.f_name} {borrower.l_name} wants to borrow your book, contact them on: \n email: {borrower.email} \n phone: {borrower.phone}'
        db.session.add(self)
        db.session.commit()

    def send_notification(self):
        borrower = User.query.get(self.borrower_id)
        if borrower:
            notifications = borrower.sent_notifications
            notifications_list = []
            for notification in notifications:
                notifications_list.append(notification_to_dict(notification))
            return jsonify({'notifications': notifications_list}), 200
        return jsonify({'error': "User not found"}), 400
    
    def get_notifications():
        user = User.query.get(session['user']['user_id'])
        if user:
            notifications = user.recieved_notifications
            notifications_list = []
            for notification in notifications:
                notifications_list.append(notification_to_dict(notification))
            return jsonify({'notifications': notifications_list}), 200
        return jsonify({'error': "User not found"}), 400
    
    def update_status(id):
        notification = Notification.query.get(id)
        if notification and session['user']['user_id'] == notification.owner_id:
            notification.status = "Read"
            db.session.add(notification)
            db.session.commit()
            return jsonify({'notification': notification_to_dict(notification),'message': "Notification updated successfuly"}), 200
        return jsonify({'error': "Notification not found"}), 400