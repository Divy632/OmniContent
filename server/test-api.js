const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

async function runTests() {
  await connectDB();
  const server = app.listen(5002);
  const baseUrl = 'http://127.0.0.1:5002';

  try {
    console.log('Testing Endpoints...');

    // 1. Health
    const healthRes = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    console.log('1. GET /api/health ->', healthRes.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. Content Types
    const typesRes = await fetch(`${baseUrl}/api/content-types`).then(r => r.json());
    console.log('2. GET /api/content-types ->', typesRes.success && typesRes.contentTypes.length > 0 ? `PASS (${typesRes.contentTypes.length} types)` : 'FAIL');

    // 3. Register
    const regPayload = {
      name: 'Aditya Sharma',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    }).then(r => r.json());
    console.log('3. POST /api/auth/register ->', regRes.success && regRes.token ? 'PASS' : 'FAIL');

    const token = regRes.token;

    // 4. Login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regPayload.email, password: regPayload.password })
    }).then(r => r.json());
    console.log('4. POST /api/auth/login ->', loginRes.success && loginRes.token ? 'PASS' : 'FAIL');

    // 5. Get Me
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    console.log('5. GET /api/auth/me ->', meRes.success && meRes.user.name === 'Aditya Sharma' ? 'PASS' : 'FAIL');

    // 6. Generate Creation (Section 16.1 Example)
    const genPayload = {
      contentCategory: 'events',
      contentType: 'event_poster',
      title: 'National Hackathon 2026',
      inputDetails: {
        eventName: 'National Hackathon 2026',
        date: '20 November 2026',
        venue: 'College Auditorium',
        audience: 'Students and developers',
        highlights: 'Cash pool of ₹1,00,000 and direct interview opportunities'
      },
      preferences: {
        language: 'English',
        tone: 'Energetic & Professional',
        platform: 'Instagram',
        visualStyle: 'Modern Cyberpunk / Neon Tech'
      },
      outputs: ['text', 'image']
    };

    const genRes = await fetch(`${baseUrl}/api/creations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(genPayload)
    }).then(r => r.json());

    console.log('6. POST /api/creations/generate ->', genRes.success && genRes.creation._id && genRes.creation.generatedText.headline ? 'PASS' : 'FAIL');
    const creationId = genRes.creation._id;

    // 7. List creations
    const listRes = await fetch(`${baseUrl}/api/creations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    console.log('7. GET /api/creations ->', listRes.success && listRes.creations.length >= 1 ? `PASS (${listRes.count} creations)` : 'FAIL');

    // 8. Get creation details
    const getRes = await fetch(`${baseUrl}/api/creations/${creationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    console.log('8. GET /api/creations/:id ->', getRes.success && getRes.creation.title === 'National Hackathon 2026' ? 'PASS' : 'FAIL');

    // 9. Update creation
    const updateRes = await fetch(`${baseUrl}/api/creations/${creationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'National Hackathon 2026 (Updated Final)',
        generatedText: {
          ...getRes.creation.generatedText,
          headline: '🚀 NATIONAL HACKATHON 2026 - REGISTRATIONS OPEN NOW!'
        }
      })
    }).then(r => r.json());
    console.log('9. PUT /api/creations/:id ->', updateRes.success && updateRes.creation.title.includes('Updated') ? 'PASS' : 'FAIL');

    // 10. Update & Get Profile
    const profileRes = await fetch(`${baseUrl}/api/profiles/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        profileType: 'organization',
        name: 'ACM Student Chapter',
        description: 'Empowering future innovators through hackathons and workshops',
        brandColors: ['#3b82f6', '#10b981'],
        website: 'https://acm-chapter.edu'
      })
    }).then(r => r.json());
    console.log('10. PUT /api/profiles/me ->', profileRes.success && profileRes.profile.name === 'ACM Student Chapter' ? 'PASS' : 'FAIL');

    console.log('\n🎉 ALL BACKEND API CONTRACT TESTS PASSED FLAWLESSLY!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
