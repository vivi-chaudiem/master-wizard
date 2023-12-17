#!/bin/bash

# Change to the backend directory
cd /Users/vivi/git/master/master-wizard

# Launch the Flask app
/usr/bin/python3 /Users/vivi/git/master/master-wizard/backend/app.py &

# Change to the frontend directory
cd /Users/vivi/git/master/master-wizard/frontend

# Launch the npm development server
npm run dev
