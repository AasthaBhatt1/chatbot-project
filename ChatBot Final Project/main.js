 import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `You are “Farita Academy Assistant,” an expert concierge for Farita Beauty Salon & Makeup Academy (aka “Farita Academy”) in Mumbai, India.

PRIMARY GOALS
1) Give accurate, up-to-date answers about Farita Academy’s courses, certifications, admissions, location, and contact options.
2) Guide prospects to inquire/enroll by phone/WhatsApp when pricing or schedule specifics aren’t public.
3) Be concise, friendly, and action-oriented.

CANONICAL FACTS (authoritative):
- Name: Farita Beauty Salon & Makeup Academy (“Farita Academy”).
- Founded: 1974; longstanding Mumbai brand.
- Founders: Farida Thanawala and Rita Basrur
- Leadership: Mrs. Raheela Thanawala Shaikh (globally certified makeup artist; academy director).
- Location (Academy): 215-B Wing, Laxmi Business Park (2nd Floor), Laxmi Industrial Estate, Sab TV Lane, Near Infinity Mall, Andheri West, Mumbai, Maharashtra 400053.
- Main program themes: Professional Makeup (basic→advanced), Advanced Makeup, Professional Hairstyling, SFX, Personal Grooming; government/internationally aligned certifications; portfolio shoots; hands-on training.
- Distinctives: Up to 3 certifications in Pro Makeup & Hair track; small-batch, industry-ready training; active student portfolio support.
- Current admissions signal: “Admissions open”; contact to confirm next batch and seats.
- Primary inquiry line: +91 992027 9118. (If asked for alternates, direct to site contact page.)

OPERATING RULES
- If asked “fees,” “exact start dates/timings,” or “seat availability,” respond with the best public info, then invite the user to call/WhatsApp +91 992027 9118 for the latest official quote and batch confirmation.
- If asked for services (bridal/studio), differentiate Academy (training) vs. Salon/Bridal Studio (services) and route appropriately.
- Never invent prices, discounts, or start dates not visible in provided sources.
- If asked about placements or portfolios, mention portfolio shoots, industry-relevant training, and request contact for current tie-ups or showcases.
- If the user seems outside Mumbai, offer virtual/pre-admission guidance and route to phone/WhatsApp for remote options.
- Tone: warm, encouraging, professional; keep answers to 3–6 lines unless the user asks for depth.

RESPONSE TEMPLATES
- Fees/date unknown publicly:
  “We keep batch fees and dates current by phone. Please call/WhatsApp +91 992027 9118 and we’ll share today’s quote, next start date, and seat status. Want me to summarize course options first?”
- Course overview:
  “Our Pro Makeup (basic→advanced) + Hair track includes up to 3 certifications, hands-on training, and portfolio shoots. We also offer Advanced Makeup, SFX, Hairstyling, and Personal Grooming. Would you like eligibility and duration details or to connect on +91 992027 9118?”
- Directions:
  “Find us at 215-B Wing, Laxmi Business Park (2nd Floor), Laxmi Industrial Estate, Sab TV Lane, near Infinity Mall, Andheri West, Mumbai 400053.”

ESCALATION
- When users request invoices, formal quotes, or admission forms, direct them to call/WhatsApp +91 992027 9118 or use the website contact page. Do not commit timelines or fees yourself.

SAFETY
- Do not provide medical/dermatological advice; for skin conditions refer to qualified professionals or in-person consultation.
CONTACT RULES
- Default behavior: Do NOT ask users to call or WhatsApp the academy.
If the user has already provided a contact, store it and do not ask again. 
After that, answer their queries normally.
- If the user refuses to share their contact details:
  → Provide the academy’s official contact options ONCE, then stop repeating them unless explicitly requested.
    - Phone/WhatsApp: +91 992027 9118
    - Email: raheela.afz@gmail.com
    - Address: 215-B Wing, Laxmi Business Park (2nd Floor), Laxmi Industrial Estate, Sab TV Lane, Near Infinity Mall, Andheri West, Mumbai 400053.
- After showing the official contact once, do not prompt again unless the user directly asks.
- Never loop or insist on phone numbers; always respect the user’s comfort.
DIALOGUE RULES
1. When the user first asks about services/courses, show the full menu ONCE.
   Example: 
   1. Professional Makeup (Basic–Advanced)
   2. Advanced Makeup
   3. Professional Hairstyling
   4. Special Effects (SFX)
   5. Personal Grooming

2. After showing the menu, wait for the user to select an option (by number or name).

3. Once the user selects, respond ONLY with details of that chosen option.
   - Do NOT repeat the full menu.
   - Do NOT mix details of other services.

4. If the user explicitly asks "show options again" or "all services", then re-display the menu.

5. Otherwise, continue the conversation only about the selected option (e.g., fees, duration, certification, schedule).

6. Be concise: 1 lines maximum per reply unless asked for more.

You are the AI assistant for Farita Beauty Salon & Makeup Academy in Mumbai. 
Respond warmly and professionally to user queries about:
- About Us
- Courses Offered
- Salon Services
- Contact Information
- Website & special offers

If user sends "about_us", explain the academy background.
If user sends "courses_offered", describe training programs.
If user sends "salon_services", explain beauty/makeup services.
If user sends "contact_us", share location & contact info.
If user sends free text, answer naturally but align with Farita’s services.`;

const API_KEY = "AIzaSyDwuG4kMrmXWJBi8-mW2Vm9zpkF5byNimI";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: businessInfo
});

// Replace with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNikM194SexYINdqB0f2adI6Dl6P5KSV6FeNQThDU9lxBaR_aF0h5aYPHsWiT2Mclo/exec";
let messages = { history: [] };

/* user data */
let userData = {
  phone: "",
  email: "",
  course: "",
  service: "",
  isDataCaptured: false
};

/* ----- Farita courses ----- */
const coursesOffered = [
  { 
    name: "Professional Makeup Course", 
    details: `
      A complete program designed for aspiring makeup artists. 
      - Covers basics to advanced techniques (foundation, contour, highlighting, eye makeup, etc.)
      - Bridal, party, and editorial looks
      - Product knowledge and hygiene practices
      - Portfolio-building with professional photoshoots
      - Hands-on training with live models
      - Includes certification for professional practice
      Duration: 3–6 months (depending on batch)
    `
  },
  { 
    name: "Professional Hairstyling Course", 
    details: `
      Focused training for hairstyling in bridal, fashion, and events. 
      - Hair sectioning and setting
      - Bridal buns, braids, curls, waves, and updos
      - Heat styling with tools (curling irons, straighteners, blow dryers)
      - Hair extensions and accessories
      - Trend-based styling for shoots & events
      Duration: 1–2 months
      Certification included
    `
  },
  { 
    name: "SFX Course", 
    details: `
      Special Effects Makeup training for film, TV, and theatre. 
      - Introduction to prosthetics, latex, and silicone
      - Creating wounds, scars, burns, and fantasy characters
      - Airbrushing for advanced effects
      - Color theory for SFX realism
      - Safe product usage for skin
      Duration: 1–2 months
      Perfect for students aiming at media/film industry
    `
  },
  { 
    name: "Personal Grooming Course", 
    details: `
      A short-term course designed for individuals who want to improve personal style. 
      - Daily skincare routines
      - Day & night self-makeup looks
      - Hair care and basic styling
      - Wardrobe & fashion styling tips
      - Personality development & confidence building
      Duration: 2–4 weeks
    `
  },
  { 
    name: "Advanced Makeup Course", 
    details: `
      Designed for those who have completed a basic makeup program and want to master advanced techniques. 
      - Bridal HD & Airbrush makeup
      - Editorial, runway, and high-fashion looks
      - Trend-based creative artistry
      - Advanced contouring, highlighting, and corrective makeup
      - Professional mentorship with industry experts
      Duration: 2–3 months
      Certification for advanced artistry
    `
  }
];

/* ----- Farita services ----- */
const servicesOffered = [
  { name: "Bridal Makeup Services", details: "Complete bridal looks including HD & Airbrush makeup, hairstyling, and draping." },
  { name: "Event / Party Makeup", details: "Professional makeup for parties, shoots, and special events." },
  { name: "Photoshoot Makeup & Styling", details: "Creative makeup and hairstyling tailored for professional photoshoots." },
  { name: "SFX Makeup Services", details: "Special effects makeup for theatre, short films, and creative projects." },
  { name: "Personal Grooming Sessions", details: "One-on-one sessions for self-makeup, skincare, and styling guidance." }
];

/* --------- helpers --------- */
function extractContactInfo(message) {
  const phoneRegex = /(\+91[-\s]?)?[6-9]\d{9}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phones = message.match(phoneRegex);
  const emails = message.match(emailRegex);
  return { phone: phones ? phones[0] : null, email: emails ? emails[0] : null };
}

function escapeHTML(str) {
  if(!str) return "";
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

/* --------- Send to Google Sheets --------- */
async function sendToGoogleSheets(data) {
  if (data.isDataCaptured && data._alreadySent) return;
  try {
    const url = `${GOOGLE_SCRIPT_URL}?` +
                `phone=${encodeURIComponent(data.phone||"")}` +
                `&email=${encodeURIComponent(data.email||"")}` +
                `&course=${encodeURIComponent(data.course||"")}` +
                `&service=${encodeURIComponent(data.service||"")}` +
                `&timestamp=${encodeURIComponent(new Date().toISOString())}`;

    const res = await fetch(url, { method: 'GET' });
    if (res.ok) {
      console.log('Sheet saved');
      data._alreadySent = true;
      return true;
    } else {
      console.error('Sheet save failed', res.status);
      return false;
    }
  } catch (err) {
    console.error('Error saving to sheet', err);
    return false;
  }
}

/* --------- Show course options --------- */
function showCourseOptions() {
  if (document.querySelector('.course-widget')) return;
  const chat = document.querySelector('.chat-window .chat');
  let html = `<div class="model course-widget"><p>Select a course you’re interested in:</p>`;
  coursesOffered.forEach(c => {
    html += `<label><input type="radio" name="course" value="${escapeHTML(c.name)}"> ${escapeHTML(c.name)}</label><br>`;
  });
  html += `</div>`;
  chat.insertAdjacentHTML('beforeend', html);

  document.querySelectorAll('input[name="course"]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const selected = e.target.value;
      userData.course = selected;
      const info = (coursesOffered.find(c => c.name === selected) || {}).details || "Details coming soon.";
      chat.insertAdjacentHTML("beforeend", `<div class="model"><p><b>${escapeHTML(selected)}</b>: ${escapeHTML(info)}</p></div>`);
      await sendToGoogleSheets(userData);
      chat.insertAdjacentHTML("beforeend", `<div class="model"><p>Would you like to know about our services or ask something else?</p></div>`);
      document.querySelectorAll('.course-widget').forEach(el => el.remove());
      chat.scrollTop = chat.scrollHeight;
    });
  });

  chat.scrollTop = chat.scrollHeight;
}

/* --------- Show service options --------- */
function showServiceOptions() {
  if (document.querySelector('.service-widget')) return;
  const chat = document.querySelector('.chat-window .chat');
  let html = `<div class="model service-widget"><p>Select a service you’re interested in:</p>`;
  servicesOffered.forEach(s => {
    html += `<label><input type="radio" name="service" value="${escapeHTML(s.name)}"> ${escapeHTML(s.name)}</label><br>`;
  });
  html += `</div>`;
  chat.insertAdjacentHTML('beforeend', html);

  document.querySelectorAll('input[name="service"]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const selected = e.target.value;
      userData.service = selected;
      const info = (servicesOffered.find(s => s.name === selected) || {}).details || "Details coming soon.";
      chat.insertAdjacentHTML("beforeend", `<div class="model"><p><b>${escapeHTML(selected)}</b>: ${escapeHTML(info)}</p></div>`);
      await sendToGoogleSheets(userData);
      chat.insertAdjacentHTML("beforeend", `<div class="model"><p>Would you like to know about our courses or ask something else?</p></div>`);
      document.querySelectorAll('.service-widget').forEach(el => el.remove());
      chat.scrollTop = chat.scrollHeight;
    });
  });

  chat.scrollTop = chat.scrollHeight;
}

/* --------- main chat send function --------- */
async function sendMessage() {
  const inputBox = document.querySelector(".chat-window input");
  const chatContainer = document.querySelector(".chat-window .chat");
  let userMessage = (inputBox.value || "").trim();
  if (!userMessage) return;

  inputBox.value = "";
  chatContainer.insertAdjacentHTML("beforeend", `<div class="user"><p>${escapeHTML(userMessage)}</p></div>`);
  chatContainer.insertAdjacentHTML("beforeend", `<div class="loader"></div>`);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const lower = userMessage.toLowerCase();

  // Lead capture first
  if (!userData.isDataCaptured) {
    const contactInfo = extractContactInfo(userMessage);
    if (contactInfo.phone) userData.phone = contactInfo.phone;
    if (contactInfo.email) userData.email = contactInfo.email;
    if (userData.phone || userData.email) {
      userData.isDataCaptured = true;
      await sendToGoogleSheets(userData);
      chatContainer.insertAdjacentHTML("beforeend", `<div class="model"><p>Thank you! How can I assist you further — with courses or services?</p></div>`);
      chatContainer.querySelector(".loader")?.remove();
      return;
    }
  }

  // Courses
  if (lower.includes("course")) {
    if (!userData.isDataCaptured) {
      chatContainer.insertAdjacentHTML("beforeend", `<div class="model"><p>Please share your phone or email first.</p></div>`);
      chatContainer.querySelector('.loader')?.remove();
      return;
    }
    showCourseOptions();
    chatContainer.querySelector('.loader')?.remove();
    return;
  }

  // Services
  if (lower.includes("service")) {
    if (!userData.isDataCaptured) {
      chatContainer.insertAdjacentHTML("beforeend", `<div class="model"><p>Please share your phone or email first.</p></div>`);
      chatContainer.querySelector('.loader')?.remove();
      return;
    }
    showServiceOptions();
    chatContainer.querySelector('.loader')?.remove();
    return;
  }

  // Normal chat reply
  try {
    const chat = model.startChat(messages);
    let result = await chat.sendMessageStream(userMessage);
    chatContainer.insertAdjacentHTML("beforeend", `<div class="model"><p></p></div>`);
    const latestModelMsg = chatContainer.querySelectorAll(".chat-window .chat div.model");
    const replyBox = latestModelMsg[latestModelMsg.length - 1].querySelector("p");

    let firstChunk = true;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (firstChunk) {
        chatContainer.querySelector(".loader")?.remove();
        firstChunk = false;
      }
      replyBox.insertAdjacentHTML("beforeend", escapeHTML(chunkText));
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const botReply = replyBox.innerHTML;
    messages.history.push({ role: "user", parts: [{ text: userMessage }] });
    messages.history.push({ role: "model", parts: [{ text: botReply }] });

  } catch (err) {
    chatContainer.insertAdjacentHTML("beforeend", `<div class="error"><p>Message failed. Please try again.</p></div>`);
    console.error(err);
  } finally {
    chatContainer.querySelector(".loader")?.remove();
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

/* ----- events ----- */
document.querySelector(".chat-window .input-area button").addEventListener("click", ()=>sendMessage());
document.querySelector(".chat-window input").addEventListener("keypress", (e)=> { if(e.key === 'Enter') sendMessage(); });
document.querySelector(".chat-button").addEventListener("click", ()=> {
  document.querySelector("body").classList.add("chat-open");
  const chat = document.querySelector(".chat-window .chat");
  chat.innerHTML = `<div class="model"><p>Hi, how can I help you?</p></div>
                    <div class="model"><p>Please share your phone or email so I can assist you better:</p></div>`;
});
document.querySelector(".chat-window button.close").addEventListener("click", ()=> document.querySelector("body").classList.remove("chat-open"));
