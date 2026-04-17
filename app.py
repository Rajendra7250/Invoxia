from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = 'aips.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
        
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', (email, password, name))
        conn.commit()
        conn.close()
        return jsonify({'message': 'System Access Granted (User registered)'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Interface Profile Already Exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email=? AND password=?', (email, password))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify({'message': 'System Connection Established', 'user': {'email': email, 'name': user[3]}}), 200
    else:
        return jsonify({'error': 'Invalid Cyber Credentials'}), 401

if __name__ == '__main__':
    init_db()
    print("AIPS Core AI Backend successfully initiated on port 5000.")
    app.run(port=5000, debug=True)
