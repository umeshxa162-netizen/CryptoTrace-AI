import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { HeroOmnibar } from './components/HeroOmnibar';
import { InvestigationLoader } from './components/InvestigationLoader';
import { ActiveInvestigationView } from './components/ActiveInvestigationView';
import { DashboardCommandCenter } from './components/DashboardCommandCenter';
import { FeaturesBento } from './components/FeaturesBento';
import { IntegrationsShowcase } from './components/IntegrationsShowcase';
import { ForensicPlayground } from './components/ForensicPlayground';
import { BenchmarksSection } from './components/BenchmarksSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { IntakeWizardModal } from './components/IntakeWizardModal';
import { ReportPreviewModal } from './components/ReportPreviewModal';
import {
  ThemeMode,
  ModelOption,
  OmnibarMode,
  AttachedFile,
  BlockchainNetwork,
  CaseFile,
  IntakeFormData
} from './types';
import { mockAvailableModels, mockCaseQueue } from './data/mockInvestigationData';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeSection, setActiveSection] = useState('investigate');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [intakeWizardOpen, setIntakeWizardOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const [activeInvestigationTarget, setActiveInvestigationTarget] = useState<string | null>(null);
  const [isInvestigationLoading, setIsInvestigationLoading] = useState(false);

  const availableModels: ModelOption[] = mockAvailableModels;
  const [selectedModel, setSelectedModel] = useState<ModelOption>(availableModels[0]);

  // Sync theme with HTML root tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.className =
        'bg-zinc-950 text-zinc-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200';
    } else {
      root.classList.remove('dark');
      document.body.className =
        'bg-zinc-50 text-zinc-900 antialiased selection:bg-cyan-500/30 selection:text-cyan-900';
    }
  }, [theme]);

  // Scroll Spy for Navbar Active Section Tracking
  useEffect(() => {
    const sectionIds = ['investigate', 'dashboard', 'capabilities', 'integrations', 'playground', 'benchmarks', 'faq'];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePromptSubmit = (
    prompt: string,
    mode: OmnibarMode,
    isThinking: boolean,
    attachments: AttachedFile[],
    chain: BlockchainNetwork
  ) => {
    const target = prompt.trim() || '0x7A3c9e9b384f912c0192837461abcef0192891F2';
    setActiveInvestigationTarget(target);
    setIsInvestigationLoading(true);

    // Scroll smoothly to loader
    setTimeout(() => {
      const loaderElem = document.getElementById('investigation-loader-anchor');
      if (loaderElem) {
        loaderElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleLoaderComplete = () => {
    setIsInvestigationLoading(false);
    setTimeout(() => {
      const resultElem = document.getElementById('active-investigation-result');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  const handleQuickStart = (sampleWallet: string, mode: OmnibarMode, chain: BlockchainNetwork) => {
    handlePromptSubmit(sampleWallet, mode, true, [], chain);
  };

  const handleSelectCase = (caseItem: CaseFile) => {
    handlePromptSubmit(caseItem.suspectAddress, 'trace', true, [], caseItem.chain);
  };

  const handleIntakeSubmit = (formData: IntakeFormData) => {
    handlePromptSubmit(formData.suspectAddress, 'trace', true, formData.attachments, formData.blockchain);
  };

  const handleClearSession = () => {
    setActiveInvestigationTarget(null);
    setIsInvestigationLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500">
      {/* Background Interactive Particle Canvas */}
      <ParticleBackground theme={theme} />

      {/* Glassmorphic Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenIntakeWizard={() => setIntakeWizardOpen(true)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        availableModels={availableModels}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* 1. Hero & Signature Smart Forensic Omnibar */}
        <HeroOmnibar
          theme={theme}
          selectedModel={selectedModel}
          onSubmitPrompt={handlePromptSubmit}
          onQuickStart={handleQuickStart}
          onOpenIntakeWizard={() => setIntakeWizardOpen(true)}
        />

        {/* Anchor for scroll */}
        <div id="investigation-loader-anchor" />

        {/* 2. Live 7-Stage Investigation Loader */}
        <AnimatePresence>
          {isInvestigationLoading && activeInvestigationTarget && (
            <InvestigationLoader
              theme={theme}
              targetAddress={activeInvestigationTarget}
              onComplete={handleLoaderComplete}
            />
          )}
        </AnimatePresence>

        {/* 3. Active Case & Forensic Result View (When analysis completes) */}
        <AnimatePresence>
          {activeInvestigationTarget && !isInvestigationLoading && (
            <ActiveInvestigationView
              theme={theme}
              targetAddress={activeInvestigationTarget}
              onClearSession={handleClearSession}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          )}
        </AnimatePresence>

        {/* 4. Investigation Command Center Dashboard */}
        <DashboardCommandCenter
          theme={theme}
          onSelectCase={handleSelectCase}
          onStartNewCase={() => setIntakeWizardOpen(true)}
        />

        {/* 5. Core Capabilities Bento Grid (7-Stage Pipeline & De-Obfuscation) */}
        <FeaturesBento
          theme={theme}
          onExploreFeature={(feature) => {
            handleQuickStart('0x7A3c9e9b384f912c0192837461abcef0192891F2', 'trace', 'Ethereum');
          }}
        />

        {/* 6. Unified Threat Intel & SIEM Integrations */}
        <IntegrationsShowcase
          theme={theme}
          onSelectIntegrationPrompt={(appName, samplePrompt) => {
            handleQuickStart('0x7A3c9e9b384f912c0192837461abcef0192891F2', 'forensics', 'Ethereum');
          }}
        />

        {/* 7. Interactive Forensics Parameter Sandbox */}
        <ForensicPlayground theme={theme} />

        {/* 8. Forensic Telemetry & Performance Benchmarks */}
        <BenchmarksSection theme={theme} />

        {/* 9. Forensic Methodology & Legal FAQ */}
        <FAQSection theme={theme} />
      </main>

      {/* 10. High-Craft Footer */}
      <Footer theme={theme} onNavigate={handleNavigate} />

      {/* 11. Global Command Palette Modal (⌘K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        onSelectModel={setSelectedModel}
        availableModels={availableModels}
        onTriggerInvestigation={handleQuickStart}
        onOpenIntakeWizard={() => setIntakeWizardOpen(true)}
        onOpenReportModal={() => setReportModalOpen(true)}
      />

      {/* 12. Case Intake Wizard Modal */}
      <IntakeWizardModal
        isOpen={intakeWizardOpen}
        onClose={() => setIntakeWizardOpen(false)}
        theme={theme}
        onSubmitCase={handleIntakeSubmit}
      />

      {/* 13. Intelligence Dossier Preview Modal */}
      <ReportPreviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
