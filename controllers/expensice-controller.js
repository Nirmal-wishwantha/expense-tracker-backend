const connection = require('../db/db-connection');








const validCategories = ['education', 'food', 'entertainment', 'transport', 'shopping', 'other']; // Valid ENUM categories

const addExpensive = (req, res) => {
  const { userId, category, amount } = req.body;

  // Generate current date in YYYY-MM-DD format
  const date = new Date().toISOString().slice(0, 10); // Only get the date part

  // Validate the category
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const query = `
    INSERT INTO expenses (user_id, category, date, amount)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE category = VALUES(category), amount = VALUES(amount)
  `;

  connection.query(query, [userId, category, date, amount], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Fetch the inserted or updated row data
    const insertedDataQuery = `
      SELECT * FROM expenses WHERE user_id = ? AND date = ? AND category = ?
    `;

    connection.query(insertedDataQuery, [userId, date, category], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      // Since 'date' is already in YYYY-MM-DD format, use it directly
      const responseData = {
        ...rows[0],
        date: rows[0].date // Use the original date directly
      };

      res.status(201).json({
        message: 'Expense added/updated successfully',
        data: responseData // Return the formatted response
      });
    });
  });
};










// Function to update an existing expense
const updateExpensive = (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;

  const query = `
    UPDATE expenses 
    SET ${category} = ?, amount = ? 
    WHERE id = ?
  `;

  connection.query(query, [amount, amount, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Expense updated successfully', result });
  });
};




// Function to delete an expense
const deleteExpensive = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM expenses 
    WHERE id = ?
  `;

  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Expense deleted successfully', result });
  });
};






// Function to get all expenses or a specific expense by ID
const getExpensive = (req, res) => {
  const { id } = req.params;
  let query = 'SELECT * FROM expenses';
  const params = [];

  if (id) {
    query += ' WHERE id = ?';
    params.push(id);
  }

  connection.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

module.exports = { addExpensive, updateExpensive, deleteExpensive, getExpensive };
