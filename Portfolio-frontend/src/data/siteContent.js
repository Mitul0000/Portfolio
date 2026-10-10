/**
 * Site content, images, and contact details for Digifello.
 *
 * IMAGE PLACEHOLDER GUIDE:
 * If you have image assets, place them in /public/images/ or provide external URLs.
 * Update the respective `image` or `thumbnail` paths below.
 * Recommended dimensions are documented next to each image property.
 */

export const siteContent = {
  brand: {
    name: 'Digifello',
    tagline: 'AI tools and custom software engineering.',
    ownerName: 'Mitul Chowdhury',
    heroHeadline: {
      part1: "AI tools & custom software.",
      part2: "Engineered for real work.",
    },
    heroDescription:
      'We design deterministic AI workflows, build custom web utilities, and solve technical operational friction.',
  },

  // 4 main pillars (rendered in staggered up-and-down interactive boxes on Home)
  pillars: [
    {
      step: '01',
      title: 'Explore Tools',
      shortTitle: 'Tools Library',
      description: 'Curated free and premium web utilities built to automate repetitive daily workflows.',
      link: '/tools',
      linkLabel: 'Browse library',
      image: '', 
      imageDimensions: '600x400 px',
    },
    {
      step: '02',
      title: 'Read the Blog',
      shortTitle: 'Engineering Notes',
      description: 'In-depth notes on AI agents, forensics tooling, architecture, and production lessons.',
      link: '/blogs',
      linkLabel: 'Read articles',
      image: '',
      imageDimensions: '600x400 px',
    },
    {
      step: '03',
      title: 'Request Tools',
      shortTitle: 'Custom Builds',
      description: 'Submit an idea with your target budget. We evaluate feasibility and build dedicated prototypes.',
      link: '/tool-request',
      linkLabel: 'Submit request',
      image: '',
      imageDimensions: '600x400 px',
    },
    {
      step: '04',
      title: 'Consultancy',
      shortTitle: 'Advisory Channel',
      description: 'Direct engagement for LLM agent development, full-stack systems, and security review.',
      link: '/consultancy',
      linkLabel: 'Book conversation',
      image: '',
      imageDimensions: '600x400 px',
    },
  ],

  // 4 distinct Custom Tool Request steps, each having the side-by-side reference layout (Large Card on Left, Headline + Story + CTA on Right)
  howCustomToolsOperate: [
    {
      step: '01',
      tag: 'Step 01',
      headline: {
        white: 'Describe the tool you need.',
        muted: 'Inputs, constraints & desired outputs.',
      },
      description:
        'Share your operational problem statement, data sources, file formats, and any required API integrations. We assess whether deterministic heuristics, local automation scripts, or an LLM pipeline best resolves the friction.',
      actionLabel: 'Scope your tool requirement',
      actionLink: '/tool-request',
      // Left card image slot: 540x600 px (e.g., UI wireframe, architecture diagram, or input form)
      image: '',
      imageDimensions: '540x600 px',
      accentColor: 'accent',
      iconType: 'requirements',
    },
    {
      step: '02',
      tag: 'Step 02',
      headline: {
        white: 'Set a target budget.',
        muted: 'Realistic milestones scoped to your needs.',
      },
      description:
        'Specify your budget expectation right upfront. We tailor the architectural footprint, hosting overhead, and delivery complexity to match your investment without hidden surprises.',
      actionLabel: 'View pricing & submit request',
      actionLink: '/tool-request',
      // Left card image slot: 540x600 px (e.g., budget slider graphic, milestone matrix, or scoping chart)
      image: '',
      imageDimensions: '540x600 px',
      accentColor: 'accent-sun',
      iconType: 'budget',
    },
    {
      step: '03',
      tag: 'Step 03',
      headline: {
        white: 'Engineering review within 48h.',
        muted: 'Honest evaluation before writing code.',
      },
      description:
        'Every tool proposal undergoes rigorous review: attack surface assessment, dependency stability, API rate-limits, and response speed. If feasible, your request is approved with a concrete turnaround timeline.',
      actionLabel: 'Review guidelines & standards',
      actionLink: '/tool-request',
      // Left card image slot: 540x600 px (e.g., code review terminal, test suite, or architecture diagram)
      image: '',
      imageDimensions: '540x600 px',
      accentColor: 'accent',
      iconType: 'review',
    },
    {
      step: '04',
      tag: 'Step 04',
      headline: {
        white: 'Track status & developer notes.',
        muted: 'Transparent dashboard from start to ship.',
      },
      description:
        'Monitor approval states (PENDING, APPROVED, REJECTED) and read direct messages from the engineer in your personal client dashboard. Once completed, your custom utility is shipped directly to you or published.',
      actionLabel: 'Open client dashboard',
      actionLink: '/dashboard',
      // Left card image slot: 540x600 px (e.g., dashboard preview, live tool deployment, or status tracker)
      image: '',
      imageDimensions: '540x600 px',
      accentColor: 'accent-warm',
      iconType: 'dashboard',
    },
  ],

  // Services offered (structured cleanly without generic repetitive card blocks)
  // Services offered (structured cleanly across 4 core engineering domains)
  services: [
    {
      id: 'web-dev',
      step: '01',
      title: 'Web Development',
      badge: 'Full-Stack',
      tagline: 'Modern, performant web applications & resilient backend systems.',
      description:
        'End-to-end full-stack web platforms engineered with React, Next.js, Node.js, and high-throughput databases. Built with clean architecture, sub-second load times, and production reliability.',
      deliverables: [
        'Responsive, accessibility-first user interfaces & design systems',
        'Type-safe REST & GraphQL APIs with JWT / OAuth security',
        'Database architecture, query optimization, and indexing (PostgreSQL, MongoDB)',
        'CI/CD automated deployment, observability, and containerization',
      ],
      idealFor: 'Startups, SaaS founders, and companies launching MVPs or scaling legacy platforms.',
    },
    {
      id: 'android-dev',
      step: '02',
      title: 'Android Development',
      badge: 'Mobile Systems',
      tagline: 'Native & cross-platform Android mobile applications.',
      description:
        'Crafting robust, smooth, and user-centric Android applications using Kotlin, Jetpack Compose, and React Native. Focused on smooth UI 60fps animations, local offline storage, and clean architecture.',
      deliverables: [
        'Modern Android UI with Jetpack Compose & Material 3 guidelines',
        'Offline-first synchronization with Room / SQLite local caching',
        'Background sync workers, push notifications, and hardware sensor integration',
        'Play Store deployment pipeline, ProGuard security, and performance tuning',
      ],
      idealFor: 'Businesses launching consumer apps, dedicated field utilities, or mobile-first services.',
    },
    {
      id: 'ai-automation',
      step: '03',
      title: 'AI Automation',
      badge: 'Workflows & LLMs',
      tagline: 'Autonomous AI agents, deterministic LLM pipelines & smart workflows.',
      description:
        'Connecting multi-modal LLM intelligence directly into daily business operations. From n8n workflow engines to LangChain agents, we eliminate repetitive manual work with deterministic automated execution.',
      deliverables: [
        'Deterministic LLM agent pipelines with schema-enforced JSON validation',
        'Multi-app workflow automation across webhooks, APIs, and databases (n8n, Python)',
        'Retrieval-Augmented Generation (RAG) with vector indexing and context pruning',
        'Cost, token optimization, and latency monitoring benchmarks',
      ],
      idealFor: 'Teams looking to automate data triage, customer onboarding, reporting, and repetitive workflows.',
    },
    {
      id: 'security',
      step: '04',
      title: 'Security & Endpoint Tooling',
      badge: 'Cybersecurity',
      tagline: 'Forensics analysis, endpoint protection & vulnerability assessments.',
      description:
        'Pragmatic cybersecurity engineering to audit infrastructure, eliminate vulnerabilities, and protect assets against threats. Includes digital forensics scripts and anti-forensics detection tools.',
      deliverables: [
        'Attack surface reduction, security code review, and dependency auditing',
        'Event log anomaly detection, incident response scripts, and PCAP analysis',
        'Forensic triage automation and anti-forensics evasion detection agents',
        'Actionable vulnerability remediation roadmaps & compliance readiness',
      ],
      idealFor: 'Teams deploying sensitive internal utilities or handling critical compliance workloads.',
    },
  ],

  // Consultancy & Contact Details
  consultancy: {
    title: 'Direct Technical Advisory',
    subtitle: 'Pragmatic implementation advice from active systems builders.',
    overview:
      'Whether you are choosing an LLM provider, troubleshooting asynchronous worker pipelines, or architecting a new application, our advisory sessions provide straightforward technical clarity.',
    bookingUrl: '', // TODO: Owner to add Calendly/Cal.com link if available
    contact: {
      email: 'mitulchowdhury042006@gmail.com',
      phone: '+91 98765 43210',
      location: 'Gandhinagar, Gujarat, India',
      workingHours: 'Monday – Saturday, 10:00 AM – 7:00 PM IST',
      replyTime: 'Typically within 24 hours',
      github: 'https://github.com/Mitul0000',
      medium: 'https://medium.com/@mitul_digifello',
      twitter: 'https://twitter.com/digifello',
      linkedin: 'https://linkedin.com/in/mitul-chowdhury',
    },
    faqs: [
      {
        question: 'What kind of projects do you take on?',
        answer: 'We focus on AI-assisted workflow automations, full-stack web applications (React, Node, Python), and digital forensics utilities.',
      },
      {
        question: 'How does custom tool pricing work?',
        answer: 'You propose your target budget when requesting a tool. We evaluate the scope and either accept, recommend modifications, or provide a precise fixed quote.',
      },
      {
        question: 'Can you sign an NDA before we discuss proprietary ideas?',
        answer: 'Yes, mutual non-disclosure agreements can be executed prior to reviewing sensitive architectures.',
      },
      {
        question: 'Do you offer ongoing retainer agreements?',
        answer: 'Yes, ongoing maintenance and feature development retainers are available for selected projects upon request.',
      },
    ],
  },

  // About copy
  about: {
    summary:
      'Digifello was founded by Mitul Chowdhury, an Integrated B.Tech–M.Tech student in Cyber Security at the National Forensic Sciences University (NFSU). Driven by practical engineering, the goal is to build reliable, high-utility tools at the intersection of AI, security, and the open web.',
  },
};
