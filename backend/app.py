from flask import Flask, app
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import sys
import os
import dotenv

# print ls
sys.path.append(os.getcwd())

from routes import init_routes
from dbextensions import db

# Import the pymysql package and ensure it is used as the MySQL adapter
import pymysql
pymysql.install_as_MySQLdb()

def create_app():
    app = Flask(__name__)

    # Load environment variables
    dotenv.load_dotenv()

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
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

    # Set up CORS
    CORS(app, resources={r"/api/*": {"origins": "https://master-wizard-demo.onrender.com/"}})

    # Initialize routes
    init_routes(app)

    return app

app = create_app()

# if __name__ == '__main__':
#     app.run(debug=False)