const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Machine = require('../models/Machine');
const connectDB = require('../config/db');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.NODE_ENV = 'test';
  await connectDB(mongoUri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Machine.deleteMany({});
});

describe('Authentication Endpoints', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'testpass123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with duplicate username', async () => {
      // First registration
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'testpass123'
        });

      // Second registration with same username
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'differentpass'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'testpass123'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'testpass123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'wrongpass'
        });

      expect(res.statusCode).toBe(400);
    });
  });
});

describe('Machine Endpoints', () => {
  let authToken;
  let testMachine;

  beforeEach(async () => {
    // Create a user and get token
    const userRes = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'testpass123'
      });
    authToken = userRes.body.token;

    // Create a test machine
    const machineRes = await request(app)
      .post('/api/machines')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Machine',
        department: 'Engineering',
        status: 'operational'
      });
    testMachine = machineRes.body;
  });

  describe('GET /api/machines', () => {
    it('should get all machines', async () => {
      const res = await request(app)
        .get('/api/machines')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should not get machines without auth token', async () => {
      const res = await request(app)
        .get('/api/machines');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/machines/:id/repair', () => {
    it('should update machine repair status', async () => {
      const res = await request(app)
        .post(`/api/machines/${testMachine._id}/repair`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'mechanical',
          description: 'Test repair'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('under_repair');
      expect(res.body.repairHistory).toHaveLength(1);
    });
  });
});
