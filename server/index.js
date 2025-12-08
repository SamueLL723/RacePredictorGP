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

        const newRider = await pool.query(
            "INSERT INTO rider (number, name) VALUES ($1, $2) RETURNING *",
            [number, name]
        );
        res.json(newRider.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// GET ALL riders
app.get("/riders", async (req, res) => {
    try {
        const allRiders = await pool.query("SELECT * FROM rider ORDER BY number");
        res.json(allRiders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// GET ONE rider
app.get("/riders/:id", async (req, res) => {
    try {
        const { id } = req.params; // rider_id
        const rider = await pool.query(
            "SELECT * FROM rider WHERE rider_id = $1",
            [id]
        );
        res.json(rider.rows[0]);   // ak neexistuje, bude null
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// UPDATE rider
app.put("/riders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { number, name } = req.body;

        const updated = await pool.query(
            "UPDATE rider SET number = $1, name = $2 WHERE rider_id = $3 RETURNING *",
            [number, name, id]
        );

        res.json(updated.rows[0]); // vrátime upraveného jazdca
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE rider
app.delete("/riders/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM rider WHERE rider_id = $1",
            [id]
        );

        res.json({ message: "Rider was deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
