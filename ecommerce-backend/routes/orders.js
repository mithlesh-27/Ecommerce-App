const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

/* ============================= */
/* CREATE ORDER */
/* ============================= */
router.post('/', auth, async (req, res) => {
  const {
    items,
    discount = 0,
    coupon_code = null,
    name,
    phone,
    address,
    pincode,
  } = req.body;

  const userId = req.user.id;

  if (!items || !items.length)
    return res.status(400).json({ message: 'No items provided' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let subtotal = 0;

    for (const item of items) {
      const productRes = await client.query(
        'SELECT * FROM products WHERE id = $1 FOR UPDATE',
        [item.product_id]
      );

      if (productRes.rows.length === 0)
        throw new Error('Product not found');

      const product = productRes.rows[0];

      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      subtotal += product.price * item.quantity;

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    const total = subtotal - discount;

    const orderRes = await client.query(
      `INSERT INTO orders
       (user_id, subtotal, total, discount, coupon_code, name, phone, address, pincode, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'PLACED')
       RETURNING *`,
      [
        userId,
        subtotal,
        total,
        discount,
        coupon_code,
        name,
        phone,
        address,
        pincode,
      ]
    );

    const orderId = orderRes.rows[0].id;

    for (const item of items) {
      const productRes = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );

      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price, variant)
         VALUES ($1,$2,$3,$4,$5)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          productRes.rows[0].price,
          item.variant || null,
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ orderId });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});


/* ============================= */
/* GET SINGLE ORDER DETAIL */
/* ============================= */
router.get('/:id', auth, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    const orderRes = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderRes.rows.length === 0)
      return res.status(404).json({ message: 'Order not found' });

    /* 🔥 IMPORTANT FIX HERE */
    const itemsRes = await pool.query(
      `SELECT
         oi.product_id,
         oi.quantity,
         oi.price,
         oi.variant,
         p.name,
         p.image,
         p.stock,
         p.category,
         p.description
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({
      ...orderRes.rows[0],
      items: itemsRes.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


/* ============================= */
/* GET USER ORDERS */
/* ============================= */
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT *
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


/* ============================= */
/* CANCEL ORDER */
/* ============================= */
router.put('/:id/cancel', auth, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      `SELECT * FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderRes.rows.length === 0)
      return res.status(404).json({ message: 'Order not found' });

    const order = orderRes.rows[0];

    if (order.status !== 'PLACED')
      return res.status(400).json({ message: 'Order cannot be cancelled' });

    const items = await client.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    /* 🔥 RESTORE STOCK */
    for (const item of items.rows) {
      await client.query(
        `UPDATE products
         SET stock = stock + $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `UPDATE orders
       SET status = 'CANCELLED'
       WHERE id = $1`,
      [orderId]
    );

    await client.query('COMMIT');

    res.json({ message: 'Order cancelled successfully' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;