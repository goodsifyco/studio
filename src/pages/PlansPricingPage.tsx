import React from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PlanOption, ServiceOption } from '../types/projectRequest';
import { CountUpNumber } from '../components/CountUpNumber';

interface PlansPricingPageProps {
  onOpenRequestModal: (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
    initialMode?: 'client' | 'partner';
  }) => void;
}

interface PricingTier {
  id: string;
  name: string;
  planValue: PlanOption;
  defaultService: ServiceOption;
  priceNumber: number | null;
  priceDisplay: string;
  productLimit: string;
  carePlanNote: string;
  billingNote: string;
  recommendedFor: string;
  description: string;
  deliverables: string[];
  highlighted?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    planValue: 'Starter — $70 CAD',
    defaultService: 'Informational Website',
    priceNumber: 70,
    priceDisplay: '$70 CAD',
    productLimit: 'Up to 2 products',
    carePlanNote: 'Optional $20/month maintenance & care',
    billingNote: 'One-time build fee · Domain & hosting by client',
    recommendedFor: 'Informational Websites · Single-Focus Brands',
    description:
      'Essential web presence for new brands, personal businesses, and single-focus service offerings with up to 2 products.',
    deliverables: [
      'Up to 2 products or services catalogued',
      'Clean responsive layout (Mobile & Desktop)',
      'Core informational sections & brand introduction',
      'Contact & inquiry routing setup',
      'Social media profile integration',
      'Domain connection guidance',
      'Optional $20/month ongoing maintenance & care'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    planValue: 'Business — $100 CAD',
    defaultService: 'Business Website',
    priceNumber: 100,
    priceDisplay: '$100 CAD',
    productLimit: 'Up to 20 products',
    carePlanNote: 'Optional $50/month maintenance & care',
    billingNote: 'One-time build fee · Domain & hosting by client',
    recommendedFor: 'Service Businesses · Growing Brands · Commerce',
    description:
      'Complete multi-section business website with payment functionality as specified in the offer and up to 20 products.',
    deliverables: [
      'Up to 20 products catalogued with collection filtering',
      'Payment functionality as specified in the offer',
      'Multi-section architecture & custom navigation',
      'Validated client lead-capture & inquiry workflow',
      'On-page search engine structure (titles & metadata)',
      'Performance & mobile speed optimization',
      'Domain & hosting setup assistance',
      'Optional $50/month ongoing maintenance & care'
    ],
    highlighted: true
  },
  {
    id: 'professional',
    name: 'Professional',
    planValue: 'Professional — $250 CAD',
    defaultService: 'E-Commerce Website',
    priceNumber: 250,
    priceDisplay: '$250 CAD',
    productLimit: 'Up to 40 products',
    carePlanNote: 'Optional $150/month maintenance & care',
    billingNote: 'One-time build fee · Domain & hosting by client',
    recommendedFor: 'E-Commerce Storefronts · Advanced Retail',
    description:
      'Full-featured digital storefront with up to 40 products, advanced retail flows, and comprehensive multi-page platform.',
    deliverables: [
      'Up to 40 products and advanced retail features',
      'E-Commerce catalog, collection filters & SKU architecture',
      'Product detail views, photos & pricing configuration',
      'Cart & checkout workflow setup',
      'Mobile-first retail shopping experience',
      'Existing brand assets integration',
      'Launch checklist & handover walkthrough',
      'Optional $150/month ongoing maintenance & care'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Project',
    planValue: 'Custom Project',
    defaultService: 'Custom Web Application',
    priceNumber: null,
    priceDisplay: 'Custom Scope',
    productLimit: 'Custom specification',
    carePlanNote: 'Milestone-based maintenance SLA',
    billingNote: 'Scoped to specification · Detailed quote',
    recommendedFor: 'Web Applications · Mobile Apps · Bespoke Systems',
    description:
      'Tailored architecture for custom web applications, mobile apps, booking engines, or specialized digital integrations.',
    deliverables: [
      'Custom technical architecture & database design',
      'Web application or cross-platform mobile build',
      'Custom user flows & business logic',
      'Third-party API & workflow integrations',
      'Dedicated milestone schedule & deployment support',
      'Milestone-based maintenance SLA'
    ]
  }
];

export const PlansPricingPage: React.FC<PlansPricingPageProps> = ({
  onOpenRequestModal
}) => {
  return (
    <div className="space-y-20 pb-20">
      {/* =====================================================================
       * 1. HEADER & PRICING CARDS (BEIGE EDITORIAL THEME)
       * ===================================================================== */}
      <section className="pt-10 sm:pt-16 max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D8D4CA] text-xs font-mono text-[#57554F] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
            <span>Goodsify Development · Plans &amp; Pricing</span>
            <span aria-hidden="true">·</span>
            <span>CAD Pricing</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-5xl font-bold text-[#111110] tracking-tight leading-[1.1] mb-4"
            style={{ textWrap: 'balance' }}
          >
            Straightforward pricing for every stage of your business.
          </h1>

          <p className="text-base sm:text-lg text-[#57554F] leading-relaxed">
            Select the package that matches your project requirements, or request a custom specification. Transparent Canadian Dollar (CAD) pricing with client-managed hosting and domain ownership.
          </p>
        </motion.div>

        {/* 4-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bg-white border flex flex-col justify-between p-6 sm:p-7 transition-all ${
                tier.highlighted
                  ? 'border-[#1D4ED8] ring-1 ring-[#1D4ED8] plan-glow'
                  : 'border-[#D8D4CA] hover:border-[#111110]'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <h2 className="font-display text-xl font-bold text-[#111110]">
                    {tier.name}
                  </h2>
                  {tier.highlighted && (
                    <span className="font-mono text-[11px] text-[#1D4ED8] font-semibold px-2 py-0.5 bg-[#EFF6FF] border border-[#BFDBFE]">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#57554F] mb-4">{tier.recommendedFor}</p>

                <div className="pb-4 mb-4 border-b border-[#EFECE6]">
                  <div className="font-mono text-3xl font-bold text-[#111110] tabular-nums">
                    {tier.priceNumber !== null ? (
                      <CountUpNumber end={tier.priceNumber} prefix="$" suffix=" CAD" />
                    ) : (
                      tier.priceDisplay
                    )}
                  </div>
                  <div className="text-[11px] text-[#57554F] mt-1">{tier.billingNote}</div>
                  <div className="mt-2 text-xs font-mono font-medium text-[#1D4ED8] bg-[#F7F6F2] p-1.5 border border-[#E2DFD7]">
                    {tier.productLimit}
                  </div>
                  <div className="mt-1 text-[11px] text-[#57554F] font-mono">
                    {tier.carePlanNote}
                  </div>
                </div>

                <p className="text-xs text-[#57554F] leading-relaxed mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-2 text-xs text-[#111110] mb-8">
                  {tier.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenRequestModal({
                    plan: tier.planValue,
                    service: tier.defaultService,
                    initialMode: 'client'
                  })
                }
                className={`w-full py-2.5 px-4 text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  tier.highlighted
                    ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                    : 'bg-[#111110] text-white hover:bg-[#272624]'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =====================================================================
       * 2. DETAILED COMPARISON TABLE (BEIGE THEME)
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 mb-8">
          <p className="text-xs font-mono text-[#57554F] mb-1.5 uppercase tracking-wider">
            Package Comparison
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight">
            Deliverable specifications across all tiers.
          </h2>
        </div>

        <div className="bg-white border border-[#D8D4CA] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2DFD7] bg-[#F7F6F2] text-xs font-mono text-[#57554F]">
                <th className="py-3 px-5 font-semibold">Deliverable / Feature</th>
                <th className="py-3 px-4 font-semibold tabular-nums">Starter ($70 CAD)</th>
                <th className="py-3 px-4 font-semibold tabular-nums text-[#1D4ED8]">Business ($100 CAD)</th>
                <th className="py-3 px-4 font-semibold tabular-nums">Professional ($250 CAD)</th>
                <th className="py-3 px-4 font-semibold">Custom Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-xs text-[#57554F]">
              {[
                {
                  feature: 'Primary Scope',
                  starter: 'Informational Site',
                  business: 'Business & Commerce',
                  professional: 'Advanced Retail Store',
                  custom: 'Web / Mobile Software'
                },
                {
                  feature: 'Product Capacity',
                  starter: 'Up to 2 products',
                  business: 'Up to 20 products',
                  professional: 'Up to 40 products',
                  custom: 'Custom architecture'
                },
                {
                  feature: 'Payment Integration',
                  starter: 'Contact / Inquiry flow',
                  business: 'Payment as specified in offer',
                  professional: 'Full cart & checkout flows',
                  custom: 'Custom gateway integration'
                },
                {
                  feature: 'Optional Ongoing Care',
                  starter: '$20 CAD / month',
                  business: '$50 CAD / month',
                  professional: '$150 CAD / month',
                  custom: 'Milestone SLA'
                },
                {
                  feature: 'Domain & Hosting',
                  starter: 'Client owned & billed',
                  business: 'Client owned & billed',
                  professional: 'Client owned & billed',
                  custom: 'Client owned & billed'
                },
                {
                  feature: 'Mobile Responsive',
                  starter: '100% Responsive',
                  business: '100% Responsive',
                  professional: '100% Responsive',
                  custom: '100% Responsive'
                }
              ].map((row) => (
                <tr key={row.feature} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-[#111110]">{row.feature}</td>
                  <td className="py-3.5 px-4 font-mono text-[#57554F]">{row.starter}</td>
                  <td className="py-3.5 px-4 font-mono text-[#1D4ED8] font-semibold">{row.business}</td>
                  <td className="py-3.5 px-4 font-mono text-[#111110] font-medium">{row.professional}</td>
                  <td className="py-3.5 px-4 font-mono text-[#57554F]">{row.custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================================
       * 3. TRANSPARENCY & FREQUENTLY ASKED QUESTIONS
       * ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-[#D8D4CA] pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-mono text-[#1D4ED8] uppercase tracking-wider font-semibold">
              Policy &amp; FAQs
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Clear terms before you begin.
            </h2>
            <p className="text-sm text-[#57554F] leading-relaxed">
              We maintain full transparency regarding third-party hosting, client ownership, and care plans. All projects receive personal scope review before work begins.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenRequestModal({ initialMode: 'client' })}
                className="px-6 py-3 bg-[#111110] text-white text-xs sm:text-sm font-semibold hover:bg-[#272624] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                q: 'Are hosting and domain included in the build price?',
                a: 'No. Domain registration and web hosting fees remain the direct responsibility and asset of the client. This guarantees you maintain 100% legal ownership of your digital property. We provide full step-by-step guidance connecting them.'
              },
              {
                q: 'What are the optional monthly care plans?',
                a: 'Care plans cover ongoing software updates, content changes, uptime monitoring, and priority technical support: Starter ($20/mo), Business ($50/mo), and Professional ($150/mo). They are completely optional.'
              },
              {
                q: 'Are prices quoted in Canadian Dollars (CAD)?',
                a: 'Yes. Starter ($70 CAD), Business ($100 CAD), and Professional ($250 CAD) are in Canadian Dollars. International clients are welcomed and invoiced in CAD.'
              },
              {
                q: 'What if I want to refer clients or collaborate?',
                a: 'We welcome referrals and agency collaborations. Eligible referral partners earn commission on qualified projects under a written agreement. Use the "Partner With Us" button to discuss details.'
              }
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-[#E2DFD7] p-5 space-y-2">
                <h3 className="text-xs font-semibold text-[#111110] leading-snug">{faq.q}</h3>
                <p className="text-xs text-[#57554F] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
