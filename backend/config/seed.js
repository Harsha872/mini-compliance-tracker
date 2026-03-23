require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Task = require('../models/Task');

const clients = [
  {
    name: 'Acme Corporation',
    industry: 'Manufacturing',
    contact_email: 'compliance@acme.com',
  },
  {
    name: 'Nexus Financial',
    industry: 'Finance',
    contact_email: 'legal@nexusfinancial.com',
  },
  {
    name: 'HealthBridge Clinics',
    industry: 'Healthcare',
    contact_email: 'admin@healthbridge.com',
  },
  {
    name: 'GreenLeaf Energy',
    industry: 'Energy',
    contact_email: 'ops@greenleaf.com',
  },
];

const getTasksForClient = (clientId, index) => {
  const now = new Date();
  const past = (days) => new Date(now - days * 86400000).toISOString().split('T')[0];
  const future = (days) => new Date(now.getTime() + days * 86400000).toISOString().split('T')[0];

  const taskSets = [
    [
      {
        client: clientId,
        title: 'Annual Safety Audit',
        description: 'Conduct end-to-end safety audit for all manufacturing units.',
        category: 'Safety',
        due_date: past(5),
        status: 'Pending',
        priority: 'High',
      },
      {
        client: clientId,
        title: 'ISO 9001 Renewal',
        description: 'Prepare documentation for ISO 9001 certification renewal.',
        category: 'Certification',
        due_date: future(10),
        status: 'Pending',
        priority: 'Medium',
      },
      {
        client: clientId,
        title: 'Employee Training Records',
        description: 'Collect and verify training completion records for all staff.',
        category: 'HR Compliance',
        due_date: future(20),
        status: 'Completed',
        priority: 'Low',
      },
    ],
    [
      {
        client: clientId,
        title: 'AML Policy Review',
        description: 'Review and update Anti-Money Laundering policies.',
        category: 'Regulatory',
        due_date: past(2),
        status: 'Pending',
        priority: 'High',
      },
      {
        client: clientId,
        title: 'KYC Documentation Update',
        description: 'Ensure all client KYC documents are current and verified.',
        category: 'Regulatory',
        due_date: future(7),
        status: 'Completed',
        priority: 'High',
      },
      {
        client: clientId,
        title: 'Quarterly Financial Report',
        description: 'Compile and submit Q2 financial compliance report to regulators.',
        category: 'Reporting',
        due_date: future(15),
        status: 'Pending',
        priority: 'Medium',
      },
    ],
    [
      {
        client: clientId,
        title: 'HIPAA Compliance Check',
        description: 'Audit all systems for HIPAA compliance and data handling.',
        category: 'Privacy',
        due_date: past(3),
        status: 'Pending',
        priority: 'High',
      },
      {
        client: clientId,
        title: 'Medical Waste Disposal Audit',
        description: 'Verify proper disposal procedures are followed across all clinics.',
        category: 'Safety',
        due_date: future(5),
        status: 'Pending',
        priority: 'Medium',
      },
      {
        client: clientId,
        title: 'Staff Certification Renewal',
        description: 'Track and ensure medical staff certifications are up to date.',
        category: 'Certification',
        due_date: future(30),
        status: 'Completed',
        priority: 'Low',
      },
    ],
    [
      {
        client: clientId,
        title: 'Environmental Impact Report',
        description: 'Submit annual environmental impact assessment to authorities.',
        category: 'Regulatory',
        due_date: past(10),
        status: 'Completed',
        priority: 'High',
      },
      {
        client: clientId,
        title: 'Carbon Emissions Audit',
        description: 'Measure and document carbon emissions for Q2 operations.',
        category: 'Reporting',
        due_date: future(12),
        status: 'Pending',
        priority: 'Medium',
      },
      {
        client: clientId,
        title: 'Renewable Energy License Renewal',
        description: 'File renewal application for operating license with energy board.',
        category: 'Certification',
        due_date: past(1),
        status: 'Pending',
        priority: 'High',
      },
    ],
  ];

  return taskSets[index % taskSets.length];
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Client.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const createdClients = await Client.insertMany(clients);
    console.log(`Inserted ${createdClients.length} clients`);

    const allTasks = createdClients.flatMap((client, index) =>
      getTasksForClient(client._id, index)
    );

    await Task.insertMany(allTasks);
    console.log(`Inserted ${allTasks.length} tasks`);

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
