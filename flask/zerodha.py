from flask import Flask, redirect, request, jsonify
from kiteconnect import KiteConnect

app = Flask(__name__)

# Replace these with your actual API key and API secret from Zerodha
API_KEY = "j43d9xjrzdhhy1eu"
API_SECRET = "rovatoaws1vsyr59s08gad47zhlpy3iv"

# Initialize KiteConnect instance
kite = KiteConnect(api_key=API_KEY)

@app.route('/login')
def login():
    """
    Redirects the user to the Zerodha login page.
    """
    # Generate login URL and redirect user to Zerodha login page.
    login_url = kite.login_url()
    return redirect(login_url)

@app.route('/callback')
def callback():
    """
    Callback endpoint for Kite Connect.
    After successful login, Zerodha redirects back to this endpoint
    with a request_token which is used to generate an access token.
    """
    request_token = request.args.get("request_token")
    if not request_token:
        return jsonify({"error": "Missing request token"}), 400

    try:
        # Generate session using the request token and your API secret.
        session_data = kite.generate_session(request_token, api_secret=API_SECRET)
        access_token = session_data["access_token"]
        kite.set_access_token(access_token)
        # Optionally, store the access token securely for future API calls.
        return jsonify(session_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/holdings')
def holdings():
    """
    Returns the user's holdings after a successful login.
    Ensure that the session (access token) has been generated via /callback.
    """
    try:
        print("Dome")
        holdings_data = kite.holdings()
        print(holdings_data)
       # print("aa gya", flush=True)

        return jsonify(holdings_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

holdings()
print(holdings_data)

if __name__ == '__main__':
    # Run the Flask app. In production, consider using a production server.
    app.run(debug=True)
