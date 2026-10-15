import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Compass,
  DollarSign,
  Globe,
  Handshake,
  Layers,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { PlanOption, ServiceOption } from '../types/projectRequest';
import { TypewriterText } from '../components/TypewriterText';
import { CountUpNumber } from '../components/CountUpNumber';
import showcaseCommerceImage from '../assets/images/showcase_ecommerce_architecture_1790880821416.jpg';

interface HomePageProps {
  onOpenRequestModal: (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
    initialMode?: 'client' | 'partner';
  }) => void;
  onNavigateToPlans: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenRequestModal,
  onNavigateToPlans
}) => {
  const [showcaseImgError, setShowcaseImgError] = useState(false);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* =====================================================================
       * 1. HERO SECTION (EDITORIAL BEIGE PALETTE · REMOVED 3D LAPTOP)
       * ===================================================================== */}
      <section className="pt-10 sm:pt-16 max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D8D4CA] text-xs font-mono text-[#57554F]">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
              <span>Goodsify Development · Digital Studio</span>
              <span aria-hidden="true">·</span>
              <span>Fixed CAD Pricing</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#111110] tracking-tight leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Websites, storefronts, and{' '}
              <TypewriterText
                phrases={[
                  'custom web applications.',
                  'e-commerce storefronts.',
                  'high-speed business tools.',
                  'scalable digital products.'
                ]}
                className="text-[#1D4ED8]"
                cursorClassName="bg-[#1D4ED8]"
              />
            </h1>

            <p className="text-base sm:text-lg text-[#57554F] leading-relaxed max-w-2xl">
              Goodsify Development engineers fast, mobile-first business websites, retail storefronts, and bespoke software for commercial growth. Transparent fixed-tier packages starting at $70 CAD with direct intake and international collaboration.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onOpenRequestModal({ initialMode: 'client' })}
                className="px-6 py-3.5 bg-[#111110] text-white text-xs sm:text-sm font-semibold hover:bg-[#272624] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToPlans}
                className="px-6 py-3.5 bg-white border border-[#D8D4CA] text-[#111110] text-xs sm:text-sm font-medium hover:border-[#111110] transition-colors whitespace-nowrap"
              >
                View Plans &amp; Pricing
              </button>

              <button
                type="button"
                onClick={() => onOpenRequestModal({ initialMode: 'partner' })}
                className="px-5 py-3.5 bg-[#F2EFE9] border border-[#D8D4CA] text-[#111110] text-xs sm:text-sm font-medium hover:border-[#111110] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Handshake className="w-4 h-4 text-[#1D4ED8]" />
                <span>Partner With Us</span>
              </button>
            </div>

            <div className="pt-6 border-t border-[#E2DFD7] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#111110] tabular-nums">
                  <CountUpNumber end={70} prefix="$" suffix=" CAD" />
                </p>
                <p className="text-xs text-[#57554F] mt-0.5">Starter Entry Tier</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#111110] tabular-nums">
                  <CountUpNumber end={100} suffix="%" />
                </p>
                <p className="text-xs text-[#57554F] mt-0.5">Mobile Responsive</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#1D4ED8] tabular-nums">
                  Global
                </p>
                <p className="text-xs text-[#57554F] mt-0.5">Client &amp; Partner Base</p>
              </div>
            </div>
          </motion.div>

          {/* Clean Studio Architectural Card (Replaces 3D Laptop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="border border-[#D8D4CA] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6] text-xs font-mono text-[#57554F]">
                <span>STUDIO OVERVIEW</span>
                <span className="flex items-center gap-1.5 text-[#1D4ED8] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
                  Intake Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F7F6F2] border border-[#E2DFD7] space-y-1">
                  <span className="font-mono text-[11px] text-[#57554F] block">Production Architecture</span>
                  <p className="font-semibold text-[#111110] text-sm">
                    High-Performance Commercial Web Builds
                  </p>
                  <p className="text-[#57554F] text-xs leading-relaxed">
                    Custom responsive websites, e-commerce storefronts, and web software built for speed, conversion, and long-term owner control.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-white border border-[#E2DFD7]">
                    <span className="text-[#706D65] block">Starter Tier</span>
                    <strong className="text-[#111110] text-xs">$70 CAD</strong>
                    <span className="text-[10px] text-[#706D65] block mt-0.5">Up to 2 products</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E2DFD7]">
                    <span className="text-[#706D65] block">Business Tier</span>
                    <strong className="text-[#111110] text-xs">$100 CAD</strong>
                    <span className="text-[10px] text-[#706D65] block mt-0.5">Up to 20 products</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E2DFD7]">
                    <span className="text-[#706D65] block">Professional</span>
                    <strong className="text-[#111110] text-xs">$250 CAD</strong>
                    <span className="text-[10px] text-[#706D65] block mt-0.5">Up to 40 products</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E2DFD7]">
                    <span className="text-[#706D65] block">Custom Apps</span>
                    <strong className="text-[#111110] text-xs">Scoped</strong>
                    <span className="text-[10px] text-[#706D65] block mt-0.5">Web &amp; Mobile</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-mono text-[#57554F]">
                  <span>Domain &amp; hosting: Client owned</span>
                  <span className="text-[#1D4ED8]">International enquiries welcome</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
       * 2. CORE CAPABILITIES (CLEAN EDITORIAL BENTO GRID)
       * ===================================================================== */}
      <section id="capabilities" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-[#57554F] mb-1.5 uppercase tracking-wider">
              Capabilities &amp; Deliverables
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Engineered for clarity, conversion, and commercial ownership.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenRequestModal({ initialMode: 'client' })}
            className="text-xs sm:text-sm font-medium text-[#1D4ED8] hover:underline flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>Get Started with a Custom Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 01: Business & Informational Websites */}
          <div className="lg:col-span-2 bg-white border border-[#E2DFD7] p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#57554F] mb-4">
                <span className="font-mono">01. Web Presence</span>
                <span>Starter ($70 CAD) · Business ($100 CAD)</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111110] mb-3">
                01. Informational &amp; Business Websites
              </h3>
              <p className="text-sm text-[#57554F] leading-relaxed max-w-2xl mb-6">
                Clean, fast-loading websites structured for local businesses, service providers, and growing brands. Designed with clear typography, mobile responsiveness, and direct lead capture without bloated templates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#57554F] border-t border-[#EFECE6] pt-5 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Mobile &amp; desktop responsive layouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Custom brand typography &amp; color system</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Service breakdowns &amp; inquiry routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Domain &amp; hosting setup guidance</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    service: 'Business Website',
                    plan: 'Business — $100 CAD'
                  })
                }
                className="px-4 py-2 bg-[#111110] text-white text-xs font-medium hover:bg-[#272624] transition-colors whitespace-nowrap"
              >
                Get Started — Business ($100 CAD)
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    service: 'Informational Website',
                    plan: 'Starter — $70 CAD'
                  })
                }
                className="text-xs font-medium text-[#57554F] hover:text-[#111110] underline whitespace-nowrap"
              >
                Request Starter ($70 CAD)
              </button>
            </div>
          </div>

          {/* Card 02: E-Commerce Storefronts */}
          <div className="bg-white border border-[#E2DFD7] p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#57554F] mb-4">
                <span className="font-mono">02. Online Retail</span>
                <span className="font-mono font-semibold text-[#111110]">$250 CAD</span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#111110] mb-3">
                02. E-Commerce Websites
              </h3>
              <p className="text-sm text-[#57554F] leading-relaxed mb-6">
                Structured product catalogs, collection filtering, and streamlined checkout flows for up to 40 products and advanced retail features.
              </p>
              <ul className="space-y-2.5 text-xs text-[#57554F] border-t border-[#EFECE6] pt-5 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Product catalog &amp; SKU architecture (up to 40 items)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Mobile-optimized product photography grids</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>Optional $150/month ongoing maintenance &amp; care</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenRequestModal({
                  service: 'E-Commerce Website',
                  plan: 'Professional — $250 CAD'
                })
              }
              className="w-full px-4 py-2.5 bg-[#1D4ED8] text-white text-xs font-medium hover:bg-[#1E40AF] transition-colors whitespace-nowrap text-center"
            >
              Start E-Commerce Project ($250 CAD)
            </button>
          </div>

          {/* Card 03: Custom Web Applications & Mobile Apps */}
          <div className="lg:col-span-3 bg-white border border-[#E2DFD7] p-7 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#57554F]">
                <span className="font-mono">03. Custom Engineering</span>
                <span aria-hidden="true">·</span>
                <span>Web Applications &amp; Mobile Apps</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111110]">
                03. Custom Web Applications &amp; Mobile Apps
              </h3>
              <p className="text-sm text-[#57554F] leading-relaxed max-w-2xl">
                Need a custom booking workflow, internal business tool, client portal, or cross-platform mobile application? Submit your technical requirements, reference links, and target deadline for a tailored engineering roadmap.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onOpenRequestModal({
                      service: 'Custom Web Application',
                      plan: 'Custom Project'
                    })
                  }
                  className="px-4 py-2 bg-[#111110] text-white text-xs font-medium hover:bg-[#272624] transition-colors whitespace-nowrap"
                >
                  Request Custom Web App
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenRequestModal({
                      service: 'Custom Mobile App',
                      plan: 'Custom Project'
                    })
                  }
                  className="px-4 py-2 border border-[#D8D4CA] bg-[#F7F6F2] text-[#111110] text-xs font-medium hover:border-[#111110] transition-colors whitespace-nowrap"
                >
                  Request Custom Mobile App
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-video w-full overflow-hidden border border-[#E2DFD7] bg-[#191817]">
                {!showcaseImgError ? (
                  <img
                    src={showcaseCommerceImage}
                    alt="Minimalist responsive e-commerce and web application display on laptop and mobile"
                    referrerPolicy="no-referrer"
                    onError={() => setShowcaseImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-xs font-mono text-[#A39E93]">
                    Responsive Multi-Device Architecture
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 3. PARTNER WITH US SECTION (NEW)
       * ===================================================================== */}
      <section id="partner" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-[#1D4ED8] mb-1.5 uppercase tracking-wider font-semibold">
                Collaborative Network
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Partner with Goodsify Development.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenRequestModal({ initialMode: 'partner' })}
              className="px-5 py-2.5 bg-[#111110] text-white text-xs font-medium hover:bg-[#272624] transition-colors whitespace-nowrap self-start md:self-auto flex items-center gap-2"
            >
              <span>Join Partner Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm text-[#57554F] leading-relaxed max-w-3xl mt-3">
            We collaborate with freelance developers, web designers, creative agencies, branding professionals, and referral partners globally. Collaborators may work on suitable client projects, refer customers, or support technical delivery depending on their skills and the agreed arrangement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E2DFD7] p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-[#F7F6F2] border border-[#D8D4CA] flex items-center justify-center text-[#111110]">
              <Code2 className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <h3 className="font-display text-base font-bold text-[#111110]">
              Project Subcontracting &amp; Delivery
            </h3>
            <p className="text-xs text-[#57554F] leading-relaxed">
              Skilled freelance engineers and designers are invited to collaborate on client builds requiring specialized frontend, headless, or UX capabilities.
            </p>
          </div>

          <div className="bg-white border border-[#E2DFD7] p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-[#F7F6F2] border border-[#D8D4CA] flex items-center justify-center text-[#111110]">
              <DollarSign className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <h3 className="font-display text-base font-bold text-[#111110]">
              Client Referral Arrangements
            </h3>
            <p className="text-xs text-[#57554F] leading-relaxed">
              Introduce clients who need fixed-tier websites or storefronts and earn commissions on qualified projects under a written agreement.
            </p>
          </div>

          <div className="bg-white border border-[#E2DFD7] p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-[#F7F6F2] border border-[#D8D4CA] flex items-center justify-center text-[#111110]">
              <Globe className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <h3 className="font-display text-base font-bold text-[#111110]">
              Cross-Border Collaboration
            </h3>
            <p className="text-xs text-[#57554F] leading-relaxed">
              We welcome partners across Canada, the US, the UK, Europe, and internationally. Work asynchronously across modern project stacks.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 4. WORK WITH US SECTION (CLEAR OPPORTUNITIES) (NEW)
       * ===================================================================== */}
      <section id="work-with-us" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 mb-8">
          <p className="text-xs font-mono text-[#57554F] mb-1.5 uppercase tracking-wider">
            Opportunities
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Work with Goodsify across five disciplines.
          </h2>
          <p className="text-sm text-[#57554F] leading-relaxed max-w-2xl mt-2">
            We maintain an open roster of trusted creative and technical specialists. Project assignments are matched strictly to client project demand and milestone schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Web Developers',
              role: 'Frontend, Full-Stack & APIs',
              description:
                'Modern JavaScript, React, TypeScript, Vite, Tailwind CSS, API integrations, and e-commerce setups.'
            },
            {
              title: 'UI/UX & Web Designers',
              role: 'Visual Systems & Layouts',
              description:
                'Mobile-first responsive mockups, design systems, conversion-driven product catalogs, and typography.'
            },
            {
              title: 'Branding & Creative Specialists',
              role: 'Brand Identity & Content',
              description:
                'Logo design, brand guidelines, product copywriting, and visual asset preparation for new business launches.'
            },
            {
              title: 'Client Referral Partners',
              role: 'Consultants & Agencies',
              description:
                'Introduce businesses seeking fast, affordable fixed-tier websites and receive referral payouts.'
            },
            {
              title: 'Project Collaborators',
              role: 'Specialist Contributors',
              description:
                'Domain specialists for bilingual translations, SEO audits, payment gateway setups, and sprint tasks.'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E2DFD7] p-5 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] text-[#1D4ED8] block mb-1 font-semibold">
                  {item.role}
                </span>
                <h3 className="font-display text-base font-bold text-[#111110] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#57554F] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() =>
                    onOpenRequestModal({
                      initialMode: 'partner',
                      plan: item.title as any
                    })
                  }
                  className="text-xs font-semibold text-[#111110] hover:text-[#1D4ED8] transition-colors flex items-center gap-1"
                >
                  <span>Apply for Roster</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Transparent Notice Card */}
          <div className="bg-[#EFECE6] border border-[#D8D4CA] p-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] text-[#57554F] block mb-1">
                Transparency Statement
              </span>
              <h3 className="font-display text-base font-bold text-[#111110] mb-2">
                Flexible Project Demand
              </h3>
              <p className="text-xs text-[#57554F] leading-relaxed">
                Goodsify Development engages collaborators on a project-by-project freelance basis. Opportunities depend on client demand and are not salaried or guaranteed employment.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#DCD7CC]">
              <span className="text-[11px] font-mono text-[#57554F]">Written agreements on all work</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 5. EARN WITH GOODSIFY SECTION (NEW)
       * ===================================================================== */}
      <section id="earn" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="bg-[#111110] text-[#F7F6F2] p-8 sm:p-12 border border-[#2B2925] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A39E93]">
              <Handshake className="w-4 h-4 text-[#1D4ED8]" />
              <span>Referral Partner Programme</span>
            </div>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Earn with Goodsify on qualified client referrals.
            </h2>
            <p className="text-sm text-[#C8C3B8] leading-relaxed">
              Do you work with businesses, founders, or brands needing a clean website or e-commerce storefront? Eligible referral partners may earn commission on qualified projects under an agreed written commission arrangement.
            </p>
            <p className="text-xs text-[#8C887E]">
              Note: Commission terms are confirmed in writing on an individual project agreement basis prior to kickoff.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() =>
                onOpenRequestModal({
                  initialMode: 'partner',
                  plan: 'Client Referral Partner' as any
                })
              }
              className="px-6 py-3.5 bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Discuss a Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 6. GOODSIFY LAUNCHLAB SECTION (NEW)
       * ===================================================================== */}
      <section id="launchlab" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border border-[#D8D4CA] bg-white p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#F7F6F2] border border-[#D8D4CA] text-xs font-mono text-[#57554F]">
              <Rocket className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>GoodsifyCo Initiative · Entrepreneurial Advisory</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight">
              Goodsify LaunchLab — From Concept to First Sale
            </h2>

            <p className="text-sm text-[#57554F] leading-relaxed max-w-2xl">
              LaunchLab is a specialized GoodsifyCo service created for aspiring entrepreneurs who need structured help organizing a business idea, clarifying brand direction, planning their launch schedule, and getting started online with minimum wasted capital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#57554F]">
              <div className="p-3 bg-[#F7F6F2] border border-[#E2DFD7]">
                <strong className="block text-[#111110] mb-0.5">Idea Structuring</strong>
                <span>Refining market niche, pricing tiers, and offering scope.</span>
              </div>
              <div className="p-3 bg-[#F7F6F2] border border-[#E2DFD7]">
                <strong className="block text-[#111110] mb-0.5">Brand Direction</strong>
                <span>Typography, tone of voice, visual benchmarks, and domain choice.</span>
              </div>
              <div className="p-3 bg-[#F7F6F2] border border-[#E2DFD7]">
                <strong className="block text-[#111110] mb-0.5">Launch Roadmap</strong>
                <span>Technical checklist from website setup to social channels.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            <button
              type="button"
              onClick={() =>
                onOpenRequestModal({
                  service: 'Goodsify LaunchLab' as any,
                  plan: 'Custom Project'
                })
              }
              className="w-full px-6 py-3.5 bg-[#111110] text-white text-xs sm:text-sm font-semibold hover:bg-[#272624] transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span>Explore LaunchLab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenRequestModal({
                  service: 'Goodsify LaunchLab' as any,
                  plan: 'Custom Project'
                })
              }
              className="w-full px-5 py-2.5 bg-white border border-[#D8D4CA] text-[#57554F] hover:text-[#111110] text-xs font-medium hover:border-[#111110] transition-colors text-center"
            >
              Start Your Business Roadmap
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 7. INTERNATIONAL CLIENTS & COLLABORATORS (NEW)
       * ===================================================================== */}
      <section id="international" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-mono text-[#1D4ED8] uppercase tracking-wider font-semibold">
              Global Reach
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight">
              International Clients &amp; Borderless Delivery.
            </h2>
            <p className="text-sm text-[#57554F] leading-relaxed">
              Goodsify Development proudly welcomes enquiries from businesses and collaborators in different countries worldwide. Whether you are operating in Canada, the US, the UK, Europe, or the Middle East, our intake process accommodates remote collaboration.
            </p>
            <p className="text-xs text-[#706D65] leading-relaxed">
              * Please note that local payment gateway support, currency options, and specific third-party integrations depend on regional provider availability and compliance requirements.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white border border-[#E2DFD7] space-y-1.5">
              <span className="font-mono text-[#1D4ED8] font-semibold">Transparent CAD Invoicing</span>
              <p className="text-[#57554F] leading-relaxed">
                All fixed packages are quoted transparently in Canadian Dollars (CAD) with no hidden exchange surprises.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#E2DFD7] space-y-1.5">
              <span className="font-mono text-[#1D4ED8] font-semibold">Asynchronous Workflows</span>
              <p className="text-[#57554F] leading-relaxed">
                Structured updates and intake forms keep your milestone on schedule regardless of your local time zone.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#E2DFD7] space-y-1.5">
              <span className="font-mono text-[#1D4ED8] font-semibold">Global Domain Integration</span>
              <p className="text-[#57554F] leading-relaxed">
                Guidance connecting country-code top-level domains (.ca, .co.uk, .com, .ae, .eu) to modern hosting.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#E2DFD7] space-y-1.5">
              <span className="font-mono text-[#1D4ED8] font-semibold">Multi-Currency &amp; Bilingual</span>
              <p className="text-[#57554F] leading-relaxed">
                Support for multilingual catalogs, international shipping rules, and regional tax calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 8. STRUCTURED WORKFLOW (4 STEPS)
       * ===================================================================== */}
      <section id="process" className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 mb-10">
          <p className="text-xs font-mono text-[#57554F] mb-1.5 uppercase tracking-wider">
            Structured Project Workflow
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            From project brief to live deployment in four clear steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Submit Project Brief',
              description:
                'Complete our 5-step Project Request Form with your service type, selected plan, deadline, and existing brand assets.'
            },
            {
              step: '02',
              title: 'Scope & Asset Review',
              description:
                'We review your submission, verify your domain, hosting, and product content needs, and confirm your build schedule.'
            },
            {
              step: '03',
              title: 'Design & Development',
              description:
                'We build your responsive website or application with clean typography, structured navigation, and fast load performance.'
            },
            {
              step: '04',
              title: 'Quality Check & Launch',
              description:
                'After you review the live preview on mobile and desktop, we connect your domain and launch your project.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white border border-[#E2DFD7] p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[#1D4ED8] block mb-3 font-semibold">
                  Step {item.step}
                </span>
                <h3 className="text-base font-semibold text-[#111110] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#57554F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
       * 9. PRIMARY CALL TO ACTION
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="bg-[#111110] text-[#F7F6F2] p-8 sm:p-12 border border-[#2B2925] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <p className="font-mono text-xs text-[#A39E93]">
              Ready to Begin · Direct Online Intake
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Tell us what you are building and receive your project roadmap.
            </h2>
            <p className="text-sm text-[#C8C3B8] leading-relaxed">
              Takes less than two minutes. Choose your service tier, tell us which assets you already have, and submit your request directly to our verified intake system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenRequestModal({ initialMode: 'client' })}
              className="px-6 py-3.5 bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E40AF] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenRequestModal({ initialMode: 'partner' })}
              className="px-5 py-3.5 border border-[#3F3D39] text-white text-xs sm:text-sm font-medium hover:bg-[#272624] transition-colors whitespace-nowrap"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
