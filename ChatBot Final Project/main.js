import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `PRIMARY GOALS

Give accurate, up-to-date answers about Farita Academy's courses, certifications, admissions, location, and contact options.
Guide prospects to inquire/enroll by phone/WhatsApp when pricing or schedule specifics aren't public.
Be concise, friendly, and action-oriented.
CANONICAL FACTS
Name: Farita Beauty Salon & Makeup Academy ("Farita Academy")
Founded: 1974
Founders: Farida Thanawala and Rita Basrur
Leadership: Mrs. Raheela Thanawala Shaikh (globally certified makeup artist; academy director)
Location: 215-B Wing, Laxmi Business Park (2nd Floor), Laxmi Industrial Estate, Sab TV Lane, Near Infinity Mall, Andheri West, Mumbai, Maharashtra 400053
Programs: Professional Makeup (basic→advanced), Advanced Makeup, Professional Hairstyling, SFX, Personal Grooming
Distinctives: Up to 3 certifications in Pro Makeup & Hair track, portfolio shoots, hands-on training, small batches, industry-ready learning
Admissions: Currently open; confirm batch and seats by phone/WhatsApp
Primary inquiry line: +91 992027 9118

OPERATING RULES
If asked about fees, start dates, or seat availability, share general info and invite the user to call/WhatsApp +91 992027 9118 for the latest details.
For services, clearly differentiate Academy (training) vs. Salon/Bridal Studio (beauty services).
Do not invent prices, discounts, or start dates.
If asked about placements or portfolios, mention portfolio shoots and training; direct them to call for current tie-ups.
If user is outside Mumbai, mention virtual guidance and phone/WhatsApp for details.
Tone must be warm, encouraging, and professional. Keep replies 3–6 lines unless user asks for more.

RESPONSE TEMPLATES
Fees/Start dates: For the latest batch fees, start dates, and seat availability, please call or WhatsApp +91 992027 9118.
Course overview: Our Pro Makeup (basic→advanced) + Hair track includes up to 3 certifications, hands-on training, and portfolio shoots. We also offer Advanced Makeup, SFX, Hairstyling, and Personal Grooming. Would you like eligibility and duration details, or to connect on +91 992027 9118?
Directions: 215-B Wing, Laxmi Business Park (2nd Floor), Laxmi Industrial Estate, Sab TV Lane, near Infinity Mall, Andheri West, Mumbai 400053.

ESCALATION
For invoices, admission forms, or official quotes, direct users to call/WhatsApp +91 992027 9118 or use the website contact page.

SAFETY
Do not provide medical/dermatological advice. Refer such queries to professionals or in-person consultation.

CONTACT RULES
Ask for the user's contact only once. If shared, store it and do not request again.
If user refuses, share official contact options once:
Phone/WhatsApp: +91 992027 9118
Email: raheela.afz@gmail.com
Do not loop or insist on contacts.

DIALOGUE RULES
When asked about services/courses, show the full menu once.
Once selected, respond with details of only that option.
Re-display menu only if explicitly requested.
Continue conversation about the selected topic (fees, duration, certification, schedule).
Keep answers concise (max 1 lines unless asked for more).

ADDITIONAL CAPABILITIES
Handle unexpected questions with helpful responses about academy information.
Provide information about location, contact, admission process, certifications, and career opportunities.
Be supportive and encouraging while maintaining professional boundaries.
If user asks about topics outside academy scope, politely redirect to academy-related topics.`;

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

/* Track last selected course/service for context */
let lastSelectedCourse = "";
let lastSelectedService = "";

/* ----- Farita courses ----- */
const coursesOffered = [
  { 
    id: "1",
    name: "Professional Makeup Course", 
    duration: "3–6 months (depending on batch)",
    fees: "₹1,00,000",
    details: `A complete program designed for aspiring makeup artists. 
    - Covers basics to advanced techniques (foundation, contour, highlighting, eye makeup, etc.)
    - Bridal, party, and editorial looks
    - Product knowledge and hygiene practices
    - Portfolio-building with professional photoshoots
    - Hands-on training with live models
    - Includes certification for professional practice`
  },
  { 
    id: "2",
    name: "Professional Hairstyling Course", 
    duration: "1–2 months",
    fees: "₹65,000",
    details: `Focused training for hairstyling in bridal, fashion, and events. 
    - Hair sectioning and setting
    - Bridal buns, braids, curls, waves, and updos
    - Heat styling with tools (curling irons, straighteners, blow dryers)
    - Hair extensions and accessories
    - Trend-based styling for shoots & events
    - Certification included`
  },
  { 
    id: "3",
    name: "SFX Course", 
    duration: "1–2 months",
    fees: "₹80,000",
    details: `Special Effects Makeup training for film, TV, and theatre. 
    - Introduction to prosthetics, latex, and silicone
    - Creating wounds, scars, burns, and fantasy characters
    - Airbrushing for advanced effects
    - Color theory for SFX realism
    - Safe product usage for skin
    - Perfect for students aiming at media/film industry`
  },
  { 
    id: "4",
    name: "Personal Grooming Course", 
    duration: "2–4 weeks",
    fees: "₹25,000",
    details: `A short-term course designed for individuals who want to improve personal style. 
    - Daily skincare routines
    - Day & night self-makeup looks
    - Hair care and basic styling
    - Wardrobe & fashion styling tips
    - Personality development & confidence building`
  },
  { 
    id: "5",
    name: "Advanced Makeup Course", 
    duration: "2–3 months",
    fees: "₹90,000",
    details: `Designed for those who have completed a basic makeup program and want to master advanced techniques. 
    - Bridal HD & Airbrush makeup
    - Editorial, runway, and high-fashion looks
    - Trend-based creative artistry
    - Advanced contouring, highlighting, and corrective makeup
    - Professional mentorship with industry experts
    - Certification for advanced artistry`
  }
];

/* ----- Farita services ----- */
const servicesOffered = [
  { 
    name: "Bridal Makeup Services", 
    details: "Complete bridal looks including HD & Airbrush makeup, hairstyling, and draping.",
    duration: "3-5 hours",
    fees: "₹25,000 – ₹45,000"
  },
  { 
    name: "Event / Party Makeup", 
    details: "Professional makeup for parties, shoots, and special events.",
    duration: "2-3 hours",
    fees: "₹5,000 – ₹12,000"
  },
  {
    name: "Photoshoot Makeup & Styling",
    details: "Creative makeup and hairstyling tailored for professional photoshoots.",
    duration: "3-4 hours per shoot",
    fees: "₹10,000 – ₹20,000"
  },
  { 
    name: "SFX Makeup Services", 
    details: "Special effects makeup for theatre, short films, and creative projects.",
    duration: "Project-based (varies)",
    fees: "₹15,000 and above"
  },
  { 
    name: "Personal Grooming Sessions", 
    details: "One-on-one sessions for self-makeup, skincare, and styling guidance.",
    duration: "2-3 hours",
    fees: "₹3,000 – ₹7,000"
  }
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
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* --------- Send to Google Sheets --------- */
async function sendToGoogleSheets(data) {
  if (data.isDataCaptured && data._alreadySent) return;
  try {
    const url =
      `${GOOGLE_SCRIPT_URL}?` +
      `phone=${encodeURIComponent(data.phone || "")}` +
      `&email=${encodeURIComponent(data.email || "")}` +
      `&course=${encodeURIComponent(data.course || "")}` +
      `&service=${encodeURIComponent(data.service || "")}` +
      `&timestamp=${encodeURIComponent(new Date().toISOString())}`;

    const res = await fetch(url, { method: "GET" });
    if (res.ok) {
      console.log("Sheet saved");
      data._alreadySent = true;
      return true;
    } else {
      console.error("Sheet save failed", res.status);
      return false;
    }
  } catch (err) {
    console.error("Error saving to sheet", err);
    return false;
  }
}

function showCourseOptions() {
  if (document.querySelector(".course-widget")) return;
  const chat = document.querySelector(".chat-window .chat");
  let html = `<div class="model course-widget"><p>Select a course you're interested in:</p>`;
  coursesOffered.forEach(c => {
    html += `<label><input type="radio" name="course" value="${escapeHTML(c.name)}"> ${escapeHTML(c.name)}</label><br>`;
  });
  html += `</div>`;
  chat.insertAdjacentHTML("beforeend", html);

  document.querySelectorAll('input[name="course"]').forEach(input => {
    input.addEventListener("change", async e => {
      const selected = e.target.value;
      userData.course = selected;
      lastSelectedCourse = selected; // Track selection

      const course = coursesOffered.find(c => c.name === selected);
      const info = course?.details || "Details coming soon.";
      const duration = course?.duration ? `<br><b>Duration:</b> ${escapeHTML(course.duration)}` : "";
      const fees = course?.fees ? `<br><b>Fees:</b> ${escapeHTML(course.fees)}` : "";

      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p><b>${escapeHTML(selected)}</b>: ${escapeHTML(info)}${duration}${fees}</p></div>`
      );

      // send data
      await sendToGoogleSheets(userData);

      // contact info
      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>📞 Feel free to contact us at 
          <a href="tel:+919920279118"><b>+91 99202 79118</b></a> 
          or email 
          <a href="mailto:raheela.afz@gmail.com"><b>raheela.afz@gmail.com</b></a>
        </p></div>`
      );

      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>Would you like to know about our services or ask something else?</p></div>`
      );

      document.querySelectorAll(".course-widget").forEach(el => el.remove());
      chat.scrollTop = chat.scrollHeight;
    });
  });

  chat.scrollTop = chat.scrollHeight;
}

function showServiceOptions() {
  if (document.querySelector(".service-widget")) return;
  const chat = document.querySelector(".chat-window .chat");
  let html = `<div class="model service-widget"><p>Select a service you're interested in:</p>`;
  servicesOffered.forEach(s => {
    html += `<label><input type="radio" name="service" value="${escapeHTML(s.name)}"> ${escapeHTML(s.name)}</label><br>`;
  });
  html += `</div>`;
  chat.insertAdjacentHTML("beforeend", html);

  document.querySelectorAll('input[name="service"]').forEach(input => {
    input.addEventListener("change", async e => {
      const selected = e.target.value;
      userData.service = selected;
      lastSelectedService = selected; // Track selection

      const srv = servicesOffered.find(s => s.name === selected);
      const info = srv?.details || "Details coming soon.";
      const duration = srv?.duration ? `<br><b>Duration:</b> ${escapeHTML(srv.duration)}` : "";
      const fees = srv?.fees ? `<br><b>Fees:</b> ${escapeHTML(srv.fees)}` : "";

      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p><b>${escapeHTML(selected)}</b>: ${escapeHTML(info)}${duration}${fees}</p></div>`
      );

      await sendToGoogleSheets(userData);

      // contact info
      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>📞 Feel free to contact us at 
          <a href="tel:+919920279118"><b>+91 99202 79118</b></a> 
          or email 
          <a href="mailto:raheela.afz@gmail.com"><b>raheela.afz@gmail.com</b></a>
        </p></div>`
      );

      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>What more do you want to hear about?</p></div>`
      );

      document.querySelectorAll(".service-widget").forEach(el => el.remove());
      chat.scrollTop = chat.scrollHeight;
    });
  });

  chat.scrollTop = chat.scrollHeight;
}

/* --------- Handle fallback responses for unexpected questions --------- */
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  // Handle greetings
  if (lower.match(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/)) {
    return "Hello! Welcome to Farita Academy. I'm here to help you with information about our makeup and hairstyling courses, beauty services, admissions, and more. How can I assist you today?";
  }
  
  // Handle location/address queries
  if (lower.match(/\b(location|address|where|directions|map)\b/)) {
    return "📍 Farita Academy is located at:<br><b>215-B Wing, Laxmi Business Park (2nd Floor)</b><br>Laxmi Industrial Estate, Sab TV Lane<br>Near Infinity Mall, Andheri West<br>Mumbai, Maharashtra 400053<br><br>Call +91 99202 79118 for detailed directions!";
  }
  
  // Handle contact queries
  if (lower.match(/\b(contact|phone|call|email|reach)\b/)) {
    return "📞 <b>Contact Farita Academy:</b><br>Phone/WhatsApp: +91 99202 79118<br>Email: raheela.afz@gmail.com<br><br>Our team is ready to help with all your questions about courses and services!";
  }
  
  // Handle admission queries
  if (lower.match(/\b(admission|enroll|join|apply|registration)\b/)) {
    return "🎓 <b>Admissions are currently OPEN!</b><br>To enroll, please call/WhatsApp +91 99202 79118. Our team will guide you through the admission process, batch schedules, and documentation required.";
  }
  
  // Handle timing/schedule queries
  if (lower.match(/\b(timing|schedule|batch|time|when|start)\b/)) {
    return "🕒 We offer flexible batch timings including morning, afternoon, and weekend batches. For current batch schedules and availability, please call +91 99202 79118.";
  }
  
  // Handle certification queries
  if (lower.match(/\b(certificate|certification|diploma)\b/)) {
    return "🏆 Yes! All our courses provide professional certifications upon completion. Our Professional Makeup + Hair track offers up to 3 certifications. Call +91 99202 79118 for details!";
  }
  
  // Handle portfolio queries
  if (lower.match(/\b(portfolio|photoshoot|photos|shoot)\b/)) {
    return "📸 Portfolio shoots are included in our Professional and Advanced Makeup courses! This helps you build a professional portfolio to showcase your skills. Contact +91 99202 79118 for more details.";
  }
  
  // Handle career/job queries
  if (lower.match(/\b(job|career|placement|work|opportunity)\b/)) {
    return "💼 Our courses prepare you for careers as freelance makeup artists, bridal specialists, fashion artists, and more. We provide industry-ready training. Call +91 99202 79118 to discuss career opportunities!";
  }
  
  // Handle about/history queries
  if (lower.match(/\b(about|history|founder|established|since)\b/)) {
    return "🏛️ Farita Academy was founded in 1974 by Farida Thanawala and Rita Basrur. Today, it's led by Mrs. Raheela Thanawala Shaikh, a globally certified makeup artist. We have 50+ years of excellence in beauty education!";
  }
  
  // Handle thank you
  if (lower.match(/\b(thank|thanks|grateful)\b/)) {
    return "You're most welcome! 😊 Is there anything else you'd like to know about Farita Academy? I'm here to help!";
  }
  
  // Handle goodbye
  if (lower.match(/\b(bye|goodbye|see you|take care)\b/)) {
    return "Thank you for your interest in Farita Academy! 🎨 Don't forget to call us at +91 99202 79118 for any questions. Have a wonderful day!";
  }
  
  // Default fallback for truly unexpected questions
  return "I'd be happy to help you with information about Farita Academy! I can assist you with:<br><br>• Course details and fees<br>• Beauty services offered<br>• Location and contact information<br>• Admission process<br>• Certifications and portfolio<br><br>What would you like to know? Or feel free to call us at +91 99202 79118! 😊";
}

/* --------- main chat send function --------- */
async function sendMessage() {
  const inputBox = document.querySelector(".chat-window input");
  const chatContainer = document.querySelector(".chat-window .chat");
  let userMessage = (inputBox.value || "").trim();
  if (!userMessage) return;

  inputBox.value = "";
  chatContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="user"><p>${escapeHTML(userMessage)}</p></div>`
  );
  chatContainer.insertAdjacentHTML("beforeend", `<div class="loader"></div>`);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const lower = userMessage.toLowerCase();

  /* ---- STRICT CHECK: block everything until contact captured ---- */
  if (!userData.isDataCaptured) {
    const contactInfo = extractContactInfo(userMessage);
    if (contactInfo.phone) userData.phone = contactInfo.phone;
    if (contactInfo.email) userData.email = contactInfo.email;

    if (userData.phone || userData.email) {
      userData.isDataCaptured = true;
      await sendToGoogleSheets(userData);
      chatContainer.querySelector(".loader")?.remove();
      chatContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>Thank you! How can I assist you further — with courses or services?</p></div>`
      );
    } else {
      chatContainer.querySelector(".loader")?.remove();
      chatContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="model"><p>Please share your phone or email first so I can assist you better.</p></div>`
      );
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return;
  }

  /* ---- Fees / Duration / Timings handling ---- */
  if (/\b(fee|fees|price|cost|how much|charges|start date|start dates|start|batch|schedule|date|time|duration)\b/.test(lower)) {
    chatContainer.querySelector(".loader")?.remove();

    if (lastSelectedCourse) {
      const course = coursesOffered.find(c => c.name === lastSelectedCourse);
      if (course) {
        chatContainer.insertAdjacentHTML("beforeend", 
          `<div class="model"><p>
            For <b>${escapeHTML(course.name)}</b>:<br>
            Duration: ${escapeHTML(course.duration)}<br>
            Fees: ${escapeHTML(course.fees)}
          </p></div>`
        );
      }
    } else if (lastSelectedService) {
      const srv = servicesOffered.find(s => s.name === lastSelectedService);
      if (srv) {
        chatContainer.insertAdjacentHTML("beforeend", 
          `<div class="model"><p>
            For <b>${escapeHTML(srv.name)}</b>:<br>
            Duration: ${escapeHTML(srv.duration)}<br>
            Fees: ${escapeHTML(srv.fees)}
          </p></div>`
        );
      }
    } else {
      chatContainer.insertAdjacentHTML("beforeend", 
        `<div class="model"><p>
          Please tell me which course or service you mean (or reply with the course number).
        </p></div>`
      );
    }

    chatContainer.insertAdjacentHTML("beforeend", 
      `<div class="model"><p>Would you like to know about our services or anything else?</p></div>`
    );

    chatContainer.scrollTop = chatContainer.scrollHeight;
    return;
  }

  /* ---- Course trigger ---- */
  if (lower.includes("course")) {
    showCourseOptions();
    chatContainer.querySelector(".loader")?.remove();
    return;
  }

  /* ---- Service trigger ---- */
  if (lower.includes("service")) {
    showServiceOptions();
    chatContainer.querySelector(".loader")?.remove();
    return;
  }

  // Try AI response first, with fallback for unexpected questions
  try {
    const chat = model.startChat(messages);
    let result = await chat.sendMessageStream(userMessage);

    chatContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="model"><p></p></div>`
    );
    const latestModelMsg = chatContainer.querySelectorAll(
      ".chat-window .chat div.model"
    );
    const replyBox = latestModelMsg[latestModelMsg.length - 1].querySelector("p");

    let firstChunk = true;
    let aiResponse = "";
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (firstChunk) {
        chatContainer.querySelector(".loader")?.remove();
        firstChunk = false;
      }
      aiResponse += chunkText;
      replyBox.insertAdjacentHTML("beforeend", escapeHTML(chunkText));
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // If AI response is too generic or short, supplement with fallback
    if (aiResponse.length < 50 || aiResponse.toLowerCase().includes("i don't know") || aiResponse.toLowerCase().includes("i'm not sure")) {
      const fallbackResponse = getFallbackResponse(userMessage);
      replyBox.innerHTML = fallbackResponse;
    }

    messages.history.push({ role: "user", parts: [{ text: userMessage }] });
    messages.history.push({ role: "model", parts: [{ text: replyBox.textContent || replyBox.innerText }] });
    
  } catch (err) {
    console.error("AI API Error:", err);
    chatContainer.querySelector(".loader")?.remove();
    
    // Use fallback response when AI fails
    const fallbackResponse = getFallbackResponse(userMessage);
    chatContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="model"><p>${fallbackResponse}</p></div>`
    );
  }
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* ----- events ----- */
document
  .querySelector(".chat-window .input-area button")
  .addEventListener("click", () => sendMessage());

document
  .querySelector(".chat-window input")
  .addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

document.querySelector(".chat-button").addEventListener("click", () => {
  document.querySelector("body").classList.add("chat-open");
  const chat = document.querySelector(".chat-window .chat");
  chat.innerHTML = `<div class="model"><p>Hi! Welcome to Farita Academy! </p></div>
                    <div class="model"><p>Please share your phone or email so I can assist you better:</p></div>`;
});

document
  .querySelector(".chat-window button.close")
  .addEventListener("click", () =>
    document.querySelector("body").classList.remove("chat-open")
  );

  