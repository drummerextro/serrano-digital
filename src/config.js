// ---------------------------------------------------------------------------
// SITE CONFIG — edit this file to update business info, prices, and service
// area anywhere on the site. Every component below imports from here instead
// of hard-coding text, so a change here updates the whole site at once.
// ---------------------------------------------------------------------------

export const business = {
  name: 'Serrano Digital',
  owner: 'Luis Serrano',
  ownerFirstName: 'Danny',
  credential: 'CompTIA A+ Certified',
  phoneDisplay: '754-280-1143',
  phoneHref: 'tel:+17542801143',
  smsHref: 'sms:+17542801143',
  email: 'serranodigitalco@gmail.com',
  website: 'https://serranodigital.co',
  domain: 'serranodigital.co',
  baseLocation: 'West 61st Street, Lincoln Square',
  serviceAreaShort: 'West 50th–West 70th, Manhattan',
  serviceAreaLong: 'West 50th Street through West 70th Street, Manhattan',
  neighborhoods: 'Lincoln Square, the Upper West Side and Midtown West',
  // City/region only — no home street number is published anywhere on the
  // site or in structured data, for the owner's safety/privacy.
  addressLocality: 'New York',
  addressRegion: 'NY',
};

// Pricing — shown on the Pricing section. Update the numbers as your rates
// change; the copy sentences pull the numbers in automatically.
export const pricing = {
  inHomeFirstHour: 150,
  inHomeIncrementMinutes: 30,
  remoteHourly: 100,
  businessHourlyFrom: 175,
};

// Contact form submission target.
// Default: FormSubmit.co — a free, zero-backend form relay. The first
// submission triggers a one-time confirmation email to `business.email`
// that you must click to activate delivery. No signup or API key needed.
// To switch providers later (Formspree, a Vercel/Cloudflare function, etc.),
// change FORM_ACTION and, if needed, the hidden fields in Contact.astro.
export const FORM_ACTION = `https://formsubmit.co/${business.email}`;

// Nav links shown in the header (id must match a section's `id` attribute).
export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Small Business IT', href: '#business' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const services = [
  {
    title: 'Computer Help',
    description:
      'Slow computers, crashes, startup problems, software issues and everyday troubleshooting.',
  },
  {
    title: 'Wi-Fi & Networking',
    description:
      'Router setup, weak connections, devices dropping offline and home-network problems.',
  },
  {
    title: 'Printers & Home Tech',
    description:
      'Printers, scanners, streaming devices, smart TVs and technology that refuses to cooperate.',
  },
  {
    title: 'New Computer Setup',
    description:
      'Updates, software, account setup, data transfer and getting a new machine ready to use.',
  },
  {
    title: 'Upgrades & Repairs',
    description:
      'SSD and RAM upgrades, hardware diagnostics, component replacement and operating-system problems.',
  },
  {
    title: 'Data Transfer & Backup',
    description:
      'Moving files between machines, drive cloning and basic backup setup.',
  },
  {
    title: 'Small Business IT',
    description:
      'Workstations, networking, printers, employee setup, WordPress and occasional IT support without needing a full-time IT employee.',
    href: '#business',
  },
];

export const businessServices = [
  'Workstation setup',
  'Wi-Fi and network troubleshooting',
  'Printers',
  'New employee setup',
  'Hardware upgrades',
  'Windows and Mac support',
  'WordPress and website support',
  'Remote troubleshooting',
  'Occasional IT help — no long-term managed-services contract required',
];

export const faqs = [
  {
    q: 'Do you come to apartments?',
    a: "Yes. In-home service is the main focus of Serrano Digital's neighborhood tech support.",
  },
  {
    q: 'Do you work on Macs?',
    a: 'Yes. Windows PCs and Macs are both supported.',
  },
  {
    q: 'Can you help with Wi-Fi and printers?',
    a: 'Yes.',
  },
  {
    q: 'Do I need to bring my computer somewhere?',
    a: 'Usually not. Many problems can be diagnosed or repaired in-home.',
  },
  {
    q: 'Do you offer remote support?',
    a: 'Yes. Some software and configuration issues can be handled remotely.',
  },
  {
    q: 'What areas do you serve?',
    a: 'Primarily Manhattan from West 50th Street through West 70th Street, especially Lincoln Square, Upper West Side and Midtown West.',
  },
  {
    q: 'Do you help businesses?',
    a: 'Yes. Small-business IT support is available without requiring a long-term contract.',
  },
  {
    q: 'What if the problem cannot be fixed during the visit?',
    a: "I'll explain the diagnosis and the next practical step before any additional work or parts are authorized.",
  },
];
