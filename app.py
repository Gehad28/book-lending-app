from server import create_app
from flask import send_from_directory
from flask import session, request, jsonify

app = create_app()

@app.before_request
def require_login():
    #########################################################################################################
    allowed_routes = ['auth/login', 'user/register']  # Allow unauthenticated access to login/register
    #########################################################################################################
    if 'user_id' not in session and request.endpoint not in allowed_routes:
        return jsonify({'error': 'Unauthorized'}), 401  # Block access if not logged in

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory("images", filename)

if __name__ == "__main__":
    app.run(debug=True)