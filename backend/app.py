from flask import Flask, app
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import sys
import os

# print ls
sys.path.append(os.getcwd())

from backend.routes import init_routes
from backend.dbextensions import db
from backend import dbmodels

def create_app():
    app = Flask(__name__)

    # Set up database
    basedir = os.path.abspath(os.path.dirname(__file__))

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'wizard-database.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize app with database and create all tables
    db.init_app(app)

    # Debug
    with app.app_context():
        try:
            db.drop_all()
            db.create_all()
            print("Tables dropped and created successfully.")
        except Exception as e:
            print(f"Error occurred: {e}")

    # Print the database path
    print("Database Path:", basedir)

    # Set up CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize routes
    init_routes(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=8080)