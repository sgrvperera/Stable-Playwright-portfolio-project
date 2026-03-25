import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';

const PORT = 3100;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

const state = {
  nextBookingId: 1001,
  bookings: [
    {
      id: 1000,
      firstname: 'Asha',
      lastname: 'Perera',
      email: 'asha@example.com',
      phone: '0771234567',
      roomid: 1,
      depositpaid: true,
      bookingdates: { checkin: '2026-04-01', checkout: '2026-04-03' },
      notes: 'Seed booking for dashboard checks',
    },
  ],
  contacts: [],
  sessions: new Set(),
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(body);
}

function sendJson(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(data));
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return acc;
      const key = part.slice(0, idx).trim();
      const value = decodeURIComponent(part.slice(idx + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

function getSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies.session || '';
}

function isAuthenticated(req) {
  const token = getSessionToken(req);
  return token ? state.sessions.has(token) : false;
}

function ensureAuth(req, res) {
  if (!isAuthenticated(req)) {
    sendJson(res, 401, { message: 'Unauthorized' });
    return false;
  }
  return true;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}

function layout(title, body, extraScripts = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; background: #f7f8fc; color: #1f2937; }
    header { background: #0f172a; color: white; padding: 18px 24px; }
    header nav { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    header a { color: #93c5fd; text-decoration: none; }
    main { max-width: 1100px; margin: 0 auto; padding: 24px; }
    .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    h1, h2, h3 { margin-top: 0; }
    label { display:block; margin: 12px 0 6px; font-weight: 600; }
    input, textarea, select, button { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font: inherit; }
    textarea { min-height: 110px; resize: vertical; }
    button { background: #2563eb; color: white; border: none; cursor: pointer; margin-top: 14px; font-weight: 700; }
    button.secondary { background: #334155; }
    button.danger { background: #b91c1c; }
    button:disabled { opacity: .7; cursor: not-allowed; }
    .muted { color: #64748b; }
    .success { margin-top: 12px; padding: 12px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; border-radius: 10px; }
    .error { margin-top: 12px; padding: 12px; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; }
    .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .toolbar > * { flex: 1 1 220px; }
    .hero { padding: 14px 0 20px; }
    .pill { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  </style>
</head>
<body>
  <header>
    <nav>
      <strong>Stable Booking Portfolio</strong>
      <a href="/">Home</a>
      <a href="/admin">Admin</a>
      <a href="/upload">Upload</a>
      <a href="/api/health">API Health</a>
    </nav>
  </header>
  <main>
    ${body}
  </main>
  ${extraScripts}
</body>
</html>`;
}

function homePage() {
  return layout('Stable Booking Portfolio', `
    <section class="hero card">
      <span class="pill">UI + API + CI portfolio</span>
      <h1>Stable Booking Platform</h1>
      <p class="muted">A deterministic local app for Playwright automation practice with booking CRUD, admin login, contact form, and file upload.</p>
    </section>

    <section class="grid" style="margin-top: 20px;">
      <article class="card">
        <h2>Booking request</h2>
        <form id="booking-form">
          <label for="firstname">First name</label>
          <input id="firstname" name="firstname" placeholder="First name" required />

          <label for="lastname">Last name</label>
          <input id="lastname" name="lastname" placeholder="Last name" required />

          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" required />

          <label for="phone">Phone</label>
          <input id="phone" name="phone" placeholder="Phone" required />

          <label for="roomid">Room</label>
          <select id="roomid" name="roomid">
            <option value="1">Deluxe Room</option>
            <option value="2">Family Suite</option>
            <option value="3">Ocean View</option>
          </select>

          <label for="checkin">Check-in</label>
          <input id="checkin" name="checkin" type="date" required />

          <label for="checkout">Check-out</label>
          <input id="checkout" name="checkout" type="date" required />

          <label style="display:flex; gap:10px; align-items:center; margin-top: 12px;">
            <input id="depositpaid" name="depositpaid" type="checkbox" style="width:auto;" />
            <span>Deposit paid</span>
          </label>

          <label for="notes">Notes</label>
          <textarea id="notes" name="notes" placeholder="Special request"></textarea>

          <button type="submit">Create booking</button>
        </form>
        <div id="booking-result" class="success" style="display:none;"></div>
      </article>

      <article class="card">
        <h2>Contact us</h2>
        <form id="contact-form">
          <label for="contact-name">Name</label>
          <input id="contact-name" name="name" placeholder="Name" required />

          <label for="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="Email" required />

          <label for="contact-phone">Phone</label>
          <input id="contact-phone" name="phone" placeholder="Phone" required />

          <label for="subject">Subject</label>
          <input id="subject" name="subject" placeholder="Subject" required />

          <label for="message">Message</label>
          <textarea id="message" name="message" placeholder="Message" required></textarea>

          <button type="submit">Send message</button>
        </form>
        <div id="contact-success" class="success" style="display:none;"></div>
      </article>
    </section>
  `, `
  <script>
    const bookingForm = document.getElementById('booking-form');
    const bookingResult = document.getElementById('booking-result');
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        firstname: bookingForm.firstname.value,
        lastname: bookingForm.lastname.value,
        email: bookingForm.email.value,
        phone: bookingForm.phone.value,
        roomid: Number(bookingForm.roomid.value),
        depositpaid: bookingForm.depositpaid.checked,
        bookingdates: {
          checkin: bookingForm.checkin.value,
          checkout: bookingForm.checkout.value,
        },
        notes: bookingForm.notes.value,
      };
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      bookingResult.style.display = 'block';
      if (response.ok) {
        bookingResult.textContent = 'Booking created successfully. Reference #' + body.bookingid;
        bookingResult.className = 'success';
        bookingForm.reset();
      } else {
        bookingResult.textContent = body.message || 'Booking failed';
        bookingResult.className = 'error';
      }
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      contactSuccess.style.display = 'block';
      if (response.ok) {
        contactSuccess.textContent = body.message;
        contactSuccess.className = 'success';
        contactForm.reset();
      } else {
        contactSuccess.textContent = body.message || 'Message failed';
        contactSuccess.className = 'error';
      }
    });
  </script>`);
}

function loginPage() {
  return layout('Admin Login', `
    <section class="card" style="max-width: 520px; margin: 0 auto;">
      <h1>Admin login</h1>
      <p class="muted">Use <strong>admin</strong> / <strong>password</strong>.</p>
      <form id="login-form">
        <label for="username">Username</label>
        <input id="username" name="username" placeholder="Username" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div id="login-message" class="error" style="display:none;"></div>
    </section>
  `, `
  <script>
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username.value,
          password: loginForm.password.value,
        })
      });
      const body = await response.json();
      if (response.ok) {
        window.location.href = '/admin';
      } else {
        loginMessage.style.display = 'block';
        loginMessage.textContent = body.message || 'Login failed';
      }
    });
  </script>`);
}

function dashboardPage() {
  return layout('Reservations Dashboard', `
    <section class="card">
      <div class="toolbar">
        <div>
          <h1>Reservations Dashboard</h1>
          <p class="muted">Logged in as admin. Search, review, and manage bookings.</p>
        </div>
        <div style="display:flex; gap: 10px; justify-content:flex-end;">
          <button id="logout-button" class="secondary" type="button">Logout</button>
          <a href="/" style="align-self:center;">Front Page</a>
        </div>
      </div>
      <div class="toolbar" style="margin-top: 12px;">
        <input id="booking-search" placeholder="Search by name or room" />
      </div>
      <div id="dashboard-status" class="success" style="display:none;"></div>
      <table id="booking-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Room</th><th>Dates</th><th>Paid</th><th>Notes</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>
  `, `
  <script>
    const tableBody = document.querySelector('#booking-table tbody');
    const searchInput = document.getElementById('booking-search');
    const statusBox = document.getElementById('dashboard-status');
    const logoutButton = document.getElementById('logout-button');
    let bookings = [];

    function render(items) {
      tableBody.innerHTML = '';
      if (!items.length) {
        tableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
        return;
      }
      for (const booking of items) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + booking.id + '</td>' +
          '<td class="booking-name">' + booking.firstname + ' ' + booking.lastname + '</td>' +
          '<td>' + (booking.email || '') + '</td>' +
          '<td>Room ' + booking.roomid + '</td>' +
          '<td>' + booking.bookingdates.checkin + ' → ' + booking.bookingdates.checkout + '</td>' +
          '<td>' + (booking.depositpaid ? 'Yes' : 'No') + '</td>' +
          '<td>' + (booking.notes || '') + '</td>';
        tableBody.appendChild(tr);
      }
    }

    async function loadBookings() {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        statusBox.style.display = 'block';
        statusBox.className = 'error';
        statusBox.textContent = 'Unable to load bookings.';
        return;
      }
      const body = await response.json();
      bookings = body.bookings || [];
      render(bookings);
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = bookings.filter(booking => {
        const name = (booking.firstname + ' ' + booking.lastname).toLowerCase();
        const room = ('room ' + booking.roomid).toLowerCase();
        const email = (booking.email || '').toLowerCase();
        return !q || name.includes(q) || room.includes(q) || email.includes(q) || String(booking.id).includes(q);
      });
      render(filtered);
    });

    logoutButton.addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/admin';
    });

    loadBookings();
  </script>`);
}

function uploadPage() {
  return layout('Upload Fixture', `
    <section class="card" style="max-width: 620px; margin: 0 auto;">
      <h1>File Upload Fixture</h1>
      <p class="muted">Use this page to practice file uploads in Playwright without external dependencies.</p>
      <form id="upload-form">
        <label for="uploader-name">Name</label>
        <input id="uploader-name" name="name" placeholder="Your name" required />
        <label for="uploader-file">File</label>
        <input id="uploader-file" name="file" type="file" required />
        <button type="submit">Submit</button>
      </form>
      <div id="upload-result" class="success" style="display:none;"></div>
    </section>
  `, `
  <script>
    const form = document.getElementById('upload-form');
    const result = document.getElementById('upload-result');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fileInput = form.file;
      const fileName = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : 'none';
      result.style.display = 'block';
      result.textContent = 'Uploaded: ' + fileName;
      form.reset();
    });
  </script>`);
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { status: 'ok', service: 'stable-booking-portfolio' });
  }

  if (pathname === '/api/login' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.username === ADMIN_USERNAME && body.password === ADMIN_PASSWORD) {
      const token = randomUUID();
      state.sessions.add(token);
      return sendJson(
        res,
        200,
        { token, username: ADMIN_USERNAME },
        { 'Set-Cookie': `session=${encodeURIComponent(token)}; Path=/; SameSite=Lax` }
      );
    }
    return sendJson(res, 401, { message: 'Invalid username or password' });
  }

  if (pathname === '/api/validate' && req.method === 'POST') {
    const body = await readBody(req);
    const token = body.token || getSessionToken(req);
    if (token && state.sessions.has(token)) {
      return sendJson(res, 200, { valid: true });
    }
    return sendJson(res, 401, { valid: false, message: 'Invalid token' });
  }

  if (pathname === '/api/logout' && req.method === 'POST') {
    const token = getSessionToken(req);
    if (token) state.sessions.delete(token);
    return sendJson(res, 200, { message: 'Logged out' }, { 'Set-Cookie': 'session=; Path=/; Max-Age=0' });
  }

  if (pathname === '/api/contact' && req.method === 'POST') {
    const body = await readBody(req);
    const required = ['name', 'email', 'phone', 'subject', 'message'];
    const missing = required.filter(key => !body[key]);
    if (missing.length) {
      return sendJson(res, 400, { message: `Missing fields: ${missing.join(', ')}` });
    }
    state.contacts.push({ ...body, createdAt: new Date().toISOString() });
    return sendJson(res, 200, { message: 'Thanks for getting in touch' });
  }

  if (pathname === '/api/bookings' && req.method === 'POST') {
    const body = await readBody(req);
    const required = ['firstname', 'lastname', 'email', 'phone', 'roomid', 'bookingdates'];
    const missing = required.filter(key => body[key] === undefined || body[key] === null || body[key] === '');
    if (missing.length) {
      return sendJson(res, 400, { message: `Missing fields: ${missing.join(', ')}` });
    }
    const bookingdates = body.bookingdates || {};
    if (!bookingdates.checkin || !bookingdates.checkout) {
      return sendJson(res, 400, { message: 'Missing booking dates' });
    }
    if (bookingdates.checkout <= bookingdates.checkin) {
      return sendJson(res, 400, { message: 'Checkout must be after checkin' });
    }
    const id = state.nextBookingId++;
    const booking = {
      id,
      firstname: String(body.firstname),
      lastname: String(body.lastname),
      email: String(body.email),
      phone: String(body.phone),
      roomid: Number(body.roomid),
      depositpaid: Boolean(body.depositpaid),
      bookingdates: {
        checkin: String(bookingdates.checkin),
        checkout: String(bookingdates.checkout),
      },
      notes: String(body.notes || ''),
    };
    state.bookings.push(booking);
    return sendJson(res, 201, { bookingid: id, booking });
  }

  if (pathname === '/api/bookings' && req.method === 'GET') {
    if (!ensureAuth(req, res)) return true;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const roomId = url.searchParams.get('roomId');
    const bookings = roomId ? state.bookings.filter(b => String(b.roomid) === String(roomId)) : state.bookings;
    return sendJson(res, 200, { bookings });
  }

  const bookingIdMatch = pathname.match(/^\/api\/bookings\/(\d+)$/);
  if (bookingIdMatch) {
    if (!ensureAuth(req, res)) return true;
    const bookingId = Number(bookingIdMatch[1]);
    const index = state.bookings.findIndex(b => b.id === bookingId);

    if (req.method === 'GET') {
      if (index === -1) return sendJson(res, 404, { message: 'Booking not found' });
      return sendJson(res, 200, state.bookings[index]);
    }

    if (req.method === 'PUT') {
      if (index === -1) return sendJson(res, 404, { message: 'Booking not found' });
      const body = await readBody(req);
      const updated = {
        ...state.bookings[index],
        ...body,
        roomid: body.roomid !== undefined ? Number(body.roomid) : state.bookings[index].roomid,
        bookingdates: body.bookingdates || state.bookings[index].bookingdates,
      };
      state.bookings[index] = updated;
      return sendJson(res, 200, { bookingid: bookingId, booking: updated });
    }

    if (req.method === 'DELETE') {
      if (index === -1) return sendJson(res, 404, { message: 'Booking not found' });
      state.bookings.splice(index, 1);
      return sendJson(res, 204, {});
    }
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname.startsWith('/api/')) {
    const handled = await handleApi(req, res, pathname);
    if (handled !== false) return;
  }

  if (pathname === '/' && req.method === 'GET') {
    return send(res, 200, homePage());
  }

  if (pathname === '/admin' && req.method === 'GET') {
    return send(res, 200, isAuthenticated(req) ? dashboardPage() : loginPage());
  }

  if (pathname === '/upload' && req.method === 'GET') {
    return send(res, 200, uploadPage());
  }

  if (pathname === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Stable booking portfolio server running at http://127.0.0.1:${PORT}`);
});
