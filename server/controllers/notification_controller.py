from flask import Blueprint, request, session
from server.services.notification import Notification

not_api = Blueprint('notification', __name__, url_prefix='/notification')

@not_api.route('/send-notification')
def send_notification():
    data = request.args.to_dict()
    notification = Notification(data['book_id'], data['borrower_id'], data['owner_id'])
    notification.create_notification()
    return notification.send_notification()

@not_api.route('/mark-as-read')
def mark_as_read():
    notification_id = request.args.get('id')
    return Notification.update_status(notification_id)