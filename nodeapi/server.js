const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 8000;


app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranit@123',
    database: 'Pranit',
    dateStrings: true
});

app.use(cors({
    origin: 'http://localhost:4200'
}));

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');

    }
});

app.get('/api/posts', (req, res) => {
    let query = 'SELECT * FROM posts';
    const params = [];
    const conditions = [];

    if (req.query.completed) {
        conditions.push('completed = ?');
        params.push(req.query.completed === 'true');
    }

    if (req.query.dueDate) {
        conditions.push('dueDate = ?');
        params.push(req.query.dueDate);
    }

    if (req.query.username) {
        conditions.push('username = ?');
        params.push(req.query.username);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id DESC'; // Show newest first consistently

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).send('Error fetching posts');
        } else {
            res.json(results);
        }
    });
});


app.get('/api/posts/:id', (req, res) => {
    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching post:', err);
            res.status(500).send('Error fetching post');
        }
        else {
            res.json(results[0]);
        }
    });
});



app.put('/api/posts/:id', (req, res) => {
    const { title, body, completed, dueDate } = req.body;
    db.query('UPDATE posts SET title = ?, body = ?, completed = ?, dueDate = ? WHERE id = ?', [title, body, completed || false, dueDate || null, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating todo:', err);
            res.status(500).json({ error: 'Error updating todo' });
        }
        else {
            res.json({
                message: 'todo updated successfully',
                id: req.params.id,
                title,
                body,
                completed: completed || false,
                dueDate
            });
        }
    });
});


app.post('/api/posts', (req, res) => {
    const { title, body, dueDate, username } = req.body;
    db.query('INSERT INTO posts (title, body, completed, dueDate, username) VALUES (?, ?, ?, ?, ?)', [title, body, false, dueDate || null, username || 'pccoe'], (err, result) => {
        if (err) {
            console.error('Error creating todo:', err);
            res.status(500).json({ error: 'Error creating todo' });
        }
        else {
            res.status(201).json({
                message: 'todo created successfully',
                id: result.insertId,
                title,
                body,
                completed: false,
                dueDate,
                username
            });
        }
    });
});


app.delete('/api/posts/:id', (req, res) => {
    db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting todo:', err);
            res.status(500).json({ error: 'Error deleting todo' });
        }
        else {
            res.json({
                message: 'todo deleted successfully',
                id: req.params.id
            });
        }
    });
});



app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});