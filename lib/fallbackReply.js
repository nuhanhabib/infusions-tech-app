// Simple rule-based replies used only when no ANTHROPIC_API_KEY is configured
// (or the AI service is temporarily unavailable), so the chatbot never goes silent.

const isBangla = (t) => /[\u0980-\u09FF]/.test(t);

const rules = [
  {
    keys: ["price", "cost", "quote", "budget", "rate", "দাম", "খরচ", "মূল্য", "কত টাকা", "dam", "koto taka"],
    en: "Our pricing is tailored to your project scope, so every quote is custom. Share a short brief and our team will prepare an estimate. Want a free 30-minute consultation?",
    bn: "আপনার প্রজেক্টের পরিধি অনুযায়ী আমাদের মূল্য নির্ধারণ করা হয়। সংক্ষিপ্ত বিবরণ দিলে আমাদের টিম একটি এস্টিমেট তৈরি করবে। ফ্রি ৩০ মিনিটের কনসালটেশন নিতে চান?",
  },
  {
    keys: ["website", "web", "app", "software", "mobile", "ios", "android", "flutter", "react", "ওয়েবসাইট", "অ্যাপ", "সফটওয়্যার"],
    en: "We build custom software, websites and mobile apps (iOS/Android, React Native, Flutter) that are fast, scalable and built around your goals. What would you like to build?",
    bn: "আমরা কাস্টম সফটওয়্যার, ওয়েবসাইট ও মোবাইল অ্যাপ (iOS/Android, React Native, Flutter) তৈরি করি। আপনি কী তৈরি করতে চান?",
  },
  {
    keys: ["security", "hack", "pentest", "penetration", "vulnerab", "cyber", "সিকিউরিটি", "নিরাপত্তা", "হ্যাক"],
    en: "Security worries are completely valid. We offer vulnerability assessments, penetration testing, 24/7 threat detection and compliance support (GDPR, HIPAA, SOC 2). Shall we arrange a security assessment?",
    bn: "নিরাপত্তা নিয়ে চিন্তা স্বাভাবিক। আমরা ভালনারেবিলিটি অ্যাসেসমেন্ট, পেনিট্রেশন টেস্টিং ও ২৪/৭ থ্রেট ডিটেকশন সেবা দিই। একটি সিকিউরিটি অ্যাসেসমেন্টের ব্যবস্থা করব?",
  },
  {
    keys: ["marketing", "seo", "ads", "facebook", "google", "social", "sales", "মার্কেটিং", "বিজ্ঞাপন"],
    en: "We run SEO, Google Ads, social media and content marketing focused on measurable ROI. I can't promise exact rankings, but we can start with a free marketing audit. Interested?",
    bn: "আমরা এসইও, গুগল অ্যাডস, সোশ্যাল মিডিয়া ও কনটেন্ট মার্কেটিং করি, যেখানে ফোকাস থাকে মাপযোগ্য ফলাফলে। একটি ফ্রি মার্কেটিং অডিট করাতে চান?",
  },
  {
    keys: ["design", "ui", "ux", "logo", "brand", "video", "motion", "graphic", "ডিজাইন", "লোগো", "ভিডিও"],
    en: "Our creative team covers UI/UX, graphics, branding, motion graphics and video editing through Fusion Studio. Which one do you need?",
    bn: "আমাদের ক্রিয়েটিভ টিম UI/UX, গ্রাফিক্স, ব্র্যান্ডিং, মোশন গ্রাফিক্স ও ভিডিও এডিটিং করে। আপনার কোনটি দরকার?",
  },
  {
    keys: ["product", "cms", "doctor", "clinic", "office management", "ecommerce", "e-commerce", "store", "প্রোডাক্ট", "ডাক্তার"],
    en: "We're building three products: an e-commerce CMS, a smart practice solution for doctors, and an all-in-one office management platform. Which one interests you?",
    bn: "আমরা তিনটি প্রোডাক্ট তৈরি করছি: ই-কমার্স CMS, ডাক্তারদের জন্য স্মার্ট প্র্যাকটিস সলিউশন এবং অল-ইন-ওয়ান অফিস ম্যানেজমেন্ট প্ল্যাটফর্ম। কোনটি জানতে চান?",
  },
  {
    keys: ["contact", "phone", "call", "whatsapp", "number", "email", "যোগাযোগ", "ফোন", "নম্বর"],
    en: "You can reach our team on WhatsApp or phone at +880 1717 102387. Or leave your name and a short project brief here and we'll follow up.",
    bn: "আমাদের টিমের সাথে হোয়াটসঅ্যাপ বা ফোনে যোগাযোগ করুন: +880 1717 102387। অথবা এখানে আপনার নাম ও প্রজেক্টের সংক্ষিপ্ত বিবরণ দিন, আমরা যোগাযোগ করব।",
  },
  {
    keys: ["hello", "hi", "hey", "salam", "assalam", "হ্যালো", "হাই", "সালাম", "আসসালামু"],
    en: "Hello! I'm the Infusions Tech 24/7 assistant. Are you looking for software, marketing growth, security, or design help?",
    bn: "হ্যালো! আমি Infusions Tech-এর ২৪/৭ অ্যাসিস্ট্যান্ট। আপনি সফটওয়্যার, মার্কেটিং, সিকিউরিটি, নাকি ডিজাইনে সাহায্য খুঁজছেন?",
  },
];

export function fallbackReply(text) {
  const bn = isBangla(text);
  const lower = text.toLowerCase();
  const hit = rules.find((r) => r.keys.some((k) => lower.includes(k.toLowerCase())));
  if (hit) return bn ? hit.bn : hit.en;
  return bn
    ? "ধন্যবাদ! আপনি কোন সেবাটি নিয়ে জানতে চান: সফটওয়্যার, সাইবার সিকিউরিটি, ডিজিটাল মার্কেটিং, নাকি ডিজাইন? চাইলে ফ্রি কনসালটেশনও বুক করতে পারেন।"
    : "Thanks for reaching out! Which area are you interested in: software, cyber security, digital marketing or design? I can also help you book a free consultation.";
}