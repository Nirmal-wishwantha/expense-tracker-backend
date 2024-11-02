const connection = require('../db/db-connection');







// expensive save
const validCategories = ['education', 'food', 'entertainment', 'transport', 'shopping', 'other']; // Valid ENUM categories

const addExpensive = (req, res) => {
  const { userId, category, amount } = req.body;

 
  const date = new Date().toISOString().slice(0, 10);


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

      
      const responseData = {
        ...rows[0],
        date: rows[0].date
      };

      res.status(201).json({
        message: 'Expense added/updated successfully',
        data: responseData
      });
    });
  });
};










// Function to update an existing expense

const updateExpensive = (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;

  // Validate category
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // SQL query to update expense
  const query = `
    UPDATE expenses 
    SET category = ?, amount = ? 
    WHERE id = ?
  `;

  connection.query(query, [category, amount, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense updated successfully' });
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
    res.status(200).json({ message: 'Expense deleted successfully' });
  });
};






// Function to get all expenses or a specific expense by ID

const getExpensive = (req, res) => {
  const { id: userId } = req.params; // Assuming `id` here refers to `user_id`
  let query = 'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as formatted_date FROM expenses';
  const params = [];

  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  }

  connection.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Map the result to format the date field
    const formattedResult = result.map(expense => ({
      ...expense,
      date: expense.formatted_date,  // Replace with formatted date
    }));
    
    res.status(200).json(formattedResult);
  });
};







module.exports = { addExpensive, updateExpensive, deleteExpensive, getExpensive };
