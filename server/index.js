const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {use} = require("express/lib/application");

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:63342",
    credentials: true
}));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({
          error: "Not authenticated"
      });
  }

  try {
      const user = jwt.verify(
          token,
          process.env.JWT_SECRET
      );
      req.user = user;
      next();
  } catch (e) {
    return res.status(401).json({
        error: "Invalid or expired token"
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({
          error: "Admin access required"
      });
  }
  next();
};

// Routes

// CREATE rider
app.post("/riders",authenticateToken, requireAdmin , async (req, res) => {
    try {
        const { number, name } = req.body;

        if (!number || !name) {
            return res.status(400).json({
               error: "Number and name are required"
            });
        }

        const [result] = await pool.query(
            "INSERT INTO riders (number, name) VALUES (?, ?)",
            [number, name]
        );

        res.status(201).json({
            id: result.insertId,
            number,
            name
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: "Server error"
        });
    }
});

// GET ALL riders
app.get("/riders", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM riders ORDER BY number");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// GET ONE rider
app.get("/riders/:id", async (req, res) => {
    try {
        const riderId = req.params.id; // rider_id
        const [rows] = await pool.query(
            "SELECT * FROM riders WHERE id = ?",
            [riderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Rider not found"
            });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// UPDATE rider
app.put("/riders/:id",authenticateToken, requireAdmin, async (req, res) => {
    try {
        const riderId = req.params.id;
        const { number, name } = req.body;

        if (!number || !name) {
            return res.status(400).json({
                error: "Number and name are required"
            });
        }

        const [result] = await pool.query(
            "UPDATE riders SET number = ?, name = ? WHERE id = ?",
            [number, name, riderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Rider not found"
            });
        }

        res.json({
            id: Number(riderId),
            number,
            name
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: "Server error"
        });
    }
});

// DELETE rider
app.delete("/riders/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const riderId = req.params.id;

        const [result] = await pool.query(
            "DELETE FROM riders WHERE id = ?",
            [riderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Rider not found"
            });
        }

        res.json({
            message: "Rider was deleted"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: "Server error"
        });
    }
});

app.post("/register", async (req, res)=> {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email and password are required"
            });
        }

        const [existingUsers] = await pool.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: "Username or email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            email,
            role: "user"
        });
    } catch (err) {
        console.error(err.message);

        res.status(500).json({
           error: "Server error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 6000
        });

        res.json({
            message: "Login succesful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            error: "Server error"
        });
    }
});

app.get("/me", authenticateToken, (req, res) => {
    res.json({
        user: req.user
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })

    res.json({
        message: "Logout successful"
    });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
