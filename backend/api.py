from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report

app = Flask(__name__)

# Enable CORS for the app (this will allow all domains to access the API)
CORS(app, resources={r"/fraud-detection": {"origins": "*"}})  # Apply CORS only to the specific route if needed

# Define the function for fraud prediction
def predict_fraud(transaction_data):
    try:
        with open('fraud_detect.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        
        with open('label_encoder.pkl', 'rb') as encoder_file:
            encoders = pickle.load(encoder_file)
        
        with open('feature_scaler.pkl', 'rb') as scaler_file:
            scaler = pickle.load(scaler_file)

        transaction_data['type_encoded'] = encoders['type_encoder'].transform(transaction_data['type'])
        transaction_data['balance_change_ratio'] = (transaction_data['newbalanceOrig'] - transaction_data['oldbalanceOrg']) / (transaction_data['oldbalanceOrg'] + 1e-5)
        
        features = ['amount', 'type_encoded', 'oldbalanceOrg', 'newbalanceOrig', 'balance_change_ratio']
        X = transaction_data[features]
        X_scaled = scaler.transform(X)

        fraud_probability = model.predict_proba(X_scaled)[:, 1]
        return fraud_probability[0]
    
    except Exception as e:
        return f"Prediction error: {str(e)}"

# Define the Flask routes
@app.route('/fraud-detection', methods=['POST'])
def predict():
    try:
        # Get the transaction data from the request
        data = request.json
        transaction_data = pd.DataFrame([data])

        # Call the predict function
        fraud_probability = predict_fraud(transaction_data)
        
        return jsonify({
            "fraud_probability": fraud_probability,
            "is_fraudulent": fraud_probability >= 0.5  # Fraud is predicted if probability >= 50%
        })
    
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
