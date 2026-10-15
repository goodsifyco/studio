import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Globe,
  Handshake,
  Layers,
  Loader2,
  X
} from 'lucide-react';
import {
  EXISTING_RESOURCE_KEYS,
  ExistingResourcesMap,
  PLAN_OPTIONS,
  PlanOption,
  ProjectRequestFormData,
  SERVICE_OPTIONS,
  ServiceOption,
  YesNoChoice
} from '../types/projectRequest';
import {
  getActiveAppsScriptUrl,
  submitProjectRequestToGoogleSheets
} from '../config/appsScript';

export type ModalIntakeMode = 'client' | 'partner';

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanOption | '';
  initialService?: ServiceOption | '';
  initialMode?: ModalIntakeMode;
  onSubmissionSuccess?: (details: {
    requestId: string;
    submittedAt: string;
    businessName: string;
    service: string;
    plan: string;
  }) => void;
}

const STEP_LABELS = [
  { number: '01', title: 'Project' },
  { number: '02', title: 'Business' },
  { number: '03', title: 'Scope & Budget' },
  { number: '04', title: 'Existing Resources' },
  { number: '05', title: 'Review & Submit' }
];

const INITIAL_RESOURCES: ExistingResourcesMap = {
  'Domain': '',
  'Hosting': '',
  'Logo / Branding': '',
  'Product Photos': '',
  'Product Information': '',
  'Social Media': '',
  'Website Content': ''
};

const PARTNER_TRACKS = [
  {
    title: 'Web Developer',
    role: 'Frontend, React, TypeScript, APIs & headless delivery'
  },
  {
    title: 'UI/UX & Web Designer',
    role: 'Responsive layouts, e-commerce wireframes & mobile flows'
  },
  {
    title: 'Branding & Creative Professional',
    role: 'Brand identity, digital assets, typography & copy'
  },
  {
    title: 'Client Referral Partner',
    role: 'Refer qualified clients under an agreed commission structure'
  },
  {
    title: 'Agency / Project Collaborator',
    role: 'Cross-agency subcontracting & specialized sprint delivery'
  }
];

function getInitialFormState(
  initialPlan?: PlanOption | '',
  initialService?: ServiceOption | ''
): ProjectRequestFormData {
  let defaultBudget = '';
  if (initialPlan === 'Starter — $70 CAD') defaultBudget = '$70 CAD';
  else if (initialPlan === 'Business — $100 CAD') defaultBudget = '$100 CAD';
  else if (initialPlan === 'Professional — $250 CAD') defaultBudget = '$250 CAD';

  return {
    service: initialService || '',
    plan: initialPlan || '',
    fullName: '',
    businessName: '',
    email: '',
    instagram: '',
    websiteType: '',
    numberOfProducts: '',
    budget: defaultBudget,
    desiredDeadline: '',
    projectDescription: '',
    referenceWebsites: '',
    existingResources: { ...INITIAL_RESOURCES },
    additionalNotes: ''
  };
}

