# file_path = 'PS_20174392719_1491204439457_log.csv'

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

def train_and_save_fraud_model(file_path, sample_size=10000):
    try:
        # Step 1: Load and sample the data
        print("Step 1: Loading and sampling data...")
        df = pd.read_csv(file_path)
        
        # Sample the dataset
        df_sampled = df.sample(n=min(sample_size, len(df)), random_state=42)
        
        print(f"Total original rows: {len(df)}")
        print(f"Sampled rows: {len(df_sampled)}")
        
        # Step 2: Preprocessing
        print("\nStep 2: Preprocessing...")
        
        # Encode categorical variables
        le_type = LabelEncoder()
        df_sampled['type_encoded'] = le_type.fit_transform(df_sampled['type'])
        
        # Create additional features
        df_sampled['balance_change_ratio'] = (df_sampled['newbalanceOrig'] - df_sampled['oldbalanceOrg']) / (df_sampled['oldbalanceOrg'] + 1e-5)
        
        # Select features
        features = [
            'amount', 
            'type_encoded', 
            'oldbalanceOrg', 
            'newbalanceOrig', 
            'balance_change_ratio'
        ]
        
        # Prepare features and target
        X = df_sampled[features]
        y = df_sampled['isFraud']
        
        # Step 3: Split the data
        print("\nStep 3: Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Step 4: Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Step 5: Train the model
        print("\nStep 4: Training model...")
        model = RandomForestClassifier(
            n_estimators=100, 
            random_state=42, 
            class_weight='balanced'
        )
        model.fit(X_train_scaled, y_train)
        
        # Step 6: Evaluate the model
        print("\nStep 5: Model Evaluation...")
        y_pred = model.predict(X_test_scaled)
        
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Step 7: Save the model and label encoder
        print("\nStep 6: Saving Model...")
        
        # Save the trained model
        with open('fraud_detect.pkl', 'wb') as model_file:
            pickle.dump(model, model_file)
        print("Model saved as fraud_detect.pkl")
        
        # Save the label encoder
        with open('label_encoder.pkl', 'wb') as encoder_file:
            pickle.dump({
                'type_encoder': le_type
            }, encoder_file)
        print("Label encoder saved as label_encoder.pkl")
        
        # Save the scaler
        with open('feature_scaler.pkl', 'wb') as scaler_file:
            pickle.dump(scaler, scaler_file)
        print("Feature scaler saved as feature_scaler.pkl")
        
        return model, le_type, scaler
    
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

# Run the function with your CSV file
train_and_save_fraud_model('PS_20174392719_1491204439457_log.csv', sample_size=10000)

# Prediction function to use the saved model
def predict_fraud(transaction_data):
    try:
        # Load the saved model, label encoder, and scaler
        with open('fraud_detect.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        
        with open('label_encoder.pkl', 'rb') as encoder_file:
            encoders = pickle.load(encoder_file)
        
        with open('feature_scaler.pkl', 'rb') as scaler_file:
            scaler = pickle.load(scaler_file)
        
        # Preprocess the transaction
        transaction_data['type_encoded'] = encoders['type_encoder'].transform(transaction_data['type'])
        
        # Create balance change ratio feature
        transaction_data['balance_change_ratio'] = (transaction_data['newbalanceOrig'] - transaction_data['oldbalanceOrg']) / (transaction_data['oldbalanceOrg'] + 1e-5)
        
        # Select features
        features = [
            'amount', 
            'type_encoded', 
            'oldbalanceOrg', 
            'newbalanceOrig', 
            'balance_change_ratio'
        ]
        
        # Prepare features
        X = transaction_data[features]
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Predict fraud probability
        fraud_probability = model.predict_proba(X_scaled)[:, 1]
        
        return fraud_probability
    
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()

# Example of how to use the prediction function
# Uncomment and modify as needed
# sample_transaction = pd.DataFrame({
#     'amount': [5000],
#     'type': ['TRANSFER'],
#     'oldbalanceOrg': [10000],
#     'newbalanceOrig': [5000]
# })
# fraud_prob = predict_fraud(sample_transaction)
# print("Fraud Probability:", fraud_prob)