import { useState, useEffect, useRef } from "react";
const ANIM_CSS = `
  :root { --font-display: 'Plus Jakarta Sans', sans-serif; --font-body: 'DM Sans', sans-serif; }
  body, * { font-family: var(--font-body); }
  h1,h2,h3,h4,.display { font-family: var(--font-display); }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes heroFade { 0%{opacity:0;transform:scale(1.04)} 8%{opacity:1;transform:scale(1)} 40%{opacity:1;transform:scale(1.02)} 50%{opacity:0;transform:scale(1.04)} 100%{opacity:0} }
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spinOrbit { from{transform:rotate(0deg) translateX(70px) rotate(0deg)} to{transform:rotate(360deg) translateX(70px) rotate(-360deg)} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} 50%{box-shadow:0 0 32px 8px rgba(59,130,246,0.25)} }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .hero-img-slide { position:absolute;inset:0;opacity:0;animation:heroFade 12s infinite; }
  .hero-img-slide:nth-child(1){animation-delay:0s}
  .hero-img-slide:nth-child(2){animation-delay:4s}
  .hero-img-slide:nth-child(3){animation-delay:8s}
  .float-anim { animation:floatY 5s ease-in-out infinite; }
  .float-anim-delay { animation:floatY 5s ease-in-out infinite; animation-delay:1.5s; }
  .ticker-track { animation:ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state:paused; }
  .pulse-glow { animation:pulseGlow 3s ease infinite; }
  .grad-shift { background-size:200% 200%; animation:gradShift 4s ease infinite; }
  .fade-up { opacity:0; transform:translateY(28px); transition:opacity 0.65s ease, transform 0.65s ease; }
  .fade-up.visible { opacity:1; transform:translateY(0); }
  .orbit-dot { animation:spinOrbit 8s linear infinite; }
  html { scroll-behavior:smooth; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#3B82F6; border-radius:3px; }
  .hero-text-animate { animation:fadeSlideUp 0.7s ease both; }
  .hero-text-animate:nth-child(2) { animation-delay:0.1s; }
  .hero-text-animate:nth-child(3) { animation-delay:0.2s; }
  .hero-text-animate:nth-child(4) { animation-delay:0.3s; }
  .hero-text-animate:nth-child(5) { animation-delay:0.4s; }
`;

/* ── DATA ── */
const NAV = [
  { label: "Home", href: "#home" },
  {
    label: "Services",
    href: "#services",
    menu: {
      eyebrow: "Services",
      title: "Implementation, support, reporting, and upgrades.",
      desc: "A clean service menu spanning the full Microsoft delivery lifecycle.",
      ctaLabel: "Explore services",
      ctaHref: "#services",
      groups: [
        {
          title: "Core Services",
          links: [
            "Implementation Partner",
            "Dynamics Support Partner",
            "Business Intelligence & Reporting",
            "Upgrades",
          ],
        },
        {
          title: "Delivery Support",
          links: [
            "Discovery Workshops",
            "System Health Checks",
            "Support Retainers",
            "Reporting Dashboards",
          ],
        },
      ],
    },
  },
  {
    label: "Microsoft Solutions",
    href: "#services",
    menu: {
      eyebrow: "Microsoft Solutions",
      title: "Dynamics and Power Platform as one connected ecosystem.",
      desc: "Broad solution coverage aligned with our delivery scope.",
      ctaLabel: "See solutions",
      ctaHref: "#services",
      groups: [
        {
          title: "Dynamics 365",
          links: [
            "Business Central",
            "Finance & Operations",
            "Customer Engagement",
            "GP & AX",
            "Navision",
          ],
        },
        {
          title: "Power Platform",
          links: [
            "Power BI",
            "Power Apps",
            "Power Pages",
            "Power Automate",
            "Power Virtual Agents",
          ],
        },
      ],
    },
  },
  {
    label: "Industries",
    href: "#industries",
    menu: {
      eyebrow: "Industries",
      title: "Specialised delivery across sectors we know well.",
      desc: "Patterns that hold even as the business changes.",
      ctaLabel: "View industries",
      ctaHref: "#industries",
      groups: [
        {
          title: "Sectors",
          links: ["Retail", "Logistics", "Finance", "Education"],
        },
        {
          title: "Capabilities",
          links: [
            "Data Integration",
            "Process Automation",
            "Reporting & BI",
            "Cloud Migration",
          ],
        },
      ],
    },
  },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1662052955282-da15376f3919?auto=format&fit=crop&w=900&q=85",
  "https://plus.unsplash.com/premium_photo-1683120968693-9af51578770e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1764601842139-635f318905c6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1633410189542-36d96e3762b8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://www.dqlabs.ai/wp-content/uploads/2024/06/thumbnail-data-pipeline-blog-9.png",
  "https://sysgen.ca/wp-content/uploads/2024/06/Blog-Featured-Image-05-980x623.png",
  "https://tipalti.com/wp-content/uploads/2024/10/integration-card-microsoft-dynamics-365.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR2p6RcFUTdLUcdPhDuny07te2APhfgPYwo0r-y94WMM_o8-lpRDSxJn3H&s=10",
];

const SERVICES = [
  {
    icon: "dynamics",
    title: "Dynamics 365 Implementation",
    desc: "Configure Business Central, Finance, Sales, and service workflows around real operational needs.",
    points: [
      "Business process mapping",
      "ERP and CRM setup",
      "Data migration planning",
    ],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: "workplace",
    title: "Microsoft 365 & Copilot",
    desc: "Prepare users, content, security, and governance for modern collaboration and AI-assisted work.",
    points: ["Tenant review", "Copilot readiness", "SharePoint & Teams setup"],
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: "analytics",
    title: "Power BI & Reporting",
    desc: "Turn scattered operational data into dashboards that leadership and departments can trust.",
    points: ["Executive dashboards", "Data modeling", "KPI design"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: "azure",
    title: "Azure Cloud & Infrastructure",
    desc: "Move applications, databases, and workloads into a secure Azure foundation with continuity.",
    points: [
      "Migration planning",
      "Identity and access",
      "Backup and monitoring",
    ],
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: "automation",
    title: "Power Platform Automation",
    desc: "Build apps and approval flows that remove manual work without creating unmanaged complexity.",
    points: ["Power Apps", "Power Automate", "Governed environments"],
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: "support",
    title: "Managed Support Services",
    desc: "Keep Microsoft systems stable after go-live with practical triage, change requests, and advice.",
    points: ["Issue resolution", "Enhancement backlog", "User guidance"],
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
  },
];

const PROJECTS = [
  {
    title: "Data Security with Microsoft Purview Sensitivity Labels",
    cat: "Cloud & Security",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Copilot Readiness Assessment for Secure AI Deployment",
    cat: "Microsoft 365",
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Modern SharePoint Intranet for Real Estate Developer",
    cat: "Teamwork & Collaboration",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
  },
];

const TECH = [
  "Dynamics 365",
  "Microsoft 365",
  "Power BI",
  "Power Apps",
  "Power Automate",
  "Azure",
  "SharePoint",
  "Teams",
  "Copilot",
  "Dataverse",
  "Microsoft Fabric",
];

const CERTS = [
  { name: "Microsoft Certified", cat: "Power Platform Developer" },
  { name: "Microsoft Certified", cat: "Dynamics 365 BC Consultant" },
  { name: "Microsoft Certified", cat: "Azure Solutions Architect" },
  { name: "Solutions Partner", cat: "Business Applications" },
];

const PARTNERSHIPS = [
  {
    name: "Microsoft Partner",
    role: "Solutions Partner",
    desc: "Access to Microsoft training, support, and resources.",
  },
  {
    name: "Dynamics 365 Experts",
    role: "Business Central & CE",
    desc: "Deep expertise in ERP migration and CRM setups.",
  },
  {
    name: "Power Platform",
    role: "Power Apps & Automate",
    desc: "Low-code custom apps and workflow automation.",
  },
  {
    name: "Azure Solutions",
    role: "Cloud Architecture",
    desc: "Secure infrastructure, migrations, and databases.",
  },
  {
    name: "Power BI",
    role: "Reporting & Analytics",
    desc: "DAX modeling, live dashboards, data warehousing.",
  },
  {
    name: "Microsoft 365",
    role: "Modern Workplace",
    desc: "Teams, SharePoint, and Copilot adoption.",
  },
];

const REVIEWS = [
  {
    role: "Chief Digital & Information Officer",
    company: "Ulster University",
    quote:
      "Our experience working with Innoviez was outstanding. They listened, adapted, and delivered beyond expectations on this complex piece of work.",
  },
  {
    role: "Digital Records Manager",
    company: "Ulster University",
    quote:
      "The team translated our requirements seamlessly into an elegant, scalable, and highly functional architecture that continues to serve us well.",
  },
  {
    role: "Productivity & Collaboration Consultant",
    company: "Northumbrian Water",
    quote:
      "Working with Innoviez has accelerated our use of modern workspaces, turning embryonic ideas into quick, measurable wins.",
  },
];

const INDUSTRIES = [
  {
    id: "retail",
    name: "Retail",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=75",
  },
  {
    id: "logistics",
    name: "Logistics",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=75",
  },
  {
    id: "finance",
    name: "Finance",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=75",
  },
  {
    id: "education",
    name: "Education",
    img: "https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ABOUT_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUuvbX6iOpkjiMV7JX3YesfTRNIoOsAVpb6EaJoH68UmF-MRboY-l82BM&s=10";
const PARTNER_IMG =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80";

/* ── HOOKS ── */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCounter(target, active) {
  const [val, setVal] = useState("0");
  useEffect(() => {
    if (!active) return;
    const num = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[\d]/g, "");
    let frame = 0;
    const total = 55;
    const t = setInterval(() => {
      frame++;
      const p = frame / total;
      const e = 1 - Math.pow(1 - p, 3);
      setVal(`${Math.floor(e * num)}${suffix}`);
      if (frame >= total) {
        setVal(target);
        clearInterval(t);
      }
    }, 22);
    return () => clearInterval(t);
  }, [active, target]);
  return val;
}

/* ── ICON COMPONENTS ── */
function SvcIcon({ icon, cls = "w-5 h-5" }) {
  const p = {
    className: cls,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (icon) {
    case "dynamics":
      return (
        <svg {...p}>
          <path d="M4 6.5 12 2l8 4.5v11L12 22l-8-4.5v-11Z" />
          <path d="M12 2v20" />
          <path d="m4 6.5 8 4.5 8-4.5" />
        </svg>
      );
    case "workplace":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...p}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15v-4" />
          <path d="M12 15V8" />
          <path d="M16 15v-6" />
        </svg>
      );
    case "azure":
      return (
        <svg {...p}>
          <path d="M17.5 19H8a5 5 0 1 1 1.5-9.78A6 6 0 0 1 21 12.5 3.5 3.5 0 0 1 17.5 19Z" />
        </svg>
      );
    case "automation":
      return (
        <svg {...p}>
          <path d="M4 12a8 8 0 0 1 13.66-5.66" />
          <path d="M20 4v6h-6" />
          <path d="M20 12a8 8 0 0 1-13.66 5.66" />
          <path d="M4 20v-6h6" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
  }
}

function IndustryIcon({ id, cls = "w-5 h-5" }) {
  const p = {
    className: cls,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (id) {
    case "retail":
      return (
        <svg {...p}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "logistics":
      return (
        <svg {...p}>
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "finance":
      return (
        <svg {...p}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "education":
      return (
        <svg {...p}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
        </svg>
      );
  }
}

function SunIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CheckIcon({ cls = "w-4 h-4" }) {
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDown({ cls = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowRight({ cls = "w-4 h-4" }) {
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ── MEGA MENU DROPDOWN ── */
function NavMegaMenu({ item, dark, openId, setOpenId }) {
  const isOpen = openId === item.label;
  if (!item.menu) {
    return (
      <li>
        <a
          href={item.href}
          className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-block ${dark ? "text-slate-300 hover:text-white hover:bg-white/8" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          {item.label}
        </a>
      </li>
    );
  }
  return (
    <li
      className="relative"
      onMouseEnter={() => setOpenId(item.label)}
      onMouseLeave={() => setOpenId(null)}
    >
      <button
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${dark ? "text-slate-300 hover:text-white hover:bg-white/8" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"} ${isOpen ? (dark ? "text-white bg-white/8" : "text-slate-900 bg-slate-100") : ""}`}
      >
        {item.label}
        <ChevronDown
          cls={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 dropdown-anim"
          style={{ width: "min(820px, 90vw)" }}
        >
          <div
            className={`grid grid-cols-[0.95fr_1.5fr] gap-4 rounded-2xl border p-3.5 shadow-2xl ${dark ? "bg-[#0A1628] border-white/12" : "bg-white border-slate-200"}`}
          >
            {/* Feature panel */}
            <div
              className="rounded-xl p-6 flex flex-col gap-3 text-white"
              style={{
                background: "linear-gradient(135deg, #0A1628 0%, #0D2151 100%)",
              }}
            >
              <span className="text-[11px] font-bold tracking-widest uppercase text-cyan-400">
                {item.menu.eyebrow}
              </span>
              <h3
                className="font-extrabold text-lg leading-snug"
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                {item.menu.title}
              </h3>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {item.menu.desc}
              </p>
              <a
                href={item.menu.ctaHref}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {item.menu.ctaLabel} <ArrowRight cls="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-3">
              {item.menu.groups.map((group) => (
                <div key={group.title}>
                  <div
                    className={`text-[11px] font-bold tracking-widest uppercase mb-2.5 ${dark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {group.title}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.links.map((l) => (
                      <a
                        key={l}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${dark ? "text-slate-300 hover:bg-white/6 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg,#3B82F6,#06B6D4)",
                          }}
                        />
                        {l}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/* ── NAVBAR ── */
function Navbar({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const base = dark
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060D1C]/95 backdrop-blur-xl shadow-2xl shadow-black/30" : "bg-[#060D1C]/60 backdrop-blur-md"}`
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-100" : "bg-white/80 backdrop-blur-sm"}`;

  return (
    <nav className={base}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <a
          href="#home"
          className={`flex items-center gap-2.5 font-display font-bold text-xl ${dark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
        >
          <div
            className="w-8 h-8 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
              clipPath: "polygon(0 0,70% 0,100% 50%,70% 100%,0 100%,30% 50%)",
            }}
          />
          Innoviez
        </a>

        {/* Desktop Links with mega menus */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map((l) => (
            <NavMegaMenu
              key={l.label}
              item={l}
              dark={dark}
              openId={openId}
              setOpenId={setOpenId}
            />
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleDark}
            className={`p-2 rounded-lg transition-colors duration-200 ${dark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}
          >
            Get in Touch <ArrowRight cls="w-3.5 h-3.5" />
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden p-2 rounded-lg ${dark ? "text-white" : "text-slate-700"}`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`lg:hidden border-t max-h-[80vh] overflow-y-auto ${dark ? "bg-[#060D1C]/98 border-white/10" : "bg-white border-slate-100"} px-6 py-4 flex flex-col gap-1`}
        >
          {NAV.map((l) => (
            <div
              key={l.label}
              className={`border-b ${dark ? "border-white/5" : "border-slate-100"}`}
            >
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-2.5 ${dark ? "text-slate-300" : "text-slate-600"}`}
              >
                {l.label}
              </a>
              {l.menu && (
                <div className="pb-3 pl-3 flex flex-col gap-1">
                  {l.menu.groups
                    .flatMap((g) => g.links)
                    .map((sub) => (
                      <a
                        key={sub}
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className={`text-xs py-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {sub}
                      </a>
                    ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#contact"
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
}

/* ── STAT CARD ── */
function StatCard({ value, label, dark }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const displayed = useCounter(value, active);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`px-6 py-4 rounded-2xl border backdrop-blur-sm ${dark ? "bg-white/6 border-white/12" : "bg-white border-slate-200 shadow-sm"}`}
    >
      <div
        className="text-2xl font-bold"
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {displayed}
      </div>
      <div
        className={`text-xs mt-1 font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        {label}
      </div>
    </div>
  );
}

/* ── HERO ── */
function HeroSection({ dark }) {
  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center overflow-hidden ${dark ? "bg-[#060D1C]" : "bg-slate-50"}`}
    >
      {/* BG decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-0 left-0 w-full h-full ${dark ? "opacity-100" : "opacity-30"}`}
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 55% at 40% 0%,${dark ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.12)"} 0%,transparent 70%),radial-gradient(circle at 85% 80%,${dark ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.08)"} 0%,transparent 45%)`,
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.15) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 65% 65% at 50% 50%,black,transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="relative z-10">
            {/* Badge */}
            <div
              className="hero-text-animate inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-7 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.12)"
                  : "rgba(59,130,246,0.08)",
                borderColor: dark
                  ? "rgba(59,130,246,0.35)"
                  : "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
              Microsoft Solutions Partner
            </div>

            <h1
              className="hero-text-animate text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight mb-5"
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                color: dark ? "#F1F5F9" : "#0F172A",
              }}
            >
              Transform Your
              <br />
              Business with
              <br />
              <span
                className="grad-shift"
                style={{
                  background: "linear-gradient(90deg,#3B82F6,#06B6D4,#3B82F6)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                }}
              >
                Microsoft Cloud
              </span>
            </h1>

            <p
              className={`hero-text-animate text-base lg:text-lg leading-relaxed mb-8 max-w-lg ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Innoviez helps teams plan, implement, secure, and support
              Microsoft 365, Dynamics 365, Azure, and Power Platform — with
              clear delivery and dependable long-term care.
            </p>

            <div className="hero-text-animate flex flex-wrap gap-3 mb-10">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
                style={{
                  background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
                }}
              >
                Book Discovery Call <ArrowRight />
              </a>
              <a
                href="#services"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:scale-105 ${dark ? "border-white/15 text-slate-300 hover:border-white/30 hover:bg-white/6" : "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100"}`}
              >
                Explore Services
              </a>
            </div>

            {/* Stats row */}
            <div className="hero-text-animate grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: "50+", l: "Projects Delivered" },
                { v: "20+", l: "Clients Supported" },
                { v: "30+", l: "Years Experience" },
                { v: "24h", l: "Support Response" },
              ].map((s) => (
                <StatCard key={s.l} value={s.v} label={s.l} dark={dark} />
              ))}
            </div>
          </div>

          {/* Right: Animated Image Slider */}
          <div className="relative hidden lg:block">
            {/* Main image carousel */}
            <div
              className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: dark
                  ? "0 30px 80px rgba(0,0,0,0.5)"
                  : "0 30px 80px rgba(15,23,42,0.18)",
              }}
            >
              {HERO_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="hero-img-slide rounded-3xl overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(6,13,28,0.7) 0%,rgba(6,13,28,0.1) 50%,transparent 100%)",
                    }}
                  />
                </div>
              ))}
              {/* Overlay card bottom */}
              <div
                className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl backdrop-blur-lg border border-white/20"
                style={{ background: "rgba(6,13,28,0.75)" }}
              >
                <div className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase mb-1">
                  Modern Workplace Delivery
                </div>
                <div className="text-white text-sm font-semibold leading-snug">
                  One connected Microsoft ecosystem, designed around your
                  business.
                </div>
              </div>
            </div>

            {/* Floating card —  top right */}
            <div
              className={`float-anim-delay absolute -top-10 -right-24 w-48 p-4 rounded-2xl border shadow-xl ${dark ? "bg-[#0A1628]/90 border-white/12 text-white" : "bg-white border-slate-200 text-slate-800"}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  Live Support
                </span>
              </div>
              <div
                className="text-xs font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                Microsoft Stack
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {["D365", "Azure", "M365", "PBI"].map((t) => (
                  <span
                    key={t}
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      color: "#60A5FA",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TICKER ── */
function Ticker({ dark }) {
  const items = [...TECH, ...TECH];
  return (
    <div
      className={`overflow-hidden border-y py-3.5 ${dark ? "bg-[#070E1F] border-white/8" : "bg-slate-50 border-slate-200"}`}
    >
      <div className="ticker-track flex w-max">
        {items.map((t, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 px-8 whitespace-nowrap text-sm font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}
            />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SERVICES ── */
function ServicesSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section
      id="services"
      className={`py-24 ${dark ? "bg-[#060D1C]" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-14">
          <div className="flex-1">
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(59,130,246,0.07)",
                borderColor: "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              Services
            </span>
            <h2
              className={`text-4xl font-extrabold leading-tight tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Microsoft services
              <br />
              shaped for growth
            </h2>
          </div>
          <p
            className={`lg:max-w-sm text-base leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            From first assessment to managed support, we help companies use
            Microsoft technology with cleaner processes and more useful data.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <article
              key={i}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${dark ? "bg-[#0A1628] border-white/8 hover:border-blue-500/40 hover:shadow-blue-500/10" : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-100"}`}
            >
              {/* Service image */}
              <div className="h-44 overflow-hidden relative">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(10,22,40,0.85) 0%,rgba(10,22,40,0.2) 60%,transparent 100%)",
                  }}
                />
                <div className="absolute bottom-3 left-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(59,130,246,0.9)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <SvcIcon icon={s.icon} cls="w-4.5 h-4.5 text-white" />
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <h3
                  className={`font-bold text-[15px] mb-2 leading-snug ${dark ? "text-white" : "text-slate-900"}`}
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                >
                  {s.title}
                </h3>
                <p
                  className={`text-[13px] leading-relaxed mb-4 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {s.desc}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {s.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-center gap-2 text-[12px] font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      <CheckIcon cls="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CERTIFICATIONS ── */
function CertificationsSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section className={`py-12 ${dark ? "bg-[#070E1F]" : "bg-slate-50"}`}>
      <div
        className="max-w-7xl mx-auto px-6 fade-up"
        ref={ref}
        id="credentials"
      >
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          <div>
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(59,130,246,0.07)",
                borderColor: "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              Microsoft Partner & Experts
            </span>
            <h1
              className={`text-3xl font-extrabold leading-tight tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Certifications & Partnerships
            </h1>
          </div>
          <p
            className={`self-end text-base leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            Structured Microsoft delivery across business applications,
            analytics, cloud infrastructure, and low-code automation.
          </p>
        </div>

        {/* Full-width Partner badge row */}
        <div
          className="pulse-glow rounded-2xl p-7 border mb-8 w-full"
          style={{
            background: dark
              ? "linear-gradient(135deg,#0A1628,#0D2151)"
              : "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
            borderColor: dark
              ? "rgba(59,130,246,0.25)"
              : "rgba(59,130,246,0.3)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-7">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-0.5 w-11 h-11 flex-shrink-0">
                <div className="bg-[#F25022]" />
                <div className="bg-[#7FBA00]" />
                <div className="bg-[#00A4EF]" />
                <div className="bg-[#FFB900]" />
              </div>
              <div>
                <div
                  className="font-extrabold text-xl"
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    color: dark ? "#F1F5F9" : "#0F172A",
                  }}
                >
                  Microsoft
                </div>
                <div
                  className={`text-[12px] font-bold tracking-widest uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Solutions Partner
                </div>
              </div>
            </div>
            <div
              className={`sm:ml-auto text-sm leading-relaxed max-w-md ${dark ? "text-slate-300" : "text-slate-600"}`}
            >
              Recognised by Microsoft across Business Applications, Data & AI,
              Digital & App Innovation, and Modern Work.
            </div>
          </div>
          {/* Certs row — full width */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl border ${dark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)" }}
                >
                  <svg
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path
                      d="m9 11 2 2 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    className={`text-[13px] font-bold ${dark ? "text-white" : "text-slate-800"}`}
                  >
                    {c.name}
                  </div>
                  <div
                    className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {c.cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnerships grid — full width 3 cols */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PARTNERSHIPS.map((p, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 ${dark ? "bg-[#0A1628] border-white/8 hover:border-cyan-400/30" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
                }}
              />
              <div
                className={`font-bold text-[14px] mb-0.5 ${dark ? "text-white" : "text-slate-900"}`}
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                {p.name}
              </div>
              <div className="text-[10px] font-bold tracking-wide text-cyan-500 uppercase mb-2">
                {p.role}
              </div>
              <div
                className={`text-[13px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2.5">
          {TECH.map((t) => (
            <div
              key={t}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 ${dark ? "bg-white/4 border-white/10 text-slate-400 hover:border-blue-500/40 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm"}`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
                }}
              />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA BANNER ── */
function CTABanner({ dark }) {
  const ref = useScrollReveal();
  return (
    <div className="fade-up" ref={ref}>
      <div
        className="relative overflow-hidden border-y"
        style={{
          background: dark
            ? "linear-gradient(135deg,#0A1628,#0D2151,#0A2A4A)"
            : "linear-gradient(135deg,#1E3A5F,#1D4ED8,#0284C7)",
          borderColor: dark ? "rgba(59,130,246,0.2)" : "transparent",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%,rgba(59,130,246,0.15),transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-2">
              We're here to help with your Digital Transformation
            </p>
            <h2
              className="text-4xl font-extrabold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Let's discuss
              <br />
              your project
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-blue-800 bg-white shadow-2xl shadow-black/20 transition-all hover:scale-105 hover:shadow-white/20 flex-shrink-0"
          >
            Book a Discovery Call <ArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── PROJECTS ── */
function ProjectsSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section className={`py-24 ${dark ? "bg-[#060D1C]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-12">
          <div className="flex-1">
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(59,130,246,0.07)",
                borderColor: "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              Digital Transformation Projects
            </span>
            <h2
              className={`text-4xl font-extrabold leading-tight tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              79% of Clients make us
              <br />
              their Preferred Partner
            </h2>
          </div>
          <p
            className={`lg:max-w-xs text-base leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            We listen to your needs and translate them to achievable, measurable
            solutions.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to top,rgba(6,13,28,0.92) 0%,rgba(6,13,28,0.3) 55%,transparent 100%)",
                }}
              />
              <div className="absolute inset-x-5 bottom-5">
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border border-blue-400/40 text-blue-300"
                  style={{
                    background: "rgba(59,130,246,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {p.cat}
                </span>
                <p
                  className="text-white font-semibold text-sm leading-snug"
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                >
                  {p.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function AboutSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section
      id="about"
      className={`py-16 ${dark ? "bg-[#070E1F]" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: dark
                  ? "0 30px 70px rgba(0,0,0,0.45)"
                  : "0 30px 70px rgba(15,23,42,0.12)",
              }}
            >
              <img
                src={ABOUT_IMG}
                alt="Innoviez team"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            {/* Floating badge */}
            <div
              className={`float-anim absolute -bottom-6 -right-4 p-5 rounded-2xl border shadow-xl ${dark ? "bg-[#0A1628] border-white/12" : "bg-white border-slate-200 shadow-slate-200"}`}
            >
              <div
                className={`text-3xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                30+
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Years of business
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-5 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(59,130,246,0.07)",
                borderColor: "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              Why Innoviez
            </span>
            <h2
              className={`text-4xl font-extrabold leading-tight tracking-tight mb-4 ${dark ? "text-white" : "text-slate-900"}`}
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Outcome-Driven with
              <br />
              Practical Transparency
            </h2>
            <p
              className={`text-base leading-relaxed mb-8 ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              End-to-end business systems built for efficiency, growth, and
              long-term success. We've been a trusted Microsoft partner for over
              30 years across private and public sectors.
            </p>

            <div
              className="flex flex-col divide-y"
              style={{
                divideColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(15,23,42,0.07)",
              }}
            >
              {[
                {
                  title: "Discover",
                  desc: "Mapping processes, removing bottlenecks, and driving progress through scoped workshops.",
                },
                {
                  title: "Build",
                  desc: "We deliver in iterations for early feedback and faster, more reliable progress.",
                },
                {
                  title: "Support",
                  desc: "Ongoing managed support and health checks to sustain momentum.",
                },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 py-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: dark
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(59,130,246,0.1)",
                      border: dark
                        ? "1px solid rgba(59,130,246,0.2)"
                        : "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    <span
                      className="text-sm font-bold text-blue-500"
                      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-base mb-1 ${dark ? "text-white" : "text-slate-900"}`}
                      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── INDUSTRIES ── */
function IndustriesSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section
      id="industries"
      className={`py-16 ${dark ? "bg-[#060D1C]" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="text-center mb-14">
          <span
            className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border"
            style={{
              background: dark
                ? "rgba(59,130,246,0.1)"
                : "rgba(59,130,246,0.07)",
              borderColor: "rgba(59,130,246,0.25)",
              color: "#60A5FA",
            }}
          >
            Industries
          </span>
          <h2
            className={`text-4xl font-extrabold leading-tight tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          >
            Specialised Solutions
            <br />
            Across Industries
          </h2>
          <p
            className={`mt-4 text-base leading-relaxed max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            Better data flow, clearer interfaces, and systems that are easier to
            support over time — regardless of the business.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.id}
              className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={ind.img}
                alt={ind.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(6,13,28,0.85),rgba(6,13,28,0.2) 55%,transparent 100%)",
                }}
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      background: "rgba(59,130,246,0.85)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <IndustryIcon id={ind.id} cls="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="text-white font-bold text-base"
                    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  >
                    {ind.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── REVIEWS ── */
function ReviewsSection({ dark }) {
  const ref = useScrollReveal();
  return (
    <section className={`py-16 ${dark ? "bg-[#070E1F]" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="text-center mb-12">
          <span
            className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 border"
            style={{
              background: dark
                ? "rgba(59,130,246,0.1)"
                : "rgba(59,130,246,0.07)",
              borderColor: "rgba(59,130,246,0.25)",
              color: "#60A5FA",
            }}
          >
            Client Reviews
          </span>
          <h2
            className={`text-4xl font-extrabold leading-tight tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          >
            What Our Clients Say
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className={`p-7 rounded-2xl border flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 ${dark ? "bg-[#0A1628] border-white/8 hover:border-blue-500/30" : "bg-white border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-blue-100"}`}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-4 h-4 fill-amber-400"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p
                className={`text-sm leading-relaxed flex-1 ${dark ? "text-slate-300" : "text-slate-600"}`}
              >
                "{r.quote}"
              </p>
              <div
                className={`pt-4 border-t ${dark ? "border-white/8" : "border-slate-100"}`}
              >
                <div
                  className={`font-bold text-[13px] ${dark ? "text-white" : "text-slate-900"}`}
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                >
                  {r.role}
                </div>
                <div
                  className={`text-[12px] mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {r.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function ContactSection({ dark }) {
  const ref = useScrollReveal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Dynamics 365",
    message: "",
  });
  const upd = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all duration-200 ${dark ? "bg-white/5 border-white/12 text-white placeholder-slate-500 focus:border-blue-500/60 focus:bg-blue-500/5" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-100"}`;

  return (
    <section
      id="contact"
      className={`py-24 ${dark ? "bg-[#060D1C]" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6 fade-up" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Copy */}
          <div>
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-5 border"
              style={{
                background: dark
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(59,130,246,0.07)",
                borderColor: "rgba(59,130,246,0.25)",
                color: "#60A5FA",
              }}
            >
              Ready to Modernise?
            </span>
            <h2
              className={`text-4xl font-extrabold leading-tight tracking-tight mb-4 ${dark ? "text-white" : "text-slate-900"}`}
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              Book a Free
              <br />
              Consultation
            </h2>
            <p
              className={`text-base leading-relaxed mb-8 max-w-md ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              Schedule a discovery call with our Microsoft certified experts to
              optimise your Dynamics 365, Power Platform, or Azure environments.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {[
                "24-hour response time",
                "No-obligation consultation",
                "Microsoft-focused roadmap",
              ].map((pt) => (
                <div key={pt} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(59,130,246,0.15)" }}
                  >
                    <CheckIcon cls="w-3 h-3 text-blue-500" />
                  </div>
                  <span
                    className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className={`p-7 rounded-2xl border ${dark ? "bg-[#0A1628] border-white/10" : "bg-slate-50 border-slate-200 shadow-sm"}`}
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={upd}
                  placeholder="Your full name"
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Business Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={upd}
                  placeholder="you@company.com"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={upd}
                  placeholder="+91 ..."
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Service Interest
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={upd}
                  className={inputCls}
                  style={{ appearance: "none" }}
                >
                  <option>Dynamics 365</option>
                  <option>Microsoft 365</option>
                  <option>Power Platform</option>
                  <option>Azure Cloud</option>
                  <option>Managed Support</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label
                className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}
              >
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={upd}
                placeholder="Tell us what you want to improve."
                className={inputCls}
              />
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}
            >
              Send Request <ArrowRight cls="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer({ dark }) {
  return (
    <footer
      className={`py-14 px-6 border-t ${dark ? "bg-[#030810] border-white/8" : "bg-slate-900 border-slate-800"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <a
              href="#home"
              className="inline-flex items-center gap-2.5 font-extrabold text-xl text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            >
              <div
                className="w-8 h-8"
                style={{
                  background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
                  clipPath:
                    "polygon(0 0,70% 0,100% 50%,70% 100%,0 100%,30% 50%)",
                }}
              />
              Innoviez
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5">
              Microsoft services partner for cloud, business applications,
              automation, and support.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Dynamics 365", "Power Platform", "Azure", "Microsoft 365"].map(
                (b) => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                  >
                    {b}
                  </span>
                ),
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
              Services
            </div>
            <ul className="flex flex-col gap-2.5">
              {[
                "Implementation",
                "Support Services",
                "Power BI Reporting",
                "Cloud Migration",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#services"
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
              Contact
            </div>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:hello@innoviez.com"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  hello@innoviez.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+910000000000"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  +91 00000 00000
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-sm">
                  Microsoft consulting & support
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 Innoviez. All rights reserved.
          </p>
          <div className="flex gap-6">
            {NAV.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-slate-500 hover:text-white text-xs transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── ROOT ── */
export default function Homepage() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Inject animation CSS
    const style = document.createElement("style");
    style.id = "inv-anim-css";
    style.textContent = ANIM_CSS;
    document.head.appendChild(style);
    // Load fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);
    return () => {
      document.getElementById("inv-anim-css")?.remove();
    };
  }, []);

  // Toggle dark class on html for Tailwind dark: prefix
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "bg-[#060D1C]" : "bg-white"}`}
    >
      <Navbar dark={dark} toggleDark={() => setDark((v) => !v)} />
      <main>
        <HeroSection dark={dark} />
        <Ticker dark={dark} />
        <ServicesSection dark={dark} />
        <CertificationsSection dark={dark} />
        <CTABanner dark={dark} />
        <ProjectsSection dark={dark} />
        <AboutSection dark={dark} />
        <IndustriesSection dark={dark} />
        <ReviewsSection dark={dark} />
        <ContactSection dark={dark} />
      </main>
      <Footer dark={dark} />
    </div>
  );
}