export const ProjectRequestModal: React.FC<ProjectRequestModalProps> = ({
  isOpen,
  onClose,
  initialPlan = '',
  initialService = '',
  initialMode = 'client',
  onSubmissionSuccess
}) => {
  const [mode, setMode] = useState<ModalIntakeMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProjectRequestFormData>(() =>
    getInitialFormState(initialPlan, initialService)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    requestId: string;
    submittedAt: string;
  } | null>(null);

  // Sync mode and prefilled options when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'client');
      if (!submittedRecord) {
        setFormData((prev) => {
          const nextPlan = initialPlan || prev.plan;
          let nextBudget = prev.budget;
          if (!nextBudget && nextPlan) {
            if (nextPlan === 'Starter — $70 CAD') nextBudget = '$70 CAD';
            else if (nextPlan === 'Business — $100 CAD') nextBudget = '$100 CAD';
            else if (nextPlan === 'Professional — $250 CAD') nextBudget = '$250 CAD';
          }
          return {
            ...prev,
            plan: nextPlan,
            service: initialService || prev.service,
            budget: nextBudget
          };
        });
      }
    }
  }, [isOpen, initialPlan, initialService, initialMode, submittedRecord]);

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const clearFieldError = (fieldKey: string) => {
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSelectService = (service: ServiceOption) => {
    setFormData((prev) => ({
      ...prev,
      service,
      websiteType: prev.websiteType || (service !== 'Other' ? service : '')
    }));
    clearFieldError('service');
  };

  const handleSelectPlan = (plan: PlanOption) => {
    let defaultBudget = formData.budget;
    if (plan === 'Starter — $70 CAD') defaultBudget = '$70 CAD';
    else if (plan === 'Business — $100 CAD') defaultBudget = '$100 CAD';
    else if (plan === 'Professional — $250 CAD') defaultBudget = '$250 CAD';
    else if (
      plan === 'Custom Project' &&
      ['$70 CAD', '$100 CAD', '$250 CAD'].includes(formData.budget)
    ) {
      defaultBudget = '';
    }

    setFormData((prev) => ({
      ...prev,
      plan,
      budget: defaultBudget
    }));
    clearFieldError('plan');
  };

  const handleResourceChoice = (key: keyof ExistingResourcesMap, choice: YesNoChoice) => {
    setFormData((prev) => ({
      ...prev,
      existingResources: {
        ...prev.existingResources,
        [key]: choice
      }
    }));
    clearFieldError(`resource_${key}`);
    clearFieldError('existingResources');
  };

  const handleMarkRemainingNo = () => {
    setFormData((prev) => {
      const updated = { ...prev.existingResources };
      for (const key of EXISTING_RESOURCE_KEYS) {
        if (!updated[key]) {
          updated[key] = 'No';
        }
      }
      return { ...prev, existingResources: updated };
    });
    setErrors({});
  };

  const validateClientStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.service) {
        newErrors.service = 'Please select what type of project you need.';
      }
      if (!formData.plan) {
        newErrors.plan = 'Please select the plan you are interested in.';
      }
    } else if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required.';
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business or brand name is required.';
      }
      const emailTrimmed = formData.email.trim();
      if (!emailTrimmed) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    } else if (step === 3) {
      if (!formData.websiteType.trim()) {
        newErrors.websiteType = 'Please specify the website or application type.';
      }
      if (!formData.numberOfProducts.trim()) {
        newErrors.numberOfProducts = 'Please enter the number of products (enter 0 if none).';
      }
      if (!formData.budget.trim()) {
        newErrors.budget = 'Please enter your estimated budget.';
      }
      if (!formData.desiredDeadline.trim()) {
        newErrors.desiredDeadline = 'Please specify your desired deadline or timeframe.';
      }
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = 'Please provide a brief description of your project.';
      }
    } else if (step === 4) {
      const unanswered = EXISTING_RESOURCE_KEYS.filter(
        (key) => !formData.existingResources[key]
      );
      if (unanswered.length > 0) {
        newErrors.existingResources = `Please select Yes or No for all items (${unanswered.length} remaining).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePartnerForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Country / location is required.';
    }
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Please enter your skills, discipline, or agency name.';
    }
    if (!formData.plan.trim()) {
      newErrors.plan = 'Please select a partnership track.';
    }
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Please share a brief note about your experience and how you would like to collaborate.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateClientStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNextStep();
      return;
    }

    for (let s = 1; s <= 4; s++) {
      if (!validateClientStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const activeUrl = getActiveAppsScriptUrl();
      if (!activeUrl) {
        throw new Error('Google Apps Script Web App URL is not configured.');
      }
      const result = await submitProjectRequestToGoogleSheets(formData);
      setSubmittedRecord({
        requestId: result.requestId,
        submittedAt: result.submittedAt
      });
      onSubmissionSuccess?.({
        requestId: result.requestId,
        submittedAt: result.submittedAt,
        businessName: formData.businessName.trim(),
        service: formData.service,
        plan: formData.plan
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the Google Apps Script endpoint. Please verify connection.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePartnerForm()) return;

    setSubmitError(null);
    setIsSubmitting(true);

    // Prepare clean payload for the verified 18-column Google Sheet
    const partnerPayload: ProjectRequestFormData = {
      ...formData,
      service: 'Partnership & Collaboration',
      websiteType: `Partner Track: ${formData.plan}`,
      numberOfProducts: '0 (Partner)',
      budget: formData.budget || 'Partner Commission / Project Arrangement',
      desiredDeadline: formData.desiredDeadline || 'Open / Project-Based',
      referenceWebsites: formData.referenceWebsites.trim() || 'Not provided'
    };

    try {
      const activeUrl = getActiveAppsScriptUrl();
      if (!activeUrl) {
        throw new Error('Google Apps Script Web App URL is not configured.');
      }
      const result = await submitProjectRequestToGoogleSheets(partnerPayload);
      setSubmittedRecord({
        requestId: result.requestId,
        submittedAt: result.submittedAt
      });
      onSubmissionSuccess?.({
        requestId: result.requestId,
        submittedAt: result.submittedAt,
        businessName: partnerPayload.businessName.trim(),
        service: partnerPayload.service,
        plan: partnerPayload.plan
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to send partner enquiry. Please contact us directly or retry.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRecord(null);
    setCurrentStep(1);
    setFormData(getInitialFormState('', ''));
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111110]/70 backdrop-blur-[2px] p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-request-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#F7F6F2] border border-[#D8D4CA] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E2DFD7] shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[#57554F]">
                Goodsify Development · Online Intake
              </p>
              <h2
                id="project-request-modal-title"
                className="font-display text-lg sm:text-xl font-bold text-[#111110] tracking-tight"
              >
                {submittedRecord
                  ? 'Submission Confirmed'
                  : mode === 'client'
                  ? 'Start Your Client Project'
                  : 'Partner & Collaborator Enquiry'}
              </h2>
            </div>

            <button
              type="button"
              onClick={submittedRecord ? handleResetAndClose : onClose}
              disabled={isSubmitting}
              className="w-9 h-9 flex items-center justify-center text-[#57554F] hover:text-[#111110] hover:bg-[#F2EFE9] transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher (Hidden after submission) */}
          {!submittedRecord && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#EFECE6]">
              <button
                type="button"
                onClick={() => {
                  setMode('client');
                  setErrors({});
                  setSubmitError(null);
                }}
                className={`text-xs font-mono px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  mode === 'client'
                    ? 'bg-[#111110] text-white border-[#111110] font-medium'
                    : 'bg-white text-[#57554F] border-[#D8D4CA] hover:border-[#111110]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Client Project Brief</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('partner');
                  setErrors({});
                  setSubmitError(null);
                }}
                className={`text-xs font-mono px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                  mode === 'partner'
                    ? 'bg-[#111110] text-white border-[#111110] font-medium'
                    : 'bg-white text-[#57554F] border-[#D8D4CA] hover:border-[#111110]'
                }`}
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Partner &amp; Collaborator</span>
              </button>
            </div>
          )}
        </div>

        {/* Step Progress Indicator (Only for Client Mode, Hidden after submission) */}
        {!submittedRecord && mode === 'client' && (
          <div className="bg-white border-b border-[#E2DFD7] px-6 pt-2.5 pb-3.5 shrink-0">
            <div className="flex items-center justify-between gap-1.5 mb-2">
              {STEP_LABELS.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep) {
                        setErrors({});
                        setSubmitError(null);
                        setCurrentStep(stepNum);
                      }
                    }}
                    disabled={stepNum > currentStep}
                    className={`group flex items-center gap-1 text-left transition-colors ${
                      stepNum < currentStep ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-1.5 py-0.5 border transition-colors ${
                        isActive
                          ? 'bg-[#111110] text-white border-[#111110] font-medium'
                          : isCompleted
                          ? 'bg-[#EFECE6] text-[#111110] border-[#D8D4CA]'
                          : 'bg-transparent text-[#8C887E] border-[#E2DFD7]'
                      }`}
                    >
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <span
                      className={`hidden sm:inline text-xs whitespace-nowrap ${
                        isActive
                          ? 'font-semibold text-[#111110]'
                          : isCompleted
                          ? 'font-medium text-[#57554F] group-hover:text-[#111110]'
                          : 'text-[#8C887E]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#E2DFD7]">
              <div
                className="h-full bg-[#111110] transition-all duration-200"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-[#111110]">
          {submittedRecord ? (
            /* ================================================================
             * AFTER SUBMISSION: CONFIRMATION SCREEN
             * ================================================================ */
            <div className="py-4">
              <div className="w-12 h-12 bg-[#111110] text-white flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>

              <p className="font-mono text-xs text-[#1D4ED8] mb-1.5 font-semibold">
                REFERENCE ID · {submittedRecord.requestId}
              </p>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#111110] tracking-tight mb-2">
                {mode === 'partner'
                  ? 'PARTNER ENQUIRY RECEIVED'
                  : 'PROJECT REQUEST RECEIVED'}
              </h3>

              <p className="text-sm text-[#57554F] leading-relaxed max-w-xl mb-6">
                {mode === 'partner'
                  ? 'Thank you for reaching out to collaborate with Goodsify Development. We review all partner proposals, match opportunities with active project demand, and will email you with the next steps.'
                  : "Thanks for submitting your project. We'll review your request and contact you with the next steps."}
              </p>

              <div className="bg-white border border-[#E2DFD7] p-4 text-xs space-y-2 mb-6">
                <div className="font-mono text-[#57554F] pb-1.5 border-b border-[#EFECE6]">
                  Submission Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#57554F]">
                  <div>
                    <span>Contact: </span>
                    <strong className="text-[#111110]">{formData.fullName}</strong>
                  </div>
                  <div>
                    <span>Email: </span>
                    <strong className="text-[#111110] font-mono">{formData.email}</strong>
                  </div>
                  <div>
                    <span>Track / Plan: </span>
                    <strong className="text-[#111110]">{formData.plan || 'Partnership'}</strong>
                  </div>
                  <div>
                    <span>Timestamp: </span>
                    <strong className="text-[#111110] font-mono">{submittedRecord.submittedAt.slice(0, 10)}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#111110] text-white text-xs font-semibold hover:bg-[#272624] transition-colors"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : mode === 'partner' ? (
            /* ================================================================
             * PARTNER & COLLABORATOR ENQUIRY FORM
             * ================================================================ */
            <form id="goodsify-partner-form" onSubmit={handlePartnerSubmit} noValidate className="space-y-5">
              <div className="border-b border-[#E2DFD7] pb-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-semibold text-[#111110]">
                    Collaborate with Goodsify Development
                  </h3>
                  <span className="text-xs font-mono text-[#57554F]">Partner Intake</span>
                </div>
                <p className="text-xs text-[#57554F] mt-1 leading-relaxed">
                  We partner with freelance developers, UI/UX designers, creative branding specialists, and referral partners globally. Fill out your details below to discuss collaboration opportunities.
                </p>
              </div>

              {/* Partnership Track Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#111110] mb-2">
                  Select your primary collaboration focus <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PARTNER_TRACKS.map((track) => {
                    const selected = formData.plan === track.title;
                    return (
                      <button
                        key={track.title}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, plan: track.title as any }));
                          clearFieldError('plan');
                        }}
                        className={`text-left p-3 border transition-colors ${
                          selected
                            ? 'bg-white border-[#111110] ring-1 ring-[#111110]'
                            : 'bg-white border-[#D8D4CA] hover:border-[#111110]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#111110] mb-0.5">
                          <span>{track.title}</span>
                          <span
                            className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                              selected ? 'bg-[#111110] border-[#111110] text-white' : 'border-[#D8D4CA]'
                            }`}
                          >
                            {selected && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57554F] leading-snug">{track.role}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.plan && (
                  <p className="mt-1.5 text-xs text-[#B91C1C] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.plan}</span>
                  </p>
                )}
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-partner-name" className="block text-xs font-semibold text-[#111110] mb-1">
                    Your Full Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="field-partner-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                      clearFieldError('fullName');
                    }}
                    placeholder="e.g., Alex Reed"
                    className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-partner-email" className="block text-xs font-semibold text-[#111110] mb-1">
                    Email Address <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="field-partner-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }));
                      clearFieldError('email');
                    }}
                    placeholder="alex@studio.com"
                    className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Country & Skills / Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-partner-country" className="block text-xs font-semibold text-[#111110] mb-1">
                    Country / Location <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="field-partner-country"
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, instagram: e.target.value }));
                      clearFieldError('instagram');
                    }}
                    placeholder="e.g., Canada, United Kingdom, US, Remote..."
                    className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                  />
                  {errors.instagram && (
                    <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.instagram}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-partner-skills" className="block text-xs font-semibold text-[#111110] mb-1">
                    Discipline / Skills or Business Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="field-partner-skills"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, businessName: e.target.value }));
                      clearFieldError('businessName');
                    }}
                    placeholder="e.g., React & Next.js, Figma UI, Independent Agency"
                    className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.businessName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Portfolio / Website Link */}
              <div>
                <label htmlFor="field-partner-portfolio" className="block text-xs font-semibold text-[#111110] mb-1">
                  Portfolio, Website, or GitHub / LinkedIn Link
                </label>
                <input
                  id="field-partner-portfolio"
                  type="url"
                  value={formData.referenceWebsites}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, referenceWebsites: e.target.value }))
                  }
                  placeholder="https://yourportfolio.com or github.com/username"
                  className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                />
              </div>

              {/* Message / Background */}
              <div>
                <label htmlFor="field-partner-message" className="block text-xs font-semibold text-[#111110] mb-1">
                  Collaboration Note &amp; Experience <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  id="field-partner-message"
                  rows={3}
                  value={formData.projectDescription}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, projectDescription: e.target.value }));
                    clearFieldError('projectDescription');
                  }}
                  placeholder="Share a brief overview of your tools, past projects, or the type of client work/referrals you would like to discuss..."
                  className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                />
                {errors.projectDescription && (
                  <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.projectDescription}</span>
                  </p>
                )}
              </div>

              {/* Transparency Callout */}
              <div className="p-3 bg-[#EFECE6] border border-[#E2DFD7] text-[11px] text-[#57554F] leading-relaxed">
                <strong>Transparency Note:</strong> Collaboration opportunities depend strictly on client project demand and mutual suitability. Collaborations are project-based arrangements or agreed written referral commissions, not salaried employment.
              </div>

              {submitError && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#111110] text-white text-xs font-semibold tracking-wide hover:bg-[#272624] transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SUBMITTING PARTNER PROPOSAL...</span>
                    </>
                  ) : (
                    <span>SUBMIT PARTNER PROPOSAL</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================================================================
             * CLIENT PROJECT BRIEF MULTI-STEP FORM (STEPS 1 TO 5 - BEIGE THEME)
             * ================================================================ */
            <form id="goodsify-project-form" onSubmit={handleClientSubmit} noValidate>
              {/* STEP 1 — PROJECT */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label className="block text-sm font-semibold text-[#111110]">
                        What do you need? <span className="text-[#B91C1C]">*</span>
                      </label>
                      <span className="text-xs font-mono text-[#57554F]">Step 1 of 5</span>
                    </div>
                    <p className="text-xs text-[#57554F] mb-3">
                      Select the primary digital product or website category for your build.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map((option) => {
                        const selected = formData.service === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelectService(option.value)}
                            className={`text-left p-3.5 border transition-all flex flex-col justify-between ${
                              selected
                                ? 'bg-white border-[#111110] ring-1 ring-[#111110]'
                                : 'bg-white border-[#D8D4CA] hover:border-[#111110]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 w-full mb-1">
                              <span className="text-xs font-semibold text-[#111110]">
                                {option.value}
                              </span>
                              <span
                                className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'bg-[#111110] border-[#111110] text-white'
                                    : 'border-[#D8D4CA]'
                                }`}
                              >
                                {selected && <Check className="w-2.5 h-2.5" />}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#57554F] leading-relaxed">
                              {option.summary}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.service && (
                      <p className="mt-1.5 text-xs text-[#B91C1C] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.service}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E2DFD7]">
                    <label className="block text-sm font-semibold text-[#111110] mb-1">
                      Which plan are you interested in? <span className="text-[#B91C1C]">*</span>
                    </label>
                    <p className="text-xs text-[#57554F] mb-3">
                      Choose a fixed-tier package or request a custom project specification.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PLAN_OPTIONS.map((plan) => {
                        const selected = formData.plan === plan.value;
                        return (
                          <button
                            key={plan.value}
                            type="button"
                            onClick={() => handleSelectPlan(plan.value)}
                            className={`text-left p-3.5 border transition-all flex flex-col justify-between ${
                              selected
                                ? 'bg-white border-[#111110] ring-1 ring-[#111110]'
                                : 'bg-white border-[#D8D4CA] hover:border-[#111110]'
                            }`}
                          >
                            <div className="flex items-baseline justify-between gap-2 w-full mb-1">
                              <span className="text-xs font-semibold text-[#111110]">
                                {plan.title}
                              </span>
                              <span className="font-mono text-xs font-semibold text-[#1D4ED8]">
                                {plan.price}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#57554F] leading-relaxed">
                              {plan.summary}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.plan && (
                      <p className="mt-1.5 text-xs text-[#B91C1C] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.plan}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 — BUSINESS */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-[#E2DFD7] pb-2.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-[#111110]">
                        Business &amp; Contact Information
                      </h3>
                      <span className="text-xs font-mono text-[#57554F]">Step 2 of 5</span>
                    </div>
                    <p className="text-xs text-[#57554F] mt-0.5">
                      Tell us who we will be collaborating with on this build.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="field-fullName" className="block text-xs font-semibold text-[#111110] mb-1">
                      Full Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                        clearFieldError('fullName');
                      }}
                      placeholder="e.g., Jordan Vance"
                      className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="field-businessName" className="block text-xs font-semibold text-[#111110] mb-1">
                      Business / Brand Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="field-businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, businessName: e.target.value }));
                        clearFieldError('businessName');
                      }}
                      placeholder="e.g., Vance Studio Inc."
                      className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.businessName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="field-email" className="block text-xs font-semibold text-[#111110] mb-1">
                        Email Address <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          clearFieldError('email');
                        }}
                        placeholder="you@company.com"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="field-instagram" className="block text-xs font-semibold text-[#111110] mb-1">
                        Country or Instagram handle <span className="text-[#57554F] font-normal">(optional)</span>
                      </label>
                      <input
                        id="field-instagram"
                        type="text"
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, instagram: e.target.value }))
                        }
                        placeholder="e.g., Canada or @yourbrand"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — PROJECT DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-[#E2DFD7] pb-2.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-[#111110]">
                        Project Scope &amp; Budget
                      </h3>
                      <span className="text-xs font-mono text-[#57554F]">Step 3 of 5</span>
                    </div>
                    <p className="text-xs text-[#57554F] mt-0.5">
                      Define your architecture, catalog size, budget, and target timeline.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="field-websiteType" className="block text-xs font-semibold text-[#111110] mb-1">
                        Website Type <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="field-websiteType"
                        type="text"
                        value={formData.websiteType}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, websiteType: e.target.value }));
                          clearFieldError('websiteType');
                        }}
                        placeholder="e.g., Retail Storefront, Service Booking, Portfolio"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                      {errors.websiteType && (
                        <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.websiteType}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="field-numberOfProducts" className="block text-xs font-semibold text-[#111110] mb-1">
                        Number of Products <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="field-numberOfProducts"
                        type="text"
                        value={formData.numberOfProducts}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, numberOfProducts: e.target.value }));
                          clearFieldError('numberOfProducts');
                        }}
                        placeholder="e.g., 0 (Service), 2 products, 20 products"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                      {errors.numberOfProducts && (
                        <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.numberOfProducts}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="field-budget" className="block text-xs font-semibold text-[#111110] mb-1">
                        Budget <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="field-budget"
                        type="text"
                        value={formData.budget}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, budget: e.target.value }));
                          clearFieldError('budget');
                        }}
                        placeholder="e.g., $70 CAD, $100 CAD, $250 CAD"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs font-mono text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                      {errors.budget && (
                        <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.budget}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="field-desiredDeadline" className="block text-xs font-semibold text-[#111110] mb-1">
                        Desired Deadline <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="field-desiredDeadline"
                        type="text"
                        value={formData.desiredDeadline}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, desiredDeadline: e.target.value }));
                          clearFieldError('desiredDeadline');
                        }}
                        placeholder="e.g., 2 weeks, Nov 15, or Flexible"
                        className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                      />
                      {errors.desiredDeadline && (
                        <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.desiredDeadline}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="field-projectDescription" className="block text-xs font-semibold text-[#111110] mb-1">
                      Project Description <span className="text-[#B91C1C]">*</span>
                    </label>
                    <textarea
                      id="field-projectDescription"
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, projectDescription: e.target.value }));
                        clearFieldError('projectDescription');
                      }}
                      placeholder="Describe what your business offers, the primary goal of the site, and any key requirements..."
                      className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-[#B91C1C] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.projectDescription}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="field-referenceWebsites" className="block text-xs font-semibold text-[#111110] mb-1">
                      Reference Websites <span className="text-[#57554F] font-normal">(optional — links whose style you admire)</span>
                    </label>
                    <input
                      id="field-referenceWebsites"
                      type="text"
                      value={formData.referenceWebsites}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, referenceWebsites: e.target.value }))
                      }
                      placeholder="e.g., aesop.com, teenageengineering.com"
                      className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 — EXISTING RESOURCES */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-[#E2DFD7] pb-2.5 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#111110]">
                        Existing Resources
                      </h3>
                      <p className="text-xs text-[#57554F] mt-0.5">
                        Do you already have the following assets ready for your project?
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleMarkRemainingNo}
                        className="text-xs font-medium text-[#1D4ED8] hover:underline whitespace-nowrap"
                      >
                        Mark remaining as No
                      </button>
                      <span className="text-xs font-mono text-[#57554F]">Step 4 of 5</span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#E2DFD7] border border-[#E2DFD7] bg-white">
                    {EXISTING_RESOURCE_KEYS.map((resourceKey) => {
                      const currentChoice = formData.existingResources[resourceKey];
                      return (
                        <div
                          key={resourceKey}
                          className="flex items-center justify-between px-3.5 py-2.5 gap-4"
                        >
                          <span className="text-xs font-medium text-[#111110]">
                            {resourceKey}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {(['Yes', 'No'] as const).map((option) => {
                              const active = currentChoice === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleResourceChoice(resourceKey, option)}
                                  className={`px-3 py-1 text-xs font-mono font-medium border transition-colors whitespace-nowrap ${
                                    active
                                      ? option === 'Yes'
                                        ? 'bg-[#111110] text-white border-[#111110]'
                                        : 'bg-[#57554F] text-white border-[#57554F]'
                                      : 'bg-[#F7F6F2] text-[#57554F] border-[#D8D4CA] hover:border-[#111110] hover:text-[#111110]'
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.existingResources && (
                    <p className="text-xs text-[#B91C1C] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.existingResources}</span>
                    </p>
                  )}
                </div>
              )}

              {/* STEP 5 — ADDITIONAL REQUIREMENTS & SUBMIT */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-[#E2DFD7] pb-2.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-[#111110]">
                        Additional Requirements &amp; Review
                      </h3>
                      <span className="text-xs font-mono text-[#57554F]">Step 5 of 5</span>
                    </div>
                    <p className="text-xs text-[#57554F] mt-0.5">
                      Share any final details before submitting your project intake.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="field-additionalNotes" className="block text-xs font-semibold text-[#111110] mb-1">
                      Anything else we should know? <span className="text-[#57554F] font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="field-additionalNotes"
                      rows={3}
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))
                      }
                      placeholder="Mention payment gateway preferences, domain registrars, language needs, or preferred schedule..."
                      className="w-full px-3 py-2 bg-white border border-[#D8D4CA] text-xs text-[#111110] placeholder:text-[#9E9A90] focus:outline-none focus:border-[#111110]"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white border border-[#E2DFD7] p-3 text-xs space-y-1.5">
                    <div className="font-mono text-[#57554F] pb-1 border-b border-[#EFECE6] flex justify-between">
                      <span>Request Summary</span>
                      <span>Status: NEW · Priority: NORMAL</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#57554F]">
                      <div>
                        <span>Service: </span>
                        <strong className="text-[#111110]">{formData.service}</strong>
                      </div>
                      <div>
                        <span>Plan: </span>
                        <strong className="text-[#111110]">{formData.plan}</strong>
                      </div>
                      <div>
                        <span>Client: </span>
                        <strong className="text-[#111110]">{formData.fullName} ({formData.businessName})</strong>
                      </div>
                      <div>
                        <span>Budget &amp; Deadline: </span>
                        <strong className="text-[#111110] font-mono">{formData.budget} · {formData.desiredDeadline}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#EFECE6] border border-[#E2DFD7] text-[11px] text-[#57554F]">
                    <strong>Note:</strong> Hosting and domain registration fees are client-managed and owned directly by you. We provide step-by-step setup assistance.
                  </div>

                  {submitError && (
                    <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Footer Navigation (Only for Client Mode, Hidden after submission) */}
        {!submittedRecord && mode === 'client' && (
          <div className="px-6 py-3.5 bg-white border-t border-[#E2DFD7] flex items-center justify-between gap-4 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-3.5 py-2 border border-[#D8D4CA] bg-white text-xs font-medium text-[#111110] hover:bg-[#F7F6F2] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 bg-[#111110] text-white text-xs font-medium hover:bg-[#272624] transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                form="goodsify-project-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#1D4ED8] text-white text-xs font-semibold tracking-wide hover:bg-[#1E40AF] transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>SENDING TO GOOGLE SHEETS...</span>
                  </>
                ) : (
                  <span>SUBMIT PROJECT REQUEST</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
