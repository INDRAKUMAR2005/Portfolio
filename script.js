/* ===========================
   SCRIPT.JS - Portfolio Logic
=========================== */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// ⚠️ OpenAI Key is now handled securely in the backend (api/chat.js)
// No need to expose it here in the frontend code.

// Web3Forms — free email service, sends directly to your Gmail, no backend needed
// Access key is tied to: indrakumar.m2005@gmail.com
const WEB3FORMS_KEY = "93dc77b7-baf0-4eda-b13f-875253db9747"; // Web3Forms key → emails go to indrakumar.m2005@gmail.com

const OWNER_INFO = {
  name: "Indra Kumar M",
  role: "Aspiring AI Software Developer & Product Manager",
  email: "indrakumar.m2005@gmail.com",
  phone: "+91 9095334806",
  linkedin: "https://www.linkedin.com/in/indra-kumar-65989a367/",
  resume: "https://drive.google.com/file/d/1WHGIITmDNjI7-MozYK7fpRancWSXQfO7/view?usp=drive_link",
  skills: "Java, Spring Boot, React, Next.js, Node.js, MongoDB, Supabase, Python, HTML, CSS, Tailwind CSS",
  experience: "Software Development Engineer Intern at Six Phrase Pvt Ltd, Software Development Intern at Cognifyz Technologies, Event Organizer at Nandha Hackathons",
  projects: "RepoLens (AI repo visualizer), SmartBookmark App, Money Manager, AI Feedback System"
};

// ─── EMAIL NOTIFICATION (Web3Forms) ──────────────────────────────────────────
async function sendEmailNotification({ subject, fromName, fromEmail, phone, message }) {
  // Only send if key is configured
  if (!WEB3FORMS_KEY || WEB3FORMS_KEY === 'YOUR_WEB3FORMS_KEY') {
    console.log('📧 [Email not sent — Web3Forms key not configured]');
    console.log('📬 Lead Data:', { subject, fromName, fromEmail, phone, message });
    return;
  }
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: subject,
        from_name: fromName,
        email: OWNER_INFO.email,        // YOUR email — where you receive notifications
        reply_to: fromEmail,            // Visitor's email — so you can reply directly
        message: message,
        phone: phone || 'Not provided',
        botcheck: false
      })
    });
    console.log('✅ Email notification sent to', OWNER_INFO.email);
  } catch (err) {
    console.warn('Email notification failed:', err);
  }
}

// ─── STAR FIELD (Space Background) ───────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStar() {
    const size = Math.random();
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: size < 0.7 ? 0.4 : size < 0.9 ? 0.8 : 1.2,   // mostly tiny
      alpha: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.008 + 0.002,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      // purple, red, or white tinted stars
      color: Math.random() > 0.8
        ? `rgba(225,29,72,`        // crimson red
        : Math.random() > 0.6
          ? `rgba(168,99,255,`     // purple
          : Math.random() > 0.5
            ? `rgba(200,160,255,`  // soft violet
            : `rgba(255,255,255,`  // white
    };
  }

  function init() {
    resize();
    // ~180 stars — enough for space feel, not too busy
    stars = Array.from({ length: 180 }, createStar);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      // Twinkle
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 0.75) { s.alpha = 0.75; s.twinkleDir = -1; }
      if (s.alpha <= 0.05) { s.alpha = 0.05; s.twinkleDir = 1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ─── PARTICLES (disabled — using star field instead) ─────────────────────────

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '0,212,170' : Math.random() > 0.5 ? '59,130,246' : '245,158,11'
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 100 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,170,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ─── DYNAMIC TITLE TYPEWRITER ─────────────────────────────────────────────────
const titles = [
  'AI Software Developer',
  'Product Manager',
  'Backend Engineer',
  'Open Source Contributor',
  'Community Organizer',
  'Java Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const dynamicTitle = document.getElementById('dynamic-title');

function typeTitle() {
  const current = titles[titleIndex];
  if (isDeleting) {
    dynamicTitle.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    dynamicTitle.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; }, 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
  }

  const speed = isDeleting ? 60 : 100;
  setTimeout(typeTitle, speed);
}

typeTitle();

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + (target >= 1000 ? '+' : '');
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + (target >= 1000 ? '+' : '');
      }
    };
    update();
  });
}

// ─── INTERSECTION OBSERVER ────────────────────────────────────────────────────
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';

      // Trigger counters when about section is visible
      if (entry.target.closest('#about')) {
        animateCounters();
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.glass-card, .stat-item, .timeline-content, .project-card, .skill-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');
const aiResponseText = document.getElementById('ai-response-text');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  // Show loading
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'flex';
  submitBtn.disabled = true;
  formSuccess.style.display = 'none';
  formError.style.display = 'none';

  try {
    const userMessageContent = `Contact from: ${name} (${email}${phone ? ', ' + phone : ''})
Subject: ${subject}
Message: ${message}`;

    // Call Vercel Serverless Function (api/chat.js) for AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessageContent,
        history: [] // No history for contact form, just one-off generation
      })
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    const aiReply = data.reply;

    // ✅ Send email notification to Indra's Gmail
    await sendEmailNotification({
      subject: `📬 Portfolio Contact: ${subject}`,
      fromName: name,
      fromEmail: email,
      phone: phone,
      message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from: Indra Kumar Portfolio`
    });

    aiResponseText.textContent = aiReply;
    formSuccess.style.display = 'flex';
    contactForm.reset();
  } catch (err) {
    console.error('Contact form error:', err);
    // Send email even on OpenAI failure
    sendEmailNotification({
      subject: `📬 Portfolio Contact: ${subject}`,
      fromName: name,
      fromEmail: email,
      phone: phone,
      message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from: Indra Kumar Portfolio`
    });
    aiResponseText.textContent = `Thank you ${name}! Your message has been received. Indra Kumar will get back to you at ${email} shortly.`;
    formSuccess.style.display = 'flex';
    contactForm.reset();
  } finally {
    submitBtn.querySelector('.btn-text').style.display = 'flex';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
    submitBtn.disabled = false;
  }
});

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatIcon = document.getElementById('chat-icon');
const chatCloseIcon = document.getElementById('chat-close-icon');
const chatNotification = document.getElementById('chat-notification');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMinimize = document.getElementById('chatbot-minimize');

// Conversation state
let chatState = {
  step: 'name', // name → email → phone → purpose → done
  userData: {},
  history: [] // System prompt is now handled in backend (api/chat.js)
};

chatbotToggle.addEventListener('click', () => {
  const isOpen = chatbotContainer.classList.contains('open');
  if (isOpen) {
    chatbotContainer.classList.remove('open');
    chatIcon.style.display = 'block';
    chatCloseIcon.style.display = 'none';
  } else {
    chatbotContainer.classList.add('open');
    chatIcon.style.display = 'none';
    chatCloseIcon.style.display = 'block';
    chatNotification.style.display = 'none';
    chatbotInput.focus();
  }
});

chatbotMinimize.addEventListener('click', () => {
  chatbotContainer.classList.remove('open');
  chatIcon.style.display = 'block';
  chatCloseIcon.style.display = 'none';
});

function addMessage(text, isUser = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = text.replace(/\n/g, '<br>');

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function addTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'chat-message bot-message';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-robot"></i></div>
    <div class="message-bubble" style="padding:12px 16px;">
      <span style="display:flex;gap:4px;align-items:center;">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--primary);animation:pulse-badge 1s ease-in-out infinite;"></span>
        <span style="width:6px;height:6px;border-radius:50%;background:var(--primary);animation:pulse-badge 1s ease-in-out 0.2s infinite;"></span>
        <span style="width:6px;height:6px;border-radius:50%;background:var(--primary);animation:pulse-badge 1s ease-in-out 0.4s infinite;"></span>
      </span>
    </div>`;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

const stepPrompts = {
  name: "👋 Hi there! I'm Indra's AI assistant. I'd love to help you connect with him!\n\nCould you start by sharing your **name**?",
  email: "Great to meet you, {name}! 😊\n\nWhat's your **email address** so Indra can reach you?",
  phone: "Perfect! Could you share your **phone number** (optional — you can skip by typing 'skip')?",
  purpose: "Almost done! What's the **purpose of your visit**? (e.g., job opportunity, collaboration, project inquiry, just saying hi)",
  done: "🎉 Thank you, {name}! Your details have been noted. Indra Kumar will reach out to you at **{email}** soon!\n\nFeel free to ask me anything about his skills, projects, or experience!"
};

async function getBotResponse(userMessage) {
  // Handle step-by-step data collection
  if (chatState.step === 'name') {
    chatState.userData.name = userMessage;
    chatState.step = 'email';
    return stepPrompts.email.replace('{name}', userMessage);
  }

  if (chatState.step === 'email') {
    if (!userMessage.includes('@')) {
      return "That doesn't look like a valid email. Could you please enter a valid **email address**?";
    }
    chatState.userData.email = userMessage;
    chatState.step = 'phone';
    return stepPrompts.phone;
  }

  if (chatState.step === 'phone') {
    chatState.userData.phone = userMessage.toLowerCase() === 'skip' ? 'Not provided' : userMessage;
    chatState.step = 'purpose';
    return stepPrompts.purpose;
  }

  if (chatState.step === 'purpose') {
    chatState.userData.purpose = userMessage;
    chatState.step = 'done';

    const { name, email, phone, purpose } = chatState.userData;

    // ✅ Send email notification to Indra's Gmail
    sendEmailNotification({
      subject: `🤝 New Portfolio Lead: ${name}`,
      fromName: name,
      fromEmail: email,
      phone: phone,
      message: `🎯 NEW LEAD FROM PORTFOLIO CHATBOT\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPurpose: ${purpose}\n\n---\nCollected via: AI Chatbot on Indra Kumar Portfolio\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    });

    return stepPrompts.done
      .replace('{name}', chatState.userData.name)
      .replace('{email}', chatState.userData.email);
  }

  // After data collection, use OpenAI for free-form Q&A
  try {
    chatState.history.push({ role: 'user', content: userMessage });

    // Call Vercel Serverless Function (api/chat.js)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: chatState.history
      })
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    const reply = data.reply;
    chatState.history.push({ role: 'assistant', content: reply });
    return reply;
  } catch (err) {
    return "I'm having a little trouble right now. You can reach Indra directly at **indrakumar.m2005@gmail.com** or **+91 9095334806**!";
  }
}

async function handleChatSend() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatbotInput.value = '';
  chatbotSend.disabled = true;

  addTypingIndicator();

  // Small delay for UX
  await new Promise(r => setTimeout(r, 800));

  const reply = await getBotResponse(message);
  removeTypingIndicator();
  addMessage(reply, false);
  chatbotSend.disabled = false;
  chatbotInput.focus();
}

chatbotSend.addEventListener('click', handleChatSend);
chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleChatSend();
});

// ─── SMOOTH SCROLL ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── CURSOR GLOW EFFECT ───────────────────────────────────────────────────────
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.1s, top 0.1s;
`;
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ─── PAGE LOAD ANIMATION ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});
