from flask import Blueprint, request
from server.services.notification import Notification

not_api = Blueprint('notification', __name__, url_prefix='/notification')

@not_api.route('/send-notification', methods=['POST'])
def send_notification():
    data = request.args.to_dict()
    notification = Notification(data['book_id'], data['owner_id'])
    notification.create_notification()
    return notification.send_notification()

@not_api.route('/get-notifications')
def get_notifications():
    return Notification.get_notifications()

@not_api.route('/mark-as-read', methods=['POST'])
def mark_as_read():
    notification_id = request.args.get('id')
    return Notification.update_status(notification_id)