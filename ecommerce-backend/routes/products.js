const express = require('express');
const pool = require('../config/db');
const router = express.Router();

/* GET ALL PRODUCTS */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        price,
        stock,
        category,
        image
       FROM products
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* GET SINGLE PRODUCT */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;