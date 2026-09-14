const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Routes

// CREATE rider
app.post("/riders", async (req, res) => {
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
app.put("/riders/:id", async (req, res) => {
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
app.delete("/riders/:id", async (req, res) => {
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

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
