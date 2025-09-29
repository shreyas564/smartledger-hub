const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/departments - Fetch all departments and their employees using a robust aggregation pipeline
router.get('/', authMiddleware, async (req, res) => {
  try {
    // This is a powerful database query that joins Departments and Users efficiently.
    const departmentsWithEmployees = await Department.aggregate([
      {
        // Stage 1: Perform a "left join" from the departments collection to the users collection.
        $lookup: {
          from: 'users', // The collection to join with (Mongoose pluralizes 'User' to 'users')
          localField: 'name', // The field from the departments collection
          foreignField: 'department', // The field from the users collection
          as: 'employees' // The name of the new array field to add
        }
      },
      {
        // Stage 2: Sort the departments alphabetically by name.
        $sort: {
          name: 1
        }
      }
    ]);
    
    res.json(departmentsWithEmployees);
  } catch (error) {
    console.error('Error fetching departments with aggregation:', error);
    res.status(500).json({ message: 'Server error while fetching departments.' });
  }
});

module.exports = router;