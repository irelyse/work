const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Parents Routes ---
app.post('/parents', (req, res) => {
    const { full_name, phone, email, address } = req.body;
    const sql = 'INSERT INTO parents (full_name, phone, email, address) VALUES (?, ?, ?, ?)';
    db.run(sql, [full_name, phone, email, address], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Parent registered successfully' });
    });
});

app.get('/parents', (req, res) => {
    db.all('SELECT * FROM parents', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Prompt mentioned GET/student/:id under parents. 
// I'll implement it as GET /parents/student/:id to find which parent a student belongs to,
// or maybe it meant GET /students/:id? I'll implement GET /students/:id in the students section.
// For now, I'll add GET /parents/:id
app.get('/parents/:id', (req, res) => {
    db.get('SELECT * FROM parents WHERE parent_id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Parent not found' });
        res.json(row);
    });
});

app.delete('/parents/:id', (req, res) => {
    db.run('DELETE FROM parents WHERE parent_id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Parent deleted', changes: this.changes });
    });
});

// --- Students Routes ---
app.post('/students', (req, res) => {
    const { fullname, class_name, parent_id, uses_transport } = req.body;
    const sql = 'INSERT INTO students (fullname, class, parent_id, uses_transport) VALUES (?, ?, ?, ?)';
    db.run(sql, [fullname, class_name, parent_id, uses_transport ? 1 : 0], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Student registered successfully' });
    });
});

app.get('/students', (req, res) => {
    const sql = `
        SELECT s.*, p.full_name as parent_name 
        FROM students s 
        LEFT JOIN parents p ON s.parent_id = p.parent_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/students/:id', (req, res) => {
    const sql = `
        SELECT s.*, p.full_name as parent_name, p.phone as parent_phone
        FROM students s 
        LEFT JOIN parents p ON s.parent_id = p.parent_id
        WHERE s.id = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Student not found' });
        res.json(row);
    });
});

app.put('/students/:id', (req, res) => {
    const { fullname, class_name, parent_id, uses_transport } = req.body;
    const sql = 'UPDATE students SET fullname = ?, class = ?, parent_id = ?, uses_transport = ? WHERE id = ?';
    db.run(sql, [fullname, class_name, parent_id, uses_transport ? 1 : 0, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Student updated', changes: this.changes });
    });
});

app.delete('/students/:id', (req, res) => {
    db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student deleted', changes: this.changes });
    });
});

// --- Bus Routes Routes ---
app.post('/routes', (req, res) => {
    const { route_name, driver_name, monthly_fee } = req.body;
    const sql = 'INSERT INTO bus_routes (route_name, driver_name, monthly_fee) VALUES (?, ?, ?)';
    db.run(sql, [route_name, driver_name, monthly_fee], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Route created successfully' });
    });
});

app.get('/routes', (req, res) => {
    db.all('SELECT * FROM bus_routes', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/routes/:id', (req, res) => {
    const { route_name, driver_name, monthly_fee } = req.body;
    const sql = 'UPDATE bus_routes SET route_name = ?, driver_name = ?, monthly_fee = ? WHERE id = ?';
    db.run(sql, [route_name, driver_name, monthly_fee, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Route updated', changes: this.changes });
    });
});

app.delete('/routes/:id', (req, res) => {
    db.run('DELETE FROM bus_routes WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Route deleted', changes: this.changes });
    });
});

// --- Transport Enrollment Routes ---
app.post('/enrollments', (req, res) => {
    const { student_id, route_id, term } = req.body;
    const sql = 'INSERT INTO transport_enrollments (student_id, route_id, term, status) VALUES (?, ?, ?, ?)';
    db.run(sql, [student_id, route_id, term, 'Pending'], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Student enrolled in route' });
    });
});

app.get('/enrollments', (req, res) => {
    const sql = `
        SELECT te.*, s.fullname as student_name, r.route_name, r.monthly_fee
        FROM transport_enrollments te
        JOIN students s ON te.student_id = s.id
        JOIN bus_routes r ON te.route_id = r.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/enrollments/:id', (req, res) => {
    db.run('DELETE FROM transport_enrollments WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Enrollment deleted', changes: this.changes });
    });
});

// --- Payments Routes ---
app.post('/payments', (req, res) => {
    const { enrollment_id, amount, payment_date, payment_method } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const insertPayment = 'INSERT INTO payments (enrollment_id, amount, payment_date, payment_method) VALUES (?, ?, ?, ?)';
        db.run(insertPayment, [enrollment_id, amount, payment_date, payment_method], function (err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: err.message });
            }

            const updateEnrollment = `
                UPDATE transport_enrollments 
                SET amount_paid = amount_paid + ?, 
                    payment_date = ?,
                    status = CASE 
                        WHEN (amount_paid + ?) >= (SELECT monthly_fee FROM bus_routes WHERE id = transport_enrollments.route_id) THEN 'Paid'
                        ELSE 'Partial'
                    END
                WHERE id = ?
            `;
            db.run(updateEnrollment, [amount, payment_date, amount, enrollment_id], function (err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: err.message });
                }
                db.run('COMMIT');
                res.status(201).json({ message: 'Payment recorded successfully' });
            });
        });
    });
});

app.get('/payments', (req, res) => {
    db.all('SELECT * FROM payments', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/payment/report', (req, res) => {
    const sql = `
        SELECT 
            te.id as enrollment_id,
            s.fullname as student_name,
            p.full_name as parent_name,
            r.route_name,
            r.monthly_fee,
            te.amount_paid,
            (r.monthly_fee - te.amount_paid) as balance,
            te.term,
            te.status
        FROM transport_enrollments te
        JOIN students s ON te.student_id = s.id
        JOIN parents p ON s.parent_id = p.parent_id
        JOIN bus_routes r ON te.route_id = r.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/payments/:id', (req, res) => {
    const { amount, payment_date, payment_method } = req.body;
    const sql = 'UPDATE payments SET amount = ?, payment_date = ?, payment_method = ? WHERE id = ?';
    db.run(sql, [amount, payment_date, payment_method, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Payment updated', changes: this.changes });
    });
});

// --- Dashboard Stats ---
app.get('/dashboard/stats', (req, res) => {
    const stats = {};
    db.get('SELECT COUNT(*) as total_students FROM students WHERE uses_transport = 1', (err, row) => {
        stats.total_students = row.total_students;
        db.get('SELECT COUNT(*) as total_routes FROM bus_routes', (err, row) => {
            stats.total_routes = row.total_routes;
            db.get('SELECT SUM(amount_paid) as total_payments FROM transport_enrollments', (err, row) => {
                stats.total_payments = row.total_payments || 0;
                db.get(`
                    SELECT SUM(r.monthly_fee - te.amount_paid) as outstanding_balance 
                    FROM transport_enrollments te 
                    JOIN bus_routes r ON te.route_id = r.id
                `, (err, row) => {
                    stats.outstanding_balance = row.outstanding_balance || 0;
                    res.json(stats);
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
