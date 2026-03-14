const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

/* ---------------- GET ALL ADDRESSES ---------------- */
router.get('/', auth, async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT * FROM user_addresses
       WHERE user_id=$1
       ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("GET ADDRESSES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ---------------- GET DEFAULT ADDRESS ---------------- */
router.get('/default', auth, async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM user_addresses
       WHERE user_id=$1 AND is_default=true
       LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("DEFAULT ADDRESS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

});


/* ---------------- ADD ADDRESS ---------------- */
router.post('/', auth, async (req, res) => {

  const { label, line1, city, state, pincode, phone, is_default=false } = req.body;

  try {

    if (!line1 || !city || !pincode || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (is_default) {
      await pool.query(
        `UPDATE user_addresses SET is_default=false WHERE user_id=$1`,
        [req.user.id]
      );
    }

    const result = await pool.query(
      `INSERT INTO user_addresses
       (user_id, label, line1, city, state, pincode, phone, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [req.user.id, label, line1, city, state, pincode, phone, is_default]
    );

    const address = result.rows[0];

    if (is_default) {
      const fullAddress = JSON.stringify([address]);
      await pool.query(
        `UPDATE users SET addresses=$1 WHERE id=$2`,
        [fullAddress, req.user.id]
      );
    }

    res.json(address);

  } catch (err) {
    console.error("ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }

});


/* ---------------- UPDATE ADDRESS ---------------- */
router.put('/:id', auth, async (req, res) => {

  const { id } = req.params;
  const { label, line1, city, state, pincode, phone, is_default=false } = req.body;

  try {

    if (is_default) {
      await pool.query(
        `UPDATE user_addresses SET is_default=false WHERE user_id=$1`,
        [req.user.id]
      );
    }

    const result = await pool.query(
      `UPDATE user_addresses
       SET label=$1, line1=$2, city=$3, state=$4, pincode=$5, phone=$6, is_default=$7
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [label, line1, city, state, pincode, phone, is_default, id, req.user.id]
    );

    const address = result.rows[0];

    if (is_default && address) {

      const fullAddress = JSON.stringify([address]);

      await pool.query(
        `UPDATE users SET addresses=$1 WHERE id=$2`,
        [fullAddress, req.user.id]
      );

    }

    res.json(address);

  } catch (err) {

    console.error("UPDATE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

});


/* ---------------- DELETE ADDRESS ---------------- */
router.delete('/:id', auth, async (req, res) => {

  try {

    await pool.query(
      `DELETE FROM user_addresses WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    const defaultCheck = await pool.query(
      `SELECT * FROM user_addresses
       WHERE user_id=$1 AND is_default=true`,
      [req.user.id]
    );

    if (defaultCheck.rows.length === 0) {

      const firstAddress = await pool.query(
        `SELECT *
         FROM user_addresses
         WHERE user_id=$1
         ORDER BY created_at ASC
         LIMIT 1`,
        [req.user.id]
      );

      if (firstAddress.rows[0]) {

        await pool.query(
          `UPDATE user_addresses SET is_default=true WHERE id=$1`,
          [firstAddress.rows[0].id]
        );

        await pool.query(
          `UPDATE users SET addresses=$1 WHERE id=$2`,
          [JSON.stringify([firstAddress.rows[0]]), req.user.id]
        );

      }

    }

    res.json({ message: "Address deleted" });

  } catch (err) {

    console.error("DELETE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

});


/* ---------------- SET DEFAULT ---------------- */
router.put('/set-default/:id', auth, async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      `UPDATE user_addresses
       SET is_default=false
       WHERE user_id=$1`,
      [req.user.id]
    );

    const result = await pool.query(
      `UPDATE user_addresses
       SET is_default=true
       WHERE id=$1 AND user_id=$2
       RETURNING *`,
      [id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("SET DEFAULT ERROR:", err);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;