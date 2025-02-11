from server import create_app
from flask import send_from_directory
from flask import session, request, jsonify

app = create_app()

@app.before_request
def require_login():
    if request.path in ['/auth/login', '/user/register', '/auth/is_logged_in']:  
        return  # Allow access

    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401  # Block access if not logged in

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory("images", filename)

if __name__ == "__main__":
    app.run(debug=True)