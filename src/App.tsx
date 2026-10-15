import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { PlansPricingPage } from './pages/PlansPricingPage';
import { ProjectRequestModal, ModalIntakeMode } from './components/ProjectRequestModal';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { ScrollProgressButton } from './components/ScrollProgressButton';
import { PlanOption, ServiceOption } from './types/projectRequest';

type PublicPage = 'home' | 'plans';

export default function App() {
  const [activePage, setActivePage] = useState<PublicPage>('home');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalIntakeMode>('client');
  const [preselectedPlan, setPreselectedPlan] = useState<PlanOption | ''>('');
  const [preselectedService, setPreselectedService] = useState<ServiceOption | ''>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleOpenRequestModal = (options?: {
    plan?: PlanOption;
    service?: ServiceOption;
    initialMode?: ModalIntakeMode;
  }) => {
    setPreselectedPlan(options?.plan || '');
    setPreselectedService(options?.service || '');
    setModalMode(options?.initialMode || 'client');
    setIsModalOpen(true);
  };

  const handleNavigate = (page: PublicPage, scrollToHash?: string) => {
    setActivePage(page);
    if (scrollToHash) {
      setTimeout(() => {
        const el = document.querySelector(scrollToHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmissionSuccess = useCallback(
    (details: {
      requestId: string;
      submittedAt: string;
      businessName: string;
      service: string;
      plan: string;
    }) => {
      const toastId = `submission-${details.requestId}-${Date.now()}`;
      setToasts((prev) => [
        ...prev.filter((t) => t.referenceId !== details.requestId),
        {
          id: toastId,
          title: 'Submission Received',
          description: `Thanks for submitting ${
            details.businessName ? `for ${details.businessName}` : 'your proposal'
          }. We'll review your details and contact you with next steps.`,
          referenceId: details.requestId,
          meta: details.service || details.plan,
          durationMs: 10000,
          triggerConfetti: true
        }
      ]);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#111110] bg-warm-grid selection:bg-[#111110] selection:text-[#F7F6F2] relative">
      {/* Floating Scroll to Top Progress Button */}
      <ScrollProgressButton />

      {/* =====================================================================
       * TOP NAVIGATION BAR (Warm Editorial Header)
       * ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#E2DFD7]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#111110] text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            Goodsify Development
          </button>

          {/* Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activePage === 'home'
                  ? 'text-[#111110] border-[#111110] font-semibold'
                  : 'text-[#57554F] border-transparent hover:text-[#111110]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('plans')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activePage === 'plans'
                  ? 'text-[#111110] border-[#111110] font-semibold'
                  : 'text-[#57554F] border-transparent hover:text-[#111110]'
              }`}
            >
              Plans &amp; Pricing
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('home', '#partner')}
              className="py-1 text-[#57554F] border-b-2 border-transparent hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              Partner With Us
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('home', '#launchlab')}
              className="py-1 text-[#57554F] border-b-2 border-transparent hover:text-[#111110] transition-colors whitespace-nowrap shrink-0"
            >
              LaunchLab
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenRequestModal({ initialMode: 'partner' })}
              className="hidden sm:inline-flex px-3.5 py-2 border border-[#D8D4CA] bg-white text-[#111110] text-xs font-medium hover:border-[#111110] transition-colors whitespace-nowrap"
            >
              Partner With Us
            </button>

            <button
              type="button"
              onClick={() => handleOpenRequestModal({ initialMode: 'client' })}
              className="px-4 py-2 bg-[#111110] text-white text-xs font-semibold hover:bg-[#272624] transition-colors whitespace-nowrap shrink-0"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
       * MAIN CONTENT WITH PAGE TRANSITIONS
       * ===================================================================== */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activePage === 'home' ? (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <HomePage
                onOpenRequestModal={handleOpenRequestModal}
                onNavigateToPlans={() => handleNavigate('plans')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="plans-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <PlansPricingPage onOpenRequestModal={handleOpenRequestModal} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =====================================================================
       * WARM BEIGE EDITORIAL FOOTER
       * ===================================================================== */}
      <footer className="border-t border-[#DCD7CC] bg-[#EFECE6] text-[#57554F]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-2.5">
            <p className="font-display text-base font-bold text-[#111110]">
              Goodsify Development
            </p>
            <p className="text-xs text-[#57554F] leading-relaxed max-w-sm">
              Digital product studio engineering high-performance websites, e-commerce storefronts, and bespoke web applications. Fixed-tier Canadian Dollar pricing with worldwide remote delivery.
            </p>
            <p className="text-[11px] text-[#706D65] pt-1">
              Part of the GoodsifyCo initiative · LaunchLab Advisory
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#111110] font-semibold block uppercase">
                Pages &amp; Pricing
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('plans')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Plans &amp; Pricing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenRequestModal({ initialMode: 'client' })}
                    className="text-[#1D4ED8] font-medium hover:underline"
                  >
                    Start Project Brief
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#111110] font-semibold block uppercase">
                Partnerships
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', '#partner')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Partner With Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', '#work-with-us')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Work Opportunities
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', '#earn')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Referral Programme
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenRequestModal({ initialMode: 'partner' })}
                    className="text-[#1D4ED8] font-medium hover:underline"
                  >
                    Discuss Partnership
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#111110] font-semibold block uppercase">
                Initiatives
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', '#launchlab')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    Goodsify LaunchLab
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', '#international')}
                    className="hover:text-[#111110] transition-colors"
                  >
                    International Enquiries
                  </button>
                </li>
                <li>
                  <span className="text-[11px] text-[#706D65] block pt-1">
                    Clients own 100% of domain &amp; hosting accounts.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DCD7CC] max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#706D65]">
          <span>&copy; {new Date().getFullYear()} Goodsify Development. All rights reserved.</span>
          <span className="font-mono">All packages listed in CAD · Powered by Google Sheets Sync</span>
        </div>
      </footer>

      {/* =====================================================================
       * PROJECT & PARTNER REQUEST INTAKE MODAL
       * ===================================================================== */}
      <ProjectRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlan={preselectedPlan}
        initialService={preselectedService}
        initialMode={modalMode}
        onSubmissionSuccess={handleSubmissionSuccess}
      />

      {/* =====================================================================
       * PERSISTENT TOAST NOTIFICATIONS
       * ===================================================================== */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
