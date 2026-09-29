// ---------------------------------------------------------------------------
// SERRA — guided decision-tree assistant (v1: no AI API, just a scripted
// flow). Everything that talks to a model later should replace the
// `getSerraReply()` stub below — the rest of the state machine (steps,
// rendering, summary building) can stay as-is.
// ---------------------------------------------------------------------------
import { business } from '../config.js';

const CATEGORY_LABELS = {
  computer: "My computer isn't working",
  network: 'I have a Wi-Fi or printer problem',
  setup: "I'm setting up something new",
  business: 'I need business IT help',
  other: 'Something else',
};

// The guided flow. Each step is either:
//   { type: 'options', prompt, options: [{ label, value }], key, next }
//   { type: 'input',   prompt, placeholder, key, next }
// `next` can be a string (next step id) or a function(state) => step id,
// which is how the flow skips the home/business question when the user
// already said "business IT help".
const STEPS = {
  start: {
    type: 'options',
    prompt: "Hi, I'm SERRA. I help Danny figure out what kind of tech problem you're having. What's going on?",
    key: 'category',
    options: [
      { label: CATEGORY_LABELS.computer, value: 'computer' },
      { label: CATEGORY_LABELS.network, value: 'network' },
      { label: CATEGORY_LABELS.setup, value: 'setup' },
      { label: CATEGORY_LABELS.business, value: 'business' },
      { label: CATEGORY_LABELS.other, value: 'other' },
    ],
    next: 'device',
  },
  device: {
    type: 'options',
    prompt: 'Is this a PC, a Mac, or a mix of both?',
    key: 'device',
    options: [
      { label: 'PC', value: 'PC' },
      { label: 'Mac', value: 'Mac' },
      { label: 'Both / not sure', value: 'Not sure' },
    ],
    next: (state) => (state.category === 'business' ? 'description' : 'context'),
  },
  context: {
    type: 'options',
    prompt: 'Is this for your home or a business?',
    key: 'context',
    options: [
      { label: 'Home', value: 'Home' },
      { label: 'Business', value: 'Business' },
    ],
    next: 'description',
  },
  description: {
    type: 'input',
    prompt: "In a sentence or two, what's happening?",
    placeholder: 'e.g. laptop won’t turn on',
    key: 'issue',
    next: 'location',
  },
  location: {
    type: 'input',
    prompt: 'Roughly where are you located (neighborhood or cross streets)?',
    placeholder: 'e.g. West 67th St',
    key: 'location',
    next: 'urgency',
  },
  urgency: {
    type: 'options',
    prompt: 'How urgent is this?',
    key: 'urgency',
    options: [
      { label: 'As soon as possible', value: 'ASAP' },
      { label: 'This week', value: 'This week' },
      { label: 'Just planning ahead', value: 'Planning ahead' },
    ],
    next: 'name',
  },
  name: {
    type: 'input',
    prompt: "What's your name?",
    placeholder: 'Your name',
    key: 'name',
    next: 'contact',
  },
  contact: {
    type: 'input',
    prompt: 'Best phone or email to reach you?',
    placeholder: 'Phone or email',
    key: 'contact',
    next: 'done',
  },
  done: {
    type: 'done',
    prompt: 'This sounds like something Danny can help with. In-home visits start at $' + '150.',
  },
};

// -----------------------------------------------------------------------
// TODO(future): replace this stub with a real API call, e.g.
//   const reply = await fetch('/api/serra', { method: 'POST', body: ... });
// The state machine above already collects everything a real assistant
// would need (category, device, context, issue, location, urgency, name,
// contact) — swap this function's body without touching the rest.
// -----------------------------------------------------------------------
function getSerraReply(step, state) {
  return step.prompt;
}

function buildSummary(state) {
  const lines = [
    `Category: ${CATEGORY_LABELS[state.category] || state.category || 'n/a'}`,
    `Device: ${state.device || 'n/a'}`,
    `Home/Business: ${state.context || (state.category === 'business' ? 'Business' : 'n/a')}`,
    `Issue: ${state.issue || 'n/a'}`,
    `Location: ${state.location || 'n/a'}`,
    `Urgency: ${state.urgency || 'n/a'}`,
    `Name: ${state.name || 'n/a'}`,
    `Contact: ${state.contact || 'n/a'}`,
  ];
  return lines.join('\n');
}

function initSerra() {
  const launcher = document.getElementById('serraLauncher');
  const panel = document.getElementById('serraPanel');
  const closeBtn = document.getElementById('serraClose');
  const body = document.getElementById('serraBody');
  const footer = document.getElementById('serraFooter');

  if (!launcher || !panel || !body) return;

  const state = {};
  let currentStepId = 'start';
  let started = false;

  function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'serra-msg serra-msg--bot';
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'serra-msg serra-msg--user';
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function clearFooter() {
    footer.innerHTML = '';
    footer.style.display = 'none';
  }

  function renderStep(stepId) {
    currentStepId = stepId;
    const step = STEPS[stepId];
    if (!step) return;

    addBotMessage(getSerraReply(step, state));

    if (step.type === 'options') {
      const wrap = document.createElement('div');
      wrap.className = 'serra-options';
      step.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          state[step.key] = opt.value;
          addUserMessage(opt.label);
          wrap.remove();
          advance(step);
        });
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    } else if (step.type === 'input') {
      const row = document.createElement('div');
      row.className = 'serra-options';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = step.placeholder || '';
      input.style.cssText =
        'border:1px solid var(--color-border-strong);border-radius:var(--radius);padding:0.6em 0.7em;font:inherit;';
      const submit = document.createElement('button');
      submit.type = 'button';
      submit.textContent = 'Continue';

      function commit() {
        const value = input.value.trim();
        if (!value) return;
        state[step.key] = value;
        addUserMessage(value);
        row.remove();
        advance(step);
      }

      submit.addEventListener('click', commit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commit();
      });

      row.appendChild(input);
      row.appendChild(submit);
      body.appendChild(row);
      input.focus();
      body.scrollTop = body.scrollHeight;
    } else if (step.type === 'done') {
      renderDoneActions();
    }
  }

  function advance(step) {
    const nextId = typeof step.next === 'function' ? step.next(state) : step.next;
    renderStep(nextId);
  }

  function renderDoneActions() {
    footer.innerHTML = '';
    footer.style.display = 'flex';

    const textBtn = document.createElement('a');
    textBtn.className = 'btn btn-outline';
    textBtn.href = `${business.smsHref}?&body=${encodeURIComponent(
      `Hi Danny, this is ${state.name || ''} via the site. ${state.issue || ''}`
    )}`;
    textBtn.textContent = 'Text Danny';

    const visitBtn = document.createElement('button');
    visitBtn.type = 'button';
    visitBtn.className = 'btn btn-accent';
    visitBtn.textContent = 'Request a Visit';
    visitBtn.addEventListener('click', () => {
      prefillContactForm(state);
      panel.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });

    footer.appendChild(textBtn);
    footer.appendChild(visitBtn);
  }

  function prefillContactForm(state) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.value = val;
    };
    setVal('name', state.name);
    if (state.contact && state.contact.includes('@')) {
      setVal('email', state.contact);
    } else {
      setVal('phone', state.contact);
    }
    const contextEl = document.getElementById('context');
    if (contextEl && (state.context || state.category === 'business')) {
      contextEl.value = state.context || 'Business';
    }
    const deviceEl = document.getElementById('device');
    if (deviceEl && state.device) {
      const match = ['PC', 'Mac'].includes(state.device) ? state.device : 'Other';
      deviceEl.value = match;
    }
    setVal('description', [state.issue, state.location ? `Location: ${state.location}` : '', state.urgency ? `Urgency: ${state.urgency}` : '']
      .filter(Boolean)
      .join('\n'));
  }

  function openPanel() {
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      clearFooter();
      renderStep('start');
    }
  }

  function closePanel() {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn?.addEventListener('click', closePanel);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSerra);
} else {
  initSerra();
}
