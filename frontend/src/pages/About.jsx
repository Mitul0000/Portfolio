import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../utils/pageUtils';
import { siteContent } from '../data/siteContent';
import { Button } from '../components/UI';
import { ExternalLink, GraduationCap, Award, Globe, Code2, ArrowRight } from 'lucide-react';

export default function About() {
  usePageTitle('About');

  const { consultancy } = siteContent;

  const technicalSkills = [
    {
      category: 'Languages',
      items: ['Python', 'JavaScript', 'C', 'C++', 'Java', 'HTML / CSS', 'SQL'],
    },
    {
      category: 'Frameworks & Systems',
      items: ['React.js', 'Node.js', 'Express', 'FastAPI', 'MongoDB', 'Vite', 'Tailwind CSS'],
    },
    {
      category: 'AI & Automation',
      items: ['LLM Pipelines', 'Google Gemini API', 'OpenAI API', 'n8n Automations', 'Agent Workflows'],
    },
    {
      category: 'Security & Forensics',
      items: ['Digital Forensics', 'Endpoint Monitoring', 'Anti-Forensics Detection', 'Event Log Analysis'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      
      {/* Editorial Headline */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            01 // PROFILE &amp; MISSION
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
            About Digifello &amp; Mitul Chowdhury.
          </h1>
        </div>
        <p className="text-xl sm:text-2xl font-normal text-muted tracking-tight pt-1">
          Cybersecurity student, developer, and AI systems builder.
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {/* Section 1: Background & Mission */}
        <div className="py-12 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-2">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-muted tracking-wider block">
              BACKGROUND // FOUNDATIONS
            </span>
            <h2 className="text-2xl font-normal text-text tracking-tight">
              Engineering with Rigor
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <p className="text-sm sm:text-base text-text/85 leading-relaxed">
              {siteContent.about.summary}
            </p>
            <p className="text-sm sm:text-base text-text/85 leading-relaxed">
              Digifello was created to bridge academic cybersecurity rigor with practical software delivery. Instead of abstract proofs-of-concept, we focus on working web products, reliable automation pipelines, and tools that solve real operational friction.
            </p>
            <div className="pt-2 flex flex-wrap gap-5 text-xs font-mono">
              <a
                href={consultancy.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                GitHub Profile <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
              <a
                href={consultancy.contact.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                Medium Articles <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
              <Link
                to="/consultancy"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                Direct Consultancy Channel <ArrowRight className="w-3.5 h-3.5 text-muted" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Academic Rigor */}
        <div className="py-12 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-muted tracking-wider block">
              ACADEMIA // CREDENTIALS
            </span>
            <h2 className="text-2xl font-normal text-text tracking-tight">
              Education &amp; Specialization
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-lg font-normal text-text">
              National Forensic Sciences University (NFSU), Gandhinagar
            </h3>
            <p className="text-sm font-mono text-text/90">
              Integrated B.Tech – M.Tech in Computer Science &amp; Engineering (Cyber Security)
            </p>
            <p className="text-xs text-muted font-mono">
              2025 – 2030 · Specialized in Digital Forensics, System Security, and Applied Artificial Intelligence.
            </p>
          </div>
        </div>

        {/* Section 3: Technical Competencies */}
        <div className="py-12 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-muted tracking-wider block">
              STACK // CAPABILITIES
            </span>
            <h2 className="text-2xl font-normal text-text tracking-tight">
              Core Technical Stack
            </h2>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
            {technicalSkills.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted border-b border-border/50 pb-1.5">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs bg-surface/60 border border-border text-text font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action: Open editorial style */}
      <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-normal text-text">
            Have a project or technical challenge?
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Explore active tools, browse deep-dives, or request a bespoke utility.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/tools">
            <Button variant="primary" size="sm">
              Explore Tools
            </Button>
          </Link>
          <Link to="/tool-request">
            <Button variant="secondary" size="sm">
              Request a Custom Tool
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}