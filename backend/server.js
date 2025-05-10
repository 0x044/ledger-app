const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Machine = require('./models/Machine');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes
// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Machine Routes
// Create Machine
app.post('/api/machines', auth, async (req, res) => {
  try {
    const machine = new Machine({
      ...req.body,
    });
    await machine.save();
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Machines
app.get('/api/machines', auth, async (req, res) => {
  try {
    const machines = await Machine.find().populate('repairHistory.updatedBy', 'username');
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Machines by Department
app.get('/api/machines/department/:department', auth, async (req, res) => {
  try {
    const machines = await Machine.find({ department: req.params.department })
      .populate('repairHistory.updatedBy', 'username');
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Machine Repair Status
app.post('/api/machines/:id/repair', auth, async (req, res) => {
  try {
    const { type, description, shouldClose } = req.body;
    const machine = await Machine.findById(req.params.id);
    
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    if (shouldClose) {
      // If closing repair, update the last repair entry
      if (machine.repairHistory.length > 0) {
        const lastRepair = machine.repairHistory[machine.repairHistory.length - 1];
        lastRepair.endTime = new Date();
        lastRepair.status = 'completed';
        machine.status = 'operational';
      }
    } else {
      // Starting new repair
      machine.status = 'under_repair';
      machine.repairHistory.push({
        type,
        description,
        status: 'ongoing',
        updatedBy: req.user._id,
        startTime: new Date(),
        endTime: null
      });
    }
    
    // Add resolution comment if closing repair
    if (shouldClose && description) {
      machine.repairHistory[machine.repairHistory.length - 1].description += 
        `\n\nResolution: ${description}`;
    }
    
    await machine.save();
    const populatedMachine = await Machine.findById(machine._id)
      .populate('repairHistory.updatedBy', 'username');
    res.json(populatedMachine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
