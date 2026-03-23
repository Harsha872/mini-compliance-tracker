const Client = require('../models/Client');

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ name: 1 });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { name, industry, contact_email } = req.body;

    if (!name || !industry || !contact_email) {
      return res.status(400).json({ message: 'Name, industry, and contact email are required' });
    }

    const existing = await Client.findOne({ contact_email: contact_email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'A client with this email already exists' });
    }

    const client = await Client.create({ name, industry, contact_email });
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

module.exports = { getClients, createClient };