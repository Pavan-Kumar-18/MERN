const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
});

// @route   GET api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/employees
// @desc    Create an employee
// @access  Private
router.post(
  '/',
  [
    auth,
    upload.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('mobile', 'Mobile number is required').not().isEmpty(),
      check('designation', 'Designation is required').not().isEmpty(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('course', 'Course is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      let employee = await Employee.findOne({ email });
      if (employee) {
        return res.status(400).json({ msg: 'Employee already exists' });
      }

      employee = new Employee({
        image,
        name,
        email,
        mobile,
        designation,
        gender,
        course,
      });

      await employee.save();
      res.json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/employees/:id
// @desc    Update an employee
// @access  Private
router.put(
  '/:id',
  [
    auth,
    upload.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('mobile', 'Mobile number is required').not().isEmpty(),
      check('designation', 'Designation is required').not().isEmpty(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('course', 'Course is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      let employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }

      employee.name = name;
      employee.email = email;
      employee.mobile = mobile;
      employee.designation = designation;
      employee.gender = gender;
      employee.course = course;
      if (image) {
        employee.image = image;
      }

      await employee.save();
      res.json(employee);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await employee.remove();
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
