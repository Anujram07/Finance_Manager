import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        eps = 1e-6

        if "annual_income" in X.columns and "current_debt" in X.columns:
            X["income_per_debt"] = X["annual_income"] / (X["current_debt"] + eps)
        else:
            X["income_per_debt"] = 0.0

        if "savings_assets" in X.columns and "current_debt" in X.columns:
            X["assets_per_debt"] = X["savings_assets"] / (X["current_debt"] + eps)
        else:
            X["assets_per_debt"] = 0.0

        if "credit_history_years" in X.columns and "age" in X.columns:
            X["credit_history_per_age"] = X["credit_history_years"] / (X["age"] + eps)
        else:
            X["credit_history_per_age"] = 0.0

        if "annual_income" in X.columns and "loan_amount" in X.columns:
            X["income_per_loan_amount"] = X["annual_income"] / (X["loan_amount"] + eps)
        else:
            X["income_per_loan_amount"] = 0.0

        if "debt_to_income_ratio" in X.columns and "payment_to_income_ratio" in X.columns:
            X["debt_service_pressure"] = (
                X["debt_to_income_ratio"] + X["payment_to_income_ratio"]
            )
        else:
            X["debt_service_pressure"] = 0.0

        return X