export type WorkItem = {
  title: string;
  year: string;
  category: string;
  image: string;
  description: string;
  link?: string;
};

export const identity = {
  name: "Suhassai Masetty",
  monogram: "SM",
  role: "AI-assisted builder / digital marketing",
  location: "Hyderabad, Telangana, India",
  email: "",
  intro:
    "JEE 2026 aspirant and Head of Digital Marketing at Masetty Agro Products. I learn by coding with AI, testing ideas, and studying the patterns that make content spread.",
};

export const links = {
  primary: "#work",
  contact: "https://www.linkedin.com/in/suhassai-masetty-b65795403",
  archive: "#archive",
  linkedin: "https://www.linkedin.com/in/suhassai-masetty-b65795403",
  instagram: "https://www.instagram.com/suuuuuuhas/",
  instagramHandle: "suuuuuuhas",
  whatsapp: "https://wa.me/919550562098",
  masettyAgro: "https://masettyagro.in/",
};

export const workItems: WorkItem[] = [
  {
    title: "Bakrid Campaign",
    year: "2026",
    category: "Festival creative",
    image: "/work/bakrid-masetty.jpg",
    description: "A Masetty / Krishnaveni festive greeting visual built around green, gold, and cultural illustration.",
  },
  {
    title: "Pulse Polio Day",
    year: "2026",
    category: "Public awareness",
    image: "/work/pulse-polio-day.jpg",
    description: "A health-awareness poster using strong contrast, circular framing, and clear public-service copy.",
  },
  {
    title: "Holi Campaign",
    year: "2026",
    category: "Festival creative",
    image: "/work/holi-campaign.jpg",
    description: "A bright seasonal communication piece with playful color, handprint motifs, and celebration-led layout.",
  },
  {
    title: "Maha Shivaratri",
    year: "2026",
    category: "Festival creative",
    image: "/work/maha-shivaratri.jpg",
    description: "A devotional greeting visual with textured paper, centered iconography, and high-contrast typography.",
  },
  {
    title: "Pongal Campaign",
    year: "2026",
    category: "Festival creative",
    image: "/work/pongal-campaign.jpg",
    description: "A warm harvest-festival composition for Masetty with traditional visual motifs and bold hierarchy.",
  },
];

export const proofSignals = [
  "Head of Digital Marketing at Masetty Agro Products since Jan 2026",
  "Secured 98.72 percentile in JEE Main 2026 and State Rank 1725 in TG EAPCET 2026",
  "Scored 99.2% in Telangana State Board Intermediate and 93.4% in ICSE",
];

export const digitalProjects = [
  {
    title: "Masetty Agro",
    label: "Website developed",
    url: "https://masettyagro.in/",
    description:
      "A product-led website for Masetty Agro, presenting rice variants, origin promise, process, facilities, and ordering paths.",
  },
  {
    title: "YouTube Short 01",
    label: "Content experiment",
    url: "https://youtube.com/shorts/9F-bvaMYZug?si=d2IyLdjr9ND0xBu1",
    description: "Short-form video editing and content work exploring storytelling, reach, and audience attention.",
  },
  {
    title: "YouTube Short 02",
    label: "Content experiment",
    url: "https://youtube.com/shorts/TtkD-8iqFPo?si=Q2ak2q3ji0PKNBoe",
    description: "A second YouTube Shorts piece from the editing and content-creation archive.",
  },
];

export const githubProjects = [
  {
    title: "Ridge Runner",
    label: "Playable original game",
    url: "https://github.com/suuuuuuhas/ridge-runner",
    description: "A playable original hill-racing game built with Codex.",
    isPrivate: true,
  },
  {
    title: "Barricade Lab",
    label: "Research toolkit",
    url: "https://github.com/suuuuuuhas/barricade-lab",
    description: "An authorization-bounded Barricade research and replay analysis toolkit.",
    isPrivate: true,
  },
  {
    title: "Wardrobe",
    label: "AI product",
    url: "https://github.com/suuuuuuhas/wardrobe",
    description: "A local-first AI wardrobe and outfit manager.",
    isPrivate: true,
  },
  {
    title: "30-Day Forge",
    label: "Progress app",
    url: "https://github.com/suuuuuuhas/30-day-forge",
    description: "An evidence-first 30-day progress and goal tracking app.",
    isPrivate: true,
  },
  {
    title: "Suhassai Portfolio",
    label: "This website",
    url: "https://github.com/suuuuuuhas/suhassai-portfolio",
    description: "An interactive React portfolio with cursor-reactive portrait moments.",
    isPrivate: false,
  },
];

export const profileHighlights = [
  "Passionate about problem-solving, analytical thinking, AI, and digital creativity",
  "Good with short-form video editing and currently learning long-form video editing",
  "Secured 98.72 percentile in JEE Main 2026",
  "Earned State Rank 1725 in TG EAPCET 2026",
  "Experienced with branding and design tools like Canva",
  "Working on Excla.in while exploring engineering opportunities and tech-driven fields",
  "Contributes to a family-owned FMCG agro company through branding, promotional content, and digital strategy",
];

export const experienceItems = [
  {
    title: "Head of Digital Marketing",
    org: "Masetty Agro Products",
    period: "Jan 2026 - Present",
    location: "Miryalaguda, Telangana, India",
    description:
      "Contributing through branding, promotional content, digital strategy, and web presence for a family-owned FMCG agro company.",
  },
];

export const educationItems = [
  {
    school: "Sri Abhida JC",
    board: "Telangana State Board of Intermediate Education, PCM",
    period: "May 2024 - May 2026",
    grade: "99.2%",
    note:
      "IIT-JEE aspirant with strong interest in chemistry, physics, and problem-solving. Secured 98.72 percentile in JEE Main 2026 and State Rank 1725 in TG EAPCET 2026.",
  },
  {
    school: "The Future Kid's School, Hyderabad",
    board: "Council for the Indian School Certificate Examinations, CISCE",
    period: "Jun 2023 - Apr 2024",
    grade: "93.4%",
    note: "ICSE background with strong academic performance.",
  },
];
