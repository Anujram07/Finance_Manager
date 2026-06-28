from flask import Flask, request, jsonify
import pandas as pd
import joblib
import traceback

from sklearn.base import (
    BaseEstimator,
    TransformerMixin
)

app = Flask(__name__)

# ==================================================
# CUSTOM FEATURE ENGINEERING CLASS
# ==================================================

class FeatureEngineer(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def transform(self, X):

        X = X.copy()

        eps = 1e-6

        if "annual_income" in X.columns and "current_debt" in X.columns:
            X["income_per_debt"] = (
                X["annual_income"] /
                (X["current_debt"] + eps)
            )
        else:
            X["income_per_debt"] = 0.0

        if "savings_assets" in X.columns and "current_debt" in X.columns:
            X["assets_per_debt"] = (
                X["savings_assets"] /
                (X["current_debt"] + eps)
            )
        else:
            X["assets_per_debt"] = 0.0

        if (
            "credit_history_years" in X.columns
            and "age" in X.columns
        ):
            X["credit_history_per_age"] = (
                X["credit_history_years"] /
                (X["age"] + eps)
            )
        else:
            X["credit_history_per_age"] = 0.0

        if (
            "annual_income" in X.columns
            and "loan_amount" in X.columns
        ):
            X["income_per_loan_amount"] = (
                X["annual_income"] /
                (X["loan_amount"] + eps)
            )
        else:
            X["income_per_loan_amount"] = 0.0

        if (
            "debt_to_income_ratio" in X.columns
            and "payment_to_income_ratio" in X.columns
        ):
            X["debt_service_pressure"] = (
                X["debt_to_income_ratio"] +
                X["payment_to_income_ratio"]
            )
        else:
            X["debt_service_pressure"] = 0.0

        return X


# ==================================================
# LOAD MODEL
# ==================================================

print("Loading Loan Eligibility Model...")

model = joblib.load(
    "models/loan_eligibility_pipeline.joblib"
)

print("Model Loaded Successfully")

print("Model Classes:", model.classes_)


# ==================================================
# PREDICTION ROUTE
# ==================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        print("\n========== RECEIVED DATA ==========")
        print(data)
        print("===================================\n")

        # ------------------------------------------------
        # BASIC INPUTS
        # ------------------------------------------------

        age = float(data["age"])

        occupation_status = data["occupation_status"]

        years_employed = float(
            data["years_employed"]
        )

        # If frontend sends monthly income
        annual_income = (
            float(data["annual_income"])
        )

        print("Annual Income:", annual_income)

        credit_score = float(
            data["credit_score"]
        )

        credit_history_years = float(
            data["credit_history_years"]
        )

        savings_assets = float(
            data["savings_assets"]
        )

        current_debt = float(
            data["current_debt"]
        )

        defaults_on_file = int(
            data["defaults_on_file"]
        )

        delinquencies_last_2yrs = int(
            data["delinquencies_last_2yrs"]
        )

        derogatory_marks = int(
            data["derogatory_marks"]
        )

        product_type = data["product_type"]

        loan_intent = data["loan_intent"]

        loan_amount = float(
            data["loan_amount"]
        )

        interest_rate = float(
            data["interest_rate"]
        )

        # ------------------------------------------------
        # DYNAMIC FEATURE CALCULATIONS
        # ------------------------------------------------

        monthly_income = max(annual_income / 12, 1)

        monthly_rate = (
            interest_rate / 100
        ) / 12

        # Approximate EMI

        if monthly_rate > 0:

            emi = (
                loan_amount *
                monthly_rate *
                (1 + monthly_rate) ** 12
            ) / (
                ((1 + monthly_rate) ** 12) - 1
            )

        else:

            emi = loan_amount / 12

# Prevent divide-by-zero crashes
        safe_annual_income = max(annual_income, 1)

        debt_to_income_ratio = (
            current_debt /
            safe_annual_income
        )

        loan_to_income_ratio = (
            loan_amount /
            safe_annual_income
        )

        payment_to_income_ratio = (
            emi /
            monthly_income
        )

        # ------------------------------------------------
        # MODEL INPUT
        # ------------------------------------------------

        input_data = pd.DataFrame([{

            "age": age,

            "occupation_status":
                occupation_status,

            "years_employed":
                years_employed,

            "annual_income":
                annual_income,

            "credit_score":
                credit_score,

            "credit_history_years":
                credit_history_years,

            "savings_assets":
                savings_assets,

            "current_debt":
                current_debt,

            "defaults_on_file":
                defaults_on_file,

            "delinquencies_last_2yrs":
                delinquencies_last_2yrs,

            "derogatory_marks":
                derogatory_marks,

            "product_type":
                product_type,

            "loan_intent":
                loan_intent,

            "loan_amount":
                loan_amount,

            "interest_rate":
                interest_rate,

            "debt_to_income_ratio":
                debt_to_income_ratio,

            "loan_to_income_ratio":
                loan_to_income_ratio,

            "payment_to_income_ratio":
                payment_to_income_ratio

        }])

        # ------------------------------------------------
        # PREDICT
        # ------------------------------------------------

        prediction = model.predict(
            input_data
        )[0]

        print("Prediction:", prediction)

        probability = 0

        if hasattr(model, "predict_proba"):

            probs = model.predict_proba(
                input_data
            )[0]

            print("Raw Probabilities:", probs)

            probability = round(
                float(probs[1]) * 100,
                2
            )

        print("Final Probability:", probability)

        probability = round(
                float(
                    model.predict_proba(
                        input_data
                    )[0][1]
                ) * 100,
                2
            )

        # ------------------------------------------------
        # RESPONSE
        # ------------------------------------------------

        return jsonify({

            "prediction": int(prediction),

            "probability": probability,

            "emi": round(emi),

            "debt_to_income_ratio":
                round(
                    debt_to_income_ratio,
                    4
                ),

            "loan_to_income_ratio":
                round(
                    loan_to_income_ratio,
                    4
                ),

            "payment_to_income_ratio":
                round(
                    payment_to_income_ratio,
                    4
                )

        })

    except Exception as e:

        print("\n========== FLASK ERROR ==========")
        traceback.print_exc()
        print("=================================\n")

        return jsonify({
            "error": str(e)
        }), 500


# ==================================================
# RUN SERVER
# ==================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )