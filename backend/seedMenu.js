// ============================================================
// seedMenu.js  —  Database Seeder
// Run once to populate the menu collection in MongoDB
// Usage: node seedMenu.js
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const Menu     = require('./models/Menu');
const connectDB = require('./config/db');

const menuData = [
  {
    id:          'EB001',
    name:        'Ember Espresso',
    category:    'espresso',
    price:       3.50,
    description: 'Rich, bold, and full-bodied. Our signature single-origin espresso with notes of dark chocolate and caramel.',
    icon:        '☕',
    available:   true,
    tags:        ['hot', 'strong', 'signature']
  },
  {
    id:          'EB002',
    name:        'Mocha Mousse Latte',
    category:    'latte',
    price:       5.25,
    description: 'Creamy mocha blended with steamed milk, topped with velvety foam and a dusting of cocoa.',
    icon:        '🍫',
    available:   true,
    tags:        ['hot', 'creamy', 'seasonal']
  },
  {
    id:          'EB003',
    name:        'Velvet Vanilla Brew',
    category:    'cold-brew',
    price:       4.75,
    description: 'Smooth cold brew infused with Madagascar vanilla, served over ice with oat milk option.',
    icon:        '✨',
    available:   true,
    tags:        ['cold', 'smooth', 'vanilla']
  },
  {
    id:          'EB004',
    name:        'Caramel Cloud Cappuccino',
    category:    'cappuccino',
    price:       4.50,
    description: 'Velvety cappuccino topped with salted caramel drizzle and light foam cloud.',
    icon:        '☁️',
    available:   true,
    tags:        ['hot', 'sweet', 'caramel']
  },
  {
    id:          'EB005',
    name:        'Terracotta Chai',
    category:    'chai',
    price:       4.00,
    description: 'House-spiced masala chai with ginger, cardamom, and cinnamon, served with oat milk.',
    icon:        '🍵',
    available:   true,
    tags:        ['hot', 'spiced', 'vegan']
  },
  {
    id:          'EB006',
    name:        'Midnight Cold Brew',
    category:    'cold-brew',
    price:       4.25,
    description: '24-hour steeped cold brew served over ice. Bold, smooth, no bitterness.',
    icon:        '🌙',
    available:   true,
    tags:        ['cold', 'strong', 'black']
  },
  {
    id:          'EB007',
    name:        'Butter Croissant',
    category:    'pastry',
    price:       3.00,
    description: 'Freshly baked, flaky French-style croissant with golden crust. Baked fresh daily.',
    icon:        '🥐',
    available:   true,
    tags:        ['food', 'fresh', 'vegetarian']
  },
  {
    id:          'EB008',
    name:        'Hazelnut Flat White',
    category:    'flat-white',
    price:       4.75,
    description: 'Double ristretto shots with velvety micro-foamed milk and a hint of toasted hazelnut.',
    icon:        '🌰',
    available:   true,
    tags:        ['hot', 'nutty', 'smooth']
  }
];

const seedMenu = async () => {
  try {
    await connectDB();

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('🗑️   Cleared existing menu items');

    // Insert fresh menu data
    const inserted = await Menu.insertMany(menuData);
    console.log(`✅  Inserted ${inserted.length} menu items into MongoDB`);

    inserted.forEach(item => {
      console.log(`    ${item.icon}  ${item.id} — ${item.name} ($${item.price})`);
    });

    console.log('\n🎉  Menu seeded successfully!\n');

  } catch (err) {
    console.error('❌  Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  Database connection closed');
    process.exit(0);
  }
};

seedMenu();
