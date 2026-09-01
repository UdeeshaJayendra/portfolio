/**
 * ============================================================
 *  seed.js — Populate the Database with Initial Data
 * ============================================================
 *
 * Run this script with:  node backend/seed.js
 *
 * What it does:
 *   1. Connects to MongoDB
 *   2. Clears ALL existing data (fresh start)
 *   3. Creates your admin account
 *   4. Inserts profile, projects, skills, experience, education, certs
 *   5. Disconnects and exits
 *
 * ⚠️  EDIT THIS FILE with your real info before running it.
 *     Every time you run it, all data is wiped and re-inserted.
 */

require('dotenv').config();
const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');
const User          = require('./models/User');
const Profile       = require('./models/Profile');
const Project       = require('./models/Project');
const Skill         = require('./models/Skill');
const Experience    = require('./models/Experience');
const Education     = require('./models/Education');
const Certification = require('./models/Certification');

async function seed() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio');
  console.log('✅ Connected to MongoDB');

  // ── Step 1: Wipe all collections ──────────────────────────────
  // Promise.all runs all deletes in parallel (faster than sequential)
  await Promise.all([
    User.deleteMany(),
    Profile.deleteMany(),
    Project.deleteMany(),
    Skill.deleteMany(),
    Experience.deleteMany(),
    Education.deleteMany(),
    Certification.deleteMany(),
  ]);
  console.log('🗑️  Cleared existing data');

  // ── Step 2: Create admin user ─────────────────────────────────
  // CHANGE THESE CREDENTIALS before running seed.js!
  // The password is hashed by the User model's pre('save') hook automatically.
  const adminUser = await new User({
    name:     'Your Name',           // ← Change this
    email:    'admin@portfolio.com', // ← Change this — your login email
    password: 'admin123',            // ← Change this — use a strong password!
    role:     'admin',               // Only the seeded user gets 'admin' role
  }).save();
  console.log('👤 Admin user created:', adminUser.email);

  // ── TEMPORARY PASSWORD TEST ──────────────────────────────────
  // This verifies that the password was correctly hashed and
  // can be compared with the original password.
  const passwordTest = await adminUser.comparePassword('admin123');
  console.log('🔐 Password test:', passwordTest);
  console.log('🔐 Stored hash:', adminUser.password);
  // ── END TEMPORARY PASSWORD TEST ──────────────────────────────

  // ── Step 3: Create your profile ───────────────────────────────
  await Profile.create({
    name:     'Your Name',            // ← Change
    title:    'Full Stack Developer', // ← Change
    tagline:  'Building scalable web applications with MERN stack',
    bio:      'Passionate full stack developer currently seeking internship opportunities.',
    email:    'your.email@gmail.com', // ← Change
    phone:    '+94 77 000 0000',      // ← Change
    location: 'Colombo, Sri Lanka',
    github:   'https://github.com/yourusername',   // ← Change
    linkedin: 'https://linkedin.com/in/yourusername', // ← Change
    website:  'https://yourportfolio.com',         // ← Change (optional)
  });
  console.log('📋 Profile created');

  // ── Step 4: Create sample projects ───────────────────────────
  await Project.insertMany([
    {
      title:       'E-Commerce Platform',
      description: 'Full-stack e-commerce app with cart, auth, and Stripe payments.',
      techStack:   ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
      githubUrl:   'https://github.com/yourusername/ecommerce', // ← Change
      liveUrl:     'https://demo.com',                          // ← Change or remove
      featured:    true,
      status:      'completed',
      order:       1,
    },
    {
      title:       'Task Management App',
      description: 'Kanban-style project management tool with real-time updates via Socket.io.',
      techStack:   ['React', 'Socket.io', 'Node.js', 'MongoDB'],
      githubUrl:   'https://github.com/yourusername/taskapp',   // ← Change
      featured:    true,
      status:      'completed',
      order:       2,
    },
    {
      title:       'Weather Dashboard',
      description: 'Real-time weather app using OpenWeather API with beautiful charts.',
      techStack:   ['React', 'Redux', 'Chart.js', 'OpenWeather API'],
      githubUrl:   'https://github.com/yourusername/weather',   // ← Change
      liveUrl:     'https://demo.com',
      featured:    false,
      status:      'completed',
      order:       3,
    },
  ]);
  console.log('🚀 Projects created');

  // ── Step 5: Create skills ─────────────────────────────────────
  // proficiency is 0-100. Be honest — interviewers may ask about it!
  await Skill.insertMany([
    { name: 'React',       category: 'Frontend', proficiency: 85, order: 1 },
    { name: 'JavaScript', category: 'Frontend', proficiency: 82, order: 2 },
    { name: 'HTML/CSS',   category: 'Frontend', proficiency: 90, order: 3 },
    { name: 'Node.js',    category: 'Backend',  proficiency: 78, order: 4 },
    { name: 'Express.js', category: 'Backend',  proficiency: 75, order: 5 },
    { name: 'MongoDB',    category: 'Database', proficiency: 72, order: 6 },
    { name: 'Git',        category: 'Tools',    proficiency: 85, order: 7 },
    { name: 'Docker',     category: 'DevOps',   proficiency: 55, order: 8 },
  ]);
  console.log('⚡ Skills created');

  // ── Step 6: Create experience ─────────────────────────────────
  await Experience.create({
    company:     'Tech Startup XYZ',          // ← Change
    role:        'Frontend Developer Intern', // ← Change
    type:        'internship',
    location:    'Colombo, Sri Lanka',
    startDate:   new Date('2024-06-01'),
    endDate:     new Date('2024-09-01'),
    current:     false,
    description: 'Worked on building responsive React components and integrating REST APIs.',
    highlights: [
      'Reduced page load time by 30% through code splitting',
      'Built 15+ reusable UI components used across the app',
      'Collaborated with a team of 5 developers using Git',
    ],
    techUsed: ['React', 'Redux', 'Tailwind CSS', 'REST API'],
    order: 1,
  });
  console.log('💼 Experience created');

  // ── Step 7: Create education ──────────────────────────────────
  await Education.create({
    institution:  'University of Sri Jayawardanapura', // ← Change
    degree:       'Bachelor of Science',
    field:        'Computer Science',
    startDate:    new Date('2022-01-01'),
    current:      true, // Still studying — no endDate needed
    gpa:          '3.8/4.0',              // ← Change or remove
    achievements: ["Dean's List 2023", 'Won University Hackathon 2024'],
    order: 1,
  });
  console.log('🎓 Education created');

  // ── Step 8: Create certifications ────────────────────────────
  await Certification.insertMany([
    {
      name:          'MongoDB eloper Path',
      issuer:        'MongoDB University',
      issueDate:     new Date('2024-01-15'),
      credentialUrl: 'https://learn.mongodb.com/c/your-cert-id', // ← Change
      order: 1,
    },
    {
      name:          'React Developer Certificate',
      issuer:        'Meta (via Coursera)',
      issueDate:     new Date('2023-11-20'),
      credentialUrl: 'https://coursera.org/verify/your-cert-id', // ← Change
      order: 2,
    },
  ]);
  console.log('🏅 Certifications created');

  console.log('\n✅ Database seeded successfully!');
  console.log(`\n🔑 Admin login: admin@portfolio.com / admin123`);
  console.log('   ⚠️  Change these credentials in seed.js before going live!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});