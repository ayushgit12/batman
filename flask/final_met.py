import pandas as pd
import yfinance as yf
from SmartApi import SmartConnect
import pyotp
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
# User Credentials
load_dotenv()  # Load variables from .env file

api_key = os.getenv("API_KEY")
client_id = os.getenv("CLIENT_ID")
password = os.getenv("PASSWORD")
totp_secret = os.getenv("TOTP_SECRET")

# Initialize SmartConnect
smart_api = SmartConnect(api_key=api_key)

# Generate TOTP
totp = pyotp.TOTP(totp_secret).now()

# Login
login_response = smart_api.generateSession(client_id, password, totp)
if login_response['status']:
    print("Login Successful")
else:
    print("Login Failed:", login_response['message'])
    exit()

# Fetch Holdings
holdings = smart_api.holding()
holdings_df = pd.DataFrame(holdings['data'])
user_stocks = holdings_df['tradingsymbol'].tolist()
print("Angel Broking symbols:", user_stocks)

# Define a mapping function to convert from Angel Broking format to yfinance format
def convert_to_yfinance_symbol(angel_symbol):
    # Remove the -EQ suffix
    base_symbol = angel_symbol.replace("-EQ", "")
    
    # Dictionary of US/international stocks that need special handling
    us_stocks = {
        "MSFT": "MSFT",  # Microsoft
        "AAPL": "AAPL",  # Apple
        "GOOGL": "GOOGL",  # Google
        "AMZN": "AMZN",  # Amazon
        # Add more as needed
    }
    
    # Check if it's a US stock
    if base_symbol in us_stocks:
        return us_stocks[base_symbol]
    
    # For Indian stocks, append .NS (for NSE)
    return f"{base_symbol}.NS"

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

def fetch_financial_metrics(angel_symbol, holding_data):
    """
    Fetches financial metrics for a given ticker symbol using yfinance.
    Includes holding-specific data like quantity, invested value, and P&L.
    
    Parameters:
    angel_symbol (str): The original symbol from Angel Broking
    holding_data (dict): Data about this specific holding from Angel Broking API
    """
    # Convert to yfinance symbol
    ticker_symbol = convert_to_yfinance_symbol(angel_symbol)
    
    # Fetch data from yfinance
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    
    # Get holding-specific data
    quantity = int(holding_data.get('quantity', 0))
    avg_price = float(holding_data.get('averageprice', 0))
    current_price = info.get('currentPrice', 0)
    if current_price is None:  # Handle None values
        current_price = float(holding_data.get('ltp', 0))  # Use last traded price from Angel if yfinance returns None
    
    # Calculate invested value
    invested_value = avg_price * quantity
    
    # Calculate current value
    current_value = current_price * quantity
    
    # Calculate P&L in amount and percentage
    pnl_amount = current_value - invested_value
    pnl_percentage = (pnl_amount / invested_value) * 100 if invested_value > 0 else 0
    
    metrics = {
        'Ticker': ticker_symbol,
        'Company Name': info.get('longName'),
        'Sector': info.get('sector'),
        'Industry': info.get('industry'),
        'Market Cap': info.get('marketCap'),
        'P/E Ratio': info.get('trailingPE'),
        'P/B Ratio': info.get('priceToBook'),
        'Dividend Yield': info.get('dividendYield'),
        'Return on Equity (ROE)': info.get('returnOnEquity'),
        'Debt to Equity Ratio': info.get('debtToEquity'),
        'Current Price': current_price,
        '52-Week High': info.get('fiftyTwoWeekHigh'),
        '52-Week Low': info.get('fiftyTwoWeekLow'),
        'Beta': info.get('beta'),
        'EPS (TTM)': info.get('trailingEps'),
        'Book Value': info.get('bookValue'),
        'Operating Margin': info.get('operatingMargins'),
        'Profit Margin': info.get('profitMargins'),
        'Revenue': info.get('totalRevenue'),
        'Gross Profit': info.get('grossProfits'),
        'Free Cash Flow': info.get('freeCashflow'),
        'Return on Assets (ROA)': info.get('returnOnAssets'),
        'EBITDA': info.get('ebitda'),
        'Quick Ratio': info.get('quickRatio'),
        'Current Ratio': info.get('currentRatio'),
        'Total Debt': info.get('totalDebt'),
        'Total Cash': info.get('totalCash'),
        'Shares Outstanding': info.get('sharesOutstanding'),
        'Float Shares': info.get('floatShares'),
        'Held by Insiders': info.get('heldPercentInsiders'),
        'Held by Institutions': info.get('heldPercentInstitutions'),
        'Short Ratio': info.get('shortRatio'),
        'Short Percentage of Float': info.get('shortPercentOfFloat'),
        'Analyst Recommendation Mean': info.get('recommendationMean'),
        'Analyst Recommendation Key': info.get('recommendationKey'),
        'Target Mean Price': info.get('targetMeanPrice'),
        'Target High Price': info.get('targetHighPrice'),
        'Target Low Price': info.get('targetLowPrice'),
        'Number of Analysts': info.get('numberOfAnalystOpinions'),
        'Earnings Growth': info.get('earningsGrowth'),
        'Revenue Growth': info.get('revenueGrowth'),
        'Gross Margins': info.get('grossMargins'),
        'EBITDA Margins': info.get('ebitdaMargins'),
        'Operating Margins': info.get('operatingMargins'),
        'Financial Currency': info.get('financialCurrency'),
        # Add the portfolio-specific fields needed by the frontend
        'Holding Quantity': quantity,
        'Average Price': avg_price,
        'Invested Value': invested_value,
        'Current Value': current_value,
        'PnL': pnl_amount,
        'PnL Percentage': pnl_percentage,
        # Calculate potential upside
        'Potential Upside': ((info.get('targetMeanPrice', current_price) / current_price) - 1) * 100 if current_price > 0 else 0
    }
    return metrics

@app.route('/')
def index():
    """
    Serves the React frontend
    """
    return app.send_static_file('index.html')

@app.route('/api/stocks')
def get_stocks():
    """
    API endpoint that returns stock metrics data as JSON
    """
    holdings_data = []
    try:
        # Get detailed holdings data from the API
        holdings_response = smart_api.holding()
        if holdings_response['status']:
            # Process each holding
            for holding in holdings_response['data']:
                angel_symbol = holding['tradingsymbol']
                metrics = fetch_financial_metrics(angel_symbol, holding)
                holdings_data.append(metrics)
        else:
            print(f"Error fetching holdings: {holdings_response['message']}")
            
        return jsonify(holdings_data)
    except Exception as e:
        # Log the error
        print(f"Error fetching stock data: {str(e)}")
        # Return an empty array, the frontend will use sample data
        return jsonify([])

# Catch-all route to handle React Router paths
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)