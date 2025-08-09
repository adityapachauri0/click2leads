require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lead = require('../models/Lead');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/click2leads');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@click2leads.co.uk',
      password: 'admin123',  // Let the model hash the password
      role: 'admin',
      isVerified: true
    });
    console.log('Created admin user: admin@click2leads.co.uk / admin123');

    // Create sample leads
    const sampleLeads = [
      {
        name: 'John Smith',
        email: 'john@techcorp.com',
        company: 'TechCorp Ltd',
        phone: '+44 20 1234 5678',
        budget: '£5,000 - £10,000',
        message: 'Looking for Google Ads management for our new product launch. We need someone with experience in B2B tech marketing.',
        service: 'Google Ads',
        source: 'Website Form',
        status: 'new',
        score: 80
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@retailco.uk',
        company: 'RetailCo UK',
        phone: '+44 20 9876 5432',
        budget: '£10,000 - £25,000',
        message: 'Need Facebook advertising campaign for our e-commerce store. Looking for someone who can handle both creative and performance.',
        service: 'Facebook Ads',
        source: 'Direct Contact',
        status: 'contacted',
        score: 90
      },
      {
        name: 'Michael Brown',
        email: 'michael@startupinc.com',
        company: 'StartupInc',
        phone: '+44 20 5555 1234',
        budget: '£1,000 - £5,000',
        message: 'Web development and SEO services needed for our startup. We have designs ready.',
        service: 'Web Development',
        source: 'Google Ads',
        status: 'qualified',
        score: 70
      },
      {
        name: 'Emma Wilson',
        email: 'emma@fashionbrand.co.uk',
        company: 'Fashion Brand UK',
        phone: '+44 20 7777 8888',
        budget: '£10,000 - £25,000',
        message: 'Complete digital marketing package including social media, PPC, and content marketing.',
        service: 'Full Package',
        source: 'Referral',
        status: 'converted',
        score: 100
      },
      {
        name: 'David Lee',
        email: 'david@consultancy.com',
        company: 'Business Consultancy Ltd',
        phone: '+44 20 3333 4444',
        budget: '£5,000 - £10,000',
        message: 'LinkedIn advertising for B2B lead generation. Need help with audience targeting.',
        service: 'Social Media Marketing',
        source: 'LinkedIn',
        status: 'new',
        score: 75
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@healthtech.uk',
        company: 'HealthTech Solutions',
        phone: '+44 20 2222 1111',
        budget: '£10,000 - £25,000',
        message: 'Native and programmatic advertising campaign for our health app.',
        service: 'Native & Programmatic',
        source: 'Website Form',
        status: 'contacted',
        score: 85
      },
      {
        name: 'James Taylor',
        email: 'james@realestate.co.uk',
        company: 'Premium Properties',
        phone: '+44 20 6666 7777',
        budget: '£1,000 - £5,000',
        message: 'Google Analytics setup and conversion tracking for our property website.',
        service: 'Analytics & Insights',
        source: 'Email',
        status: 'qualified',
        score: 65
      },
      {
        name: 'Sophie Martin',
        email: 'sophie@beautybrand.com',
        company: 'Beauty Brand International',
        phone: '+44 20 8888 9999',
        budget: '£10,000 - £25,000',
        message: 'Instagram and TikTok advertising campaigns. Need creative content and performance marketing.',
        service: 'Facebook Ads',
        source: 'Instagram',
        status: 'new',
        score: 95
      }
    ];

    await Lead.insertMany(sampleLeads);
    console.log(`Created ${sampleLeads.length} sample leads`);

    // Display summary
    const leadStats = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nLead Statistics:');
    leadStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: admin@click2leads.co.uk');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();