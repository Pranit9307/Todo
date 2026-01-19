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

        // Create table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                body TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            )
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Table ready');

                // Add completed column if it doesn't exist
                const checkColumnQuery = `
                    SHOW COLUMNS FROM posts LIKE 'completed'
                `;

                db.query(checkColumnQuery, (err, result) => {
                    if (err) {
                        console.error('Error checking column:', err);
                    } else if (result.length === 0) {
                        // Column doesn't exist, add it
                        const addColumnQuery = `
                            ALTER TABLE posts 
                            ADD COLUMN completed BOOLEAN DEFAULT FALSE
                        `;

                        db.query(addColumnQuery, (err, result) => {
                            if (err) {
                                console.error('Error adding column:', err);
                            } else {
                                console.log('Database schema updated');
                            }
                        });
                    } else {
                        // Check for dueDate column
                        const checkDueDateQuery = "SHOW COLUMNS FROM posts LIKE 'dueDate'";
                        db.query(checkDueDateQuery, (err, result) => {
                            if (err) console.error('Error checking dueDate column:', err);
                            else if (result.length === 0) {
                                const addDueDateQuery = "ALTER TABLE posts ADD COLUMN dueDate DATE NULL";
                                db.query(addDueDateQuery, (err, res) => {
                                    if (err) console.error('Error adding dueDate column:', err);
                                    else console.log('Added dueDate column');
                                });
                            }
                        });
                    }
                });
            }
        });
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
    const { title, body, dueDate } = req.body;
    db.query('INSERT INTO posts (title, body, completed, dueDate) VALUES (?, ?, ?, ?)', [title, body, false, dueDate || null], (err, result) => {
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
                dueDate
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



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});