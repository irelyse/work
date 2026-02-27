const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'classic_transport_db.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Parents table
        db.run(`CREATE TABLE IF NOT EXISTS parents (
            parent_id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name VARCHAR(150) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(100),
            address VARCHAR(150)
        )`);

        // Students table
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname VARCHAR(150) NOT NULL,
            class VARCHAR(50),
            parent_id INTEGER,
            uses_transport BOOLEAN DEFAULT 0,
            FOREIGN KEY (parent_id) REFERENCES parents (parent_id) ON DELETE SET NULL
        )`);

        // Bus Routes table
        db.run(`CREATE TABLE IF NOT EXISTS bus_routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route_name VARCHAR(100) NOT NULL,
            driver_name VARCHAR(100),
            monthly_fee DECIMAL(10,2) NOT NULL
        )`);

        // Transport Enrollments table
        db.run(`CREATE TABLE IF NOT EXISTS transport_enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            route_id INTEGER,
            amount_paid DECIMAL(10,2) DEFAULT 0,
            payment_date DATE,
            term VARCHAR(20),
            status VARCHAR(50),
            FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
            FOREIGN KEY (route_id) REFERENCES bus_routes (id) ON DELETE SET NULL
        )`);
        
        // Payments table (for history and tracking)
        db.run(`CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enrollment_id INTEGER,
            amount DECIMAL(10,2),
            payment_date DATE,
            payment_method VARCHAR(50),
            FOREIGN KEY (enrollment_id) REFERENCES transport_enrollments (id) ON DELETE CASCADE
        )`);

        console.log('Database tables initialized.');
    });
}

module.exports = db;
