import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    price: 99.99,
    description: 'Premium wireless over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio fidelity.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Smart Fitness Watch Series 7',
    price: 149.50,
    description: 'Track your workouts, heart rate, sleep quality, and daily activity with an ultra-bright AMOLED touch display and waterproof design.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    price: 79.99,
    description: 'Custom mechanical keyboard with tactile switches, customizable RGB backlighting, and detachable braided USB-C cable.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Precision Wireless Gaming Mouse',
    price: 49.99,
    description: 'Ultra-lightweight gaming mouse with 16,000 DPI optical sensor, zero lag wireless connection, and programmable side buttons.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimalist Leather Backpack',
    price: 65.00,
    description: 'Sleek, water-resistant vegan leather backpack with dedicated 15.6-inch laptop compartment and hidden anti-theft pocket.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 39.99,
    description: 'Compact 360-degree surround sound speaker with deep bass, IPX7 waterproof rating, and 12-hour continuous playtime.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ultra-Slim 4K OLED Monitor (27-inch)',
    price: 349.99,
    description: 'Stunning 4K OLED display with 144Hz refresh rate, 99% DCI-P3 cinematic color gamut, and ultra-thin aluminum chassis.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Studio Pro Condenser Microphone',
    price: 119.00,
    description: 'Broadcast-grade cardioid studio microphone with built-in pop filter, zero-latency monitoring, and premium shock mount.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Magnetic Wireless Fast Charging Stand',
    price: 54.99,
    description: 'High-speed 15W fast charging dock for smartphone, smartwatch, and wireless earbuds with sleek matte aircraft aluminum finish.',
    image: 'https://images.unsplash.com/photo-1622445262464-84b14e577457?w=600&auto=format&fit=crop&q=80',
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create users (using User.create so pre('save') hook hashes password)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log(`👤 Users seeded:`);
    console.log(`   - Admin: admin@example.com / admin123 (role: admin)`);
    console.log(`   - User:  john@example.com / user123 (role: user)`);

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`📦 Seeded ${createdProducts.length} sample products!`);

    console.log('✅ Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️ Data Destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
