from flask import Flask, request, jsonify
from SmartApi import SmartConnect

app = Flask(__name__)

# Initialize Smart API client
api_key = 'jAAvUq0N'
client = SmartConnect(api_key)

# Endpoint to place an order
@app.route('/place_order', methods=['POST'])
def place_order():
    data = request.json
    order_params = {
        'variety': data['variety'],
        'tradingsymbol': data['tradingsymbol'],
        'symboltoken': data['symboltoken'],
        'transactiontype': data['transactiontype'],
        'exchange': data['exchange'],
        'ordertype': data['ordertype'],
        'producttype': data['producttype'],
        'duration': data['duration'],
        'price': data['price'],
        'squareoff': data.get('squareoff', '0'),
        'stoploss': data.get('stoploss', '0'),
        'quantity': data['quantity']
    }
    try:
        order_id = client.placeOrder(order_params)
        return jsonify({'status': 'success', 'order_id': order_id})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Endpoint to modify an order
@app.route('/modify_order', methods=['POST'])
def modify_order():
    data = request.json
    order_params = {
        'orderid': data['orderid'],
        'variety': data['variety'],
        'tradingsymbol': data['tradingsymbol'],
        'symboltoken': data['symboltoken'],
        'transactiontype': data['transactiontype'],
        'exchange': data['exchange'],
        'ordertype': data['ordertype'],
        'producttype': data['producttype'],
        'duration': data['duration'],
        'price': data['price'],
        'quantity': data['quantity']
    }
    try:
        response = client.modifyOrder(order_params)
        return jsonify({'status': 'success', 'response': response})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Endpoint to cancel an order
@app.route('/cancel_order', methods=['POST'])
def cancel_order():
    data = request.json
    order_id = data['orderid']
    variety = data['variety']
    try:
        response = client.cancelOrder(order_id, variety)
        return jsonify({'status': 'success', 'response': response})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
