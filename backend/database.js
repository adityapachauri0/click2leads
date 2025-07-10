const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database connection
const dbPath = path.join(__dirname, 'click2leads.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating admin_users table:', err);
      });

      // Content table for storing editable content
      db.run(`
        CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          section TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(section, key)
        )
      `, (err) => {
        if (err) console.error('Error creating content table:', err);
      });

      // Insert default admin user if none exists
      db.get("SELECT COUNT(*) as count FROM admin_users", [], (err, row) => {
        if (err) {
          console.error('Error checking admin users:', err);
          return;
        }
        
        if (row.count === 0) {
          const defaultPassword = 'admin123'; // Change this!
          const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
          
          db.run(
            "INSERT INTO admin_users (username, password) VALUES (?, ?)",
            ['admin', hashedPassword],
            (err) => {
              if (err) {
                console.error('Error creating default admin:', err);
              } else {
                console.log('Default admin user created (username: admin, password: admin123)');
                console.log('⚠️  Please change the default password immediately!');
              }
            }
          );
        }
      });

      // Insert default content if none exists
      const defaultContent = [
        // Hero Section
        { section: 'hero', key: 'title', value: 'A Lead Generation Powerhouse' },
        { section: 'hero', key: 'subtitle', value: 'Partner for Life' },
        { section: 'hero', key: 'stats_spending', value: '£28 million' },
        { section: 'hero', key: 'stats_leads', value: '4.7 million leads' },
        { section: 'hero', key: 'cta_primary', value: 'Talk to a Specialist' },
        { section: 'hero', key: 'cta_secondary', value: 'Explore Our Work' },
        
        // About Section
        { section: 'about', key: 'title', value: 'About Click2Leads' },
        { section: 'about', key: 'description', value: 'We are a lead generation company with proven results.' },
        
        // Services
        { section: 'services', key: 'title', value: 'Our Services' },
        { section: 'services', key: 'service_1_title', value: 'SEO Optimization' },
        { section: 'services', key: 'service_1_desc', value: 'Boost your organic search rankings' },
        { section: 'services', key: 'service_2_title', value: 'PPC Advertising' },
        { section: 'services', key: 'service_2_desc', value: 'Targeted paid advertising campaigns' },
        { section: 'services', key: 'service_3_title', value: 'Social Media Marketing' },
        { section: 'services', key: 'service_3_desc', value: 'Engage your audience on social platforms' },
      ];

      // Insert default content
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO content (section, key, value) VALUES (?, ?, ?)"
      );

      defaultContent.forEach(item => {
        stmt.run(item.section, item.key, item.value);
      });

      stmt.finalize();
      
      resolve();
    });
  });
};

// Helper functions
const getContent = (section = null) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM content";
    let params = [];
    
    if (section) {
      query += " WHERE section = ?";
      params.push(section);
    }
    
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const updateContent = (section, key, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO content (section, key, value, updated_at) 
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [section, key, value],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      }
    );
  });
};

const getAdminUser = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM admin_users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

const updateAdminPassword = (username, newPassword) => {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.run(
      "UPDATE admin_users SET password = ? WHERE username = ?",
      [hashedPassword, username],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

module.exports = {
  db,
  initDatabase,
  getContent,
  updateContent,
  getAdminUser,
  updateAdminPassword
};