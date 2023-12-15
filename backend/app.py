from flask import Flask, app
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import sys
import os

# print ls
sys.path.append(os.getcwd())

from backend.routes import init_routes

def create_app():
    basedir = os.path.abspath(os.path.dirname(__file__))

    app = Flask(__name__)

    # Set up database
    app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'wizard-database.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize database and create tables
    db = SQLAlchemy(app)

    with app.app_context():
        db.create_all()

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