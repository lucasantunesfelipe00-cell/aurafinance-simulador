'use client';

import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FinancingInputs } from '@/types/financing';
import {
  calculateFinancing,
  compareFinancing,
  DEFAULT_FINANCING_INPUTS,
  formatBRL,
} from '@/lib/financing-calculator';
import { Header } from '@/components/Header';
import { SimulatorCarousel } from '@/components/SimulatorCarousel';
import { ResultsSummary } from '@/components/ResultsSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import { AmortizationTable } from '@/components/AmortizationTable';
import { ComparatorModal } from '@/components/ComparatorModal';
import { SpecsViewerModal } from '@/components/SpecsViewerModal';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { SideDrawer } from '@/components/SideDrawer';
import { HelpModal } from '@/components/HelpModal';
import { FaqModal } from '@/components/FaqModal';
import { TermsModal } from '@/components/TermsModal';
import { SavedScenariosView } from '@/components/SavedScenariosView';
import { ScenarioComparatorModal } from '@/components/ScenarioComparatorModal';
import { RentVsBuyModal } from '@/components/RentVsBuyModal';
import { IncomeAssessmentModal } from '@/components/IncomeAssessmentModal';
import { AcquisitionCostsModal } from '@/components/AcquisitionCostsModal';
import { Footer } from '@/components/Footer';
import { ScenarioItem } from '@/lib/scenario-comparator';
import { SavedScenario, getSavedScenarios } from '@/lib/saved-scenarios';
import { parseShareUrl } from '@/lib/share-url';
import { SimulationLoader } from '@/components/SimulationLoader';
import { HeroTitle } from '@/components/HeroTitle';
import { BankSplashFlow } from '@/components/BankSplashFlow';
import { BackgroundLightTrail } from '@/components/BackgroundLightTrail';
import { vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';
import { playTypeSound } from '@/lib/sound';
import {
  LineChart,
  Table,
  Layers,
  Zap,
  Share2,
} from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'onboarding' | 'simulator'>('onboarding');
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConfigVisible, setIsConfigVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isScenarioComparatorOpen, setIsScenarioComparatorOpen] = useState(false);
  const [isRentVsBuyOpen, setIsRentVsBuyOpen] = useState(false);
  const [isIncomeAssessmentOpen, setIsIncomeAssessmentOpen] = useState(false);
  const [isAcquisitionCostsOpen, setIsAcquisitionCostsOpen] = useState(false);
  const [comparatorScenarioA, setComparatorScenarioA] = useState<ScenarioItem | null>(null);
  const [comparatorScenarioB, setComparatorScenarioB] = useState<ScenarioItem | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSavedScenariosActive, setIsSavedScenariosActive] = useState(false);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [savedScenariosList, setSavedScenariosList] = useState<SavedScenario[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [helpInitialTab, setHelpInitialTab] = useState<'manual' | 'glossary' | 'tips'>('manual');
  const [helpInitialCategory, setHelpInitialCategory] = useState<string>('Todos');
  const [helpInitialSearch, setHelpInitialSearch] = useState<string>('');
  const [sharedBannerInfo, setSharedBannerInfo] = useState<{ name?: string } | null>(null);
  const [saveNoticeLabel, setSaveNoticeLabel] = useState<string>('Salvar');

  React.useEffect(() => {
    setSavedScenariosList(getSavedScenarios());

    // Detecta se a página foi aberta com parâmetros de simulação compartilhada na URL
    if (typeof window !== 'undefined' && window.location.search) {
      const parsed = parseShareUrl(window.location.search);
      if (parsed) {
        setInputs(parsed.inputs);
        setCalculatedInputs(parsed.inputs);
        setHasCalculated(true);
        setActiveTab('summary');
        setViewMode('simulator');
        setSharedBannerInfo({ name: parsed.scenarioName });
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      }
    }
  }, []);

  const handleScenarioSaved = () => {
    const list = getSavedScenarios();
    setSavedScenariosList(list);
    setSaveNoticeLabel('Cenário Salvo');
    setShowSaveNotice(true);
    setTimeout(() => {
      setShowSaveNotice(false);
    }, 8000);
  };

  // Se o usuário clica em qualquer lugar da tela sem ser no botão ou aviso, o aviso desaparece até a próxima simulação
  React.useEffect(() => {
    if (!showSaveNotice) return;

    const handleGlobalClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Se clicou no aviso ou no botão de cenários, mantém a ação normalmente
      if (target.closest('[data-save-notice]') || target.closest('[data-scenarios-button]')) {
        return;
      }

      // Se clicou em qualquer outro lugar da tela, oculta o aviso
      setShowSaveNotice(false);
    };

    // Pequeno delay para evitar disparos imediatos do clique que gerou o evento
    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick, { capture: true });
      window.addEventListener('touchstart', handleGlobalClick, { capture: true });
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('touchstart', handleGlobalClick, { capture: true });
    };
  }, [showSaveNotice]);

  const handleSelectScenario = (newInputs: FinancingInputs) => {
    setInputs(newInputs);
    setCalculatedInputs(newInputs);
    setHasCalculated(true);
    setActiveTab('summary');
    setIsSimulating(false);
    setIsSavedScenariosActive(false);
    setIsConfigVisible(true);
    setSavedScenariosList(getSavedScenarios());
  };

  const handleOpenSavedScenarios = () => {
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    setIsScenarioComparatorOpen(false);
    setIsComparatorOpen(false);
    setIsRentVsBuyOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsAcquisitionCostsOpen(false);
    setIsSavedScenariosActive(true);
    setShowSaveNotice(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenScenarioComparator = (scA: ScenarioItem, scB: ScenarioItem) => {
    setComparatorScenarioA(scA);
    setComparatorScenarioB(scB);
    setIsScenarioComparatorOpen(true);
    setIsSavedScenariosActive(false);
    setIsRentVsBuyOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsAcquisitionCostsOpen(false);
    setIsComparatorOpen(false);
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenComparator = () => {
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    setIsSavedScenariosActive(false);
    setIsScenarioComparatorOpen(false);
    setIsRentVsBuyOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsAcquisitionCostsOpen(false);
    setIsComparatorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRentVsBuy = () => {
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    setIsSavedScenariosActive(false);
    setIsScenarioComparatorOpen(false);
    setIsComparatorOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsAcquisitionCostsOpen(false);
    setIsRentVsBuyOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenIncomeAssessment = () => {
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    setIsSavedScenariosActive(false);
    setIsScenarioComparatorOpen(false);
    setIsComparatorOpen(false);
    setIsRentVsBuyOpen(false);
    setIsAcquisitionCostsOpen(false);
    setIsIncomeAssessmentOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAcquisitionCosts = () => {
    setIsHelpOpen(false);
    setIsFaqOpen(false);
    setIsTermsOpen(false);
    setIsExtraAmortizationOpen(false);
    setIsSavedScenariosActive(false);
    setIsScenarioComparatorOpen(false);
    setIsComparatorOpen(false);
    setIsRentVsBuyOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsAcquisitionCostsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  const [isExtraAmortizationOpen, setIsExtraAmortizationOpen] = useState(false);

  // Recálculo realizado apenas ao confirmar a simulação
  const result = useMemo(() => calculateFinancing(calculatedInputs), [calculatedInputs]);
  const comparison = useMemo(() => compareFinancing(calculatedInputs), [calculatedInputs]);

  // Resultado de base sem aportes adicionais, para cálculo da economia
  const baselineResult = useMemo(() => {
    return calculateFinancing({
      ...calculatedInputs,
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    });
  }, [calculatedInputs]);

  // Função disparada ao clicar em SIMULAR (com animação de 3 segundos)
  const handleSimulate = () => {
    setIsSimulating(true);
    setHasCalculated(false);
    setIsConfigVisible(false);
    setActiveTab('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCalculatedInputs(inputs);
      setHasCalculated(true);
      setActiveTab('summary');
      setIsSimulating(false);
      setShowSaveNotice(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 3000);
  };

  const handleReset = () => {
    setInputs(DEFAULT_FINANCING_INPUTS);
    setCalculatedInputs(DEFAULT_FINANCING_INPUTS);
    setCurrentStep(1);
    setHasCalculated(false);
    setActiveTab('summary');
    setIsSimulating(false);
    setIsSavedScenariosActive(false);
    setIsScenarioComparatorOpen(false);
    setIsComparatorOpen(false);
    setIsIncomeAssessmentOpen(false);
    setIsRentVsBuyOpen(false);
    setIsAcquisitionCostsOpen(false);
    setComparatorScenarioA(null);
    setComparatorScenarioB(null);
    setShowSaveNotice(false);
    setIsConfigVisible(true);
  };

  const isHelpActive = isHelpOpen;
  const isFaqActive = isFaqOpen;
  const isTermsActive = isTermsOpen;
  const isSavedScenariosViewActive = isSavedScenariosActive && !isHelpOpen && !isFaqOpen && !isTermsOpen && !isScenarioComparatorOpen && !isIncomeAssessmentOpen && !isAcquisitionCostsOpen;
  const isAmortizationActive = isExtraAmortizationOpen && !isSavedScenariosActive && !isHelpOpen && !isFaqOpen && !isTermsOpen && !isScenarioComparatorOpen && !isIncomeAssessmentOpen && !isAcquisitionCostsOpen;
  const isConfigActive = (isConfigVisible || !hasCalculated) && !isExtraAmortizationOpen && !isSavedScenariosActive && !isHelpOpen && !isFaqOpen && !isTermsOpen && !isComparatorOpen && !isScenarioComparatorOpen && !isRentVsBuyOpen && !isIncomeAssessmentOpen && !isAcquisitionCostsOpen;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      {/* Background ambiente 100% estático sem efeitos de surgir/movimento */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] iridescent-hero-bg pointer-events-none -z-10 opacity-30" />

      <AnimatePresence mode="wait">
        {viewMode === 'onboarding' ? (
          <motion.div
            key="onboarding-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
            className="w-full h-full min-h-screen bg-black"
          >
            <BankSplashFlow onStartSimulator={() => setViewMode('simulator')} />
          </motion.div>
        ) : (
          <motion.div
            key="simulator-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full min-h-screen relative"
          >
            {/* Sidebar Fixa Lateral para Desktop (Com estado expandido e recolhido em mini logo) */}
            <DesktopSidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onOpenHelp={() => {
                setHelpInitialTab('manual');
                setHelpInitialCategory('Todos');
                setHelpInitialSearch('');
                setIsHelpOpen(true);
                setIsFaqOpen(false);
                setIsTermsOpen(false);
                setIsExtraAmortizationOpen(false);
                setIsSavedScenariosActive(false);
                setIsScenarioComparatorOpen(false);
                setIsComparatorOpen(false);
                setIsRentVsBuyOpen(false);
                setIsIncomeAssessmentOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenFaq={() => {
                setIsFaqOpen(true);
                setIsHelpOpen(false);
                setIsTermsOpen(false);
                setIsExtraAmortizationOpen(false);
                setIsSavedScenariosActive(false);
                setIsScenarioComparatorOpen(false);
                setIsComparatorOpen(false);
                setIsRentVsBuyOpen(false);
                setIsIncomeAssessmentOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTerms={() => {
                setIsTermsOpen(true);
                setIsHelpOpen(false);
                setIsFaqOpen(false);
                setIsExtraAmortizationOpen(false);
                setIsSavedScenariosActive(false);
                setIsScenarioComparatorOpen(false);
                setIsComparatorOpen(false);
                setIsRentVsBuyOpen(false);
                setIsIncomeAssessmentOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSimulator={() => {
                setIsHelpOpen(false);
                setIsFaqOpen(false);
                setIsTermsOpen(false);
                setIsExtraAmortizationOpen(false);
                setIsSavedScenariosActive(false);
                setIsScenarioComparatorOpen(false);
                setIsComparatorOpen(false);
                setIsRentVsBuyOpen(false);
                setIsIncomeAssessmentOpen(false);
                setIsConfigVisible(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAmortization={() => {
                setIsHelpOpen(false);
                setIsFaqOpen(false);
                setIsTermsOpen(false);
                setIsSavedScenariosActive(false);
                setIsScenarioComparatorOpen(false);
                setIsComparatorOpen(false);
                setIsRentVsBuyOpen(false);
                setIsIncomeAssessmentOpen(false);
                setIsAcquisitionCostsOpen(false);
                setIsExtraAmortizationOpen(true);
                setHasCalculated(true);
                setTimeout(() => {
                  const el = document.getElementById('amortizacao-acelerada-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              onOpenComparator={handleOpenComparator}
              onOpenAcquisitionCosts={handleOpenAcquisitionCosts}
              onOpenSavedScenarios={handleOpenSavedScenarios}
              onOpenRentVsBuy={handleOpenRentVsBuy}
              onOpenIncomeAssessment={handleOpenIncomeAssessment}
              savedScenariosCount={savedScenariosList.length}
              isConfigActive={isConfigActive}
              isAmortizationActive={isAmortizationActive}
              isComparatorActive={isComparatorOpen}
              isAcquisitionCostsActive={isAcquisitionCostsOpen}
              isSavedScenariosActive={isSavedScenariosViewActive}
              isRentVsBuyActive={isRentVsBuyOpen}
              isIncomeAssessmentActive={isIncomeAssessmentOpen}
              showSaveNotice={showSaveNotice}
              saveNoticeLabel={saveNoticeLabel}
              isHelpActive={isHelpActive}
              isFaqActive={isFaqActive}
              isTermsActive={isTermsActive}
            />
            {/* Imagem de Fundo das Ondas Douradas (Escurecida 15%) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
              {/* Versão Mobile (Vertical) — Escurecida 15% */}
              <img
                src="/images/bank-welcome-bg.jpg"
                alt="Fundo Institucional Mobile"
                className="sm:hidden w-full h-full object-cover object-center opacity-45 pointer-events-none"
              />

              {/* Versão Desktop (Horizontal) — Escurecida 15% */}
              <img
                src="/images/bank-welcome-bg-horizontal.jpg"
                alt="Fundo Institucional Desktop"
                className="hidden sm:block w-full h-full object-cover object-center sm:object-[center_35%] opacity-30 pointer-events-none"
              />

              {/* Camada de Escurecimento Geral 15% */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              {/* Brilho de Luz Ambiente Suave */}
              <div
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(194, 162, 91, 0.22) 0%, rgba(164, 126, 53, 0.08) 50%, transparent 80%)',
                  mixBlendMode: 'color-dodge',
                }}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Feixe de Luz Dourado: Suave e Bem Mais Devagar (22s) */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{
                  x: ['100%', '-100%'],
                  opacity: [0, 0.45, 0.45, 0],
                }}
                transition={{
                  duration: 22.0,
                  repeat: Infinity,
                  repeatDelay: 0,
                  ease: 'linear',
                }}
                style={{
                  background:
                    'linear-gradient(115deg, transparent 15%, rgba(164, 126, 53, 0.22) 38%, rgba(194, 162, 91, 0.48) 48%, rgba(223, 192, 123, 0.6) 50%, rgba(194, 162, 91, 0.48) 52%, rgba(164, 126, 53, 0.22) 62%, transparent 85%)',
                  mixBlendMode: 'color-dodge',
                }}
                className="absolute inset-[-50%] pointer-events-none z-10"
              />

              {/* Feixe de Luz Dourado Interativo que Segue o Rastro do Mouse */}
              <BackgroundLightTrail />

              {/* Sombreamento de vinheta equilibrado */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
            </div>

            {/* Conteúdo da Aplicação em Camada Superior z-10 com offset dinâmico da Sidebar no Desktop */}
            <div className={`relative z-10 flex-1 flex flex-col w-full min-h-screen transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:pl-[78px]' : 'lg:pl-[260px]'
            }`}>
              {/* Header Superior (66px Height, 1078px max-width) */}
              <Header
                onReset={handleReset}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setHasCalculated(true);
                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                onOpenSimulator={() => {
                  setIsHelpOpen(false);
                  setIsFaqOpen(false);
                  setIsTermsOpen(false);
                  setIsExtraAmortizationOpen(false);
                  setIsSavedScenariosActive(false);
                  setIsScenarioComparatorOpen(false);
                  setIsComparatorOpen(false);
                  setIsRentVsBuyOpen(false);
                  setIsIncomeAssessmentOpen(false);
                  setIsAcquisitionCostsOpen(false);
                  setIsConfigVisible(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAmortization={() => {
                  setIsHelpOpen(false);
                  setIsFaqOpen(false);
                  setIsTermsOpen(false);
                  setIsSavedScenariosActive(false);
                  setIsScenarioComparatorOpen(false);
                  setIsComparatorOpen(false);
                  setIsRentVsBuyOpen(false);
                  setIsIncomeAssessmentOpen(false);
                  setIsAcquisitionCostsOpen(false);
                  setIsExtraAmortizationOpen(true);
                  setHasCalculated(true);
                  setTimeout(() => {
                    const el = document.getElementById('amortizacao-acelerada-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                onOpenComparator={handleOpenComparator}
                onOpenAcquisitionCosts={handleOpenAcquisitionCosts}
                onOpenHelp={() => {
                  setHelpInitialTab('manual');
                  setHelpInitialCategory('Todos');
                  setHelpInitialSearch('');
                  setIsHelpOpen(true);
                  setIsFaqOpen(false);
                  setIsTermsOpen(false);
                  setIsExtraAmortizationOpen(false);
                  setIsSavedScenariosActive(false);
                  setIsScenarioComparatorOpen(false);
                  setIsComparatorOpen(false);
                  setIsRentVsBuyOpen(false);
                  setIsIncomeAssessmentOpen(false);
                  setIsAcquisitionCostsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenFaq={() => {
                  setIsFaqOpen(true);
                  setIsHelpOpen(false);
                  setIsTermsOpen(false);
                  setIsExtraAmortizationOpen(false);
                  setIsSavedScenariosActive(false);
                  setIsScenarioComparatorOpen(false);
                  setIsComparatorOpen(false);
                  setIsRentVsBuyOpen(false);
                  setIsIncomeAssessmentOpen(false);
                  setIsAcquisitionCostsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenTerms={() => {
                  setIsTermsOpen(true);
                  setIsHelpOpen(false);
                  setIsFaqOpen(false);
                  setIsExtraAmortizationOpen(false);
                  setIsSavedScenariosActive(false);
                  setIsScenarioComparatorOpen(false);
                  setIsComparatorOpen(false);
                  setIsRentVsBuyOpen(false);
                  setIsIncomeAssessmentOpen(false);
                  setIsAcquisitionCostsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSavedScenarios={handleOpenSavedScenarios}
                onOpenRentVsBuy={handleOpenRentVsBuy}
                onOpenIncomeAssessment={handleOpenIncomeAssessment}
                savedScenariosCount={savedScenariosList.length}
                isConfigActive={isConfigActive}
                isAmortizationActive={isAmortizationActive}
                isComparatorActive={isComparatorOpen}
                isAcquisitionCostsActive={isAcquisitionCostsOpen}
                isSavedScenariosActive={isSavedScenariosViewActive}
                isRentVsBuyActive={isRentVsBuyOpen}
                isIncomeAssessmentActive={isIncomeAssessmentOpen}
                showSaveNotice={showSaveNotice}
                saveNoticeLabel={saveNoticeLabel}
                isHelpActive={isHelpActive}
                isFaqActive={isFaqActive}
                isTermsActive={isTermsActive}
                activeTab={activeTab}
              />

      {/* Conteúdo Principal (Max-width 1488px - ampliado em +15%) */}
      <main className="flex-1 max-w-[1488px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">

        {/* Banner Notificador de Simulação Aberta por Link Compartilhado */}
        <AnimatePresence>
          {sharedBannerInfo && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              className="p-3.5 sm:p-4 bg-gradient-to-r from-[#a47e35]/20 via-black to-[#a47e35]/20 border border-gold-400/60 rounded-none text-white text-xs sm:text-sm flex items-center justify-between shadow-[0_0_20px_rgba(194,162,91,0.25)] font-sans"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 bg-gold-400/20 border border-gold-400/40 text-gold-400 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gold-400 truncate">
                    Simulação carregada via link compartilhado!
                  </p>
                  <p className="text-[11px] sm:text-xs text-neutral-300 truncate">
                    {sharedBannerInfo.name
                      ? `Cenário: "${sharedBannerInfo.name}" • Parâmetros e cálculos prontos.`
                      : 'Todos os valores e taxas foram preenchidos e calculados automaticamente.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSharedBannerInfo(null)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition-colors ml-3 shrink-0 cursor-pointer"
              >
                OK
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isHelpOpen && (
          <HelpModal
            isOpen={isHelpOpen}
            initialTab={helpInitialTab}
            initialCategory={helpInitialCategory}
            initialSearch={helpInitialSearch}
            onClose={() => {
              setIsHelpOpen(false);
              setIsConfigVisible(true);
            }}
          />
        )}

        {isFaqOpen && (
          <FaqModal
            isOpen={isFaqOpen}
            onClose={() => {
              setIsFaqOpen(false);
              setIsConfigVisible(true);
            }}
          />
        )}

        {isTermsOpen && (
          <TermsModal
            isOpen={isTermsOpen}
            onClose={() => {
              setIsTermsOpen(false);
              setIsConfigVisible(true);
            }}
          />
        )}

        {isSavedScenariosViewActive && (
          <SavedScenariosView
            currentInputs={inputs}
            onSelectScenario={handleSelectScenario}
            onScenarioSaved={() => {
              setSavedScenariosList(getSavedScenarios());
            }}
            onOpenScenarioComparator={handleOpenScenarioComparator}
          />
        )}

        {isScenarioComparatorOpen && comparatorScenarioA && comparatorScenarioB && (
          <ScenarioComparatorModal
            isOpen={isScenarioComparatorOpen}
            onClose={() => {
              setIsScenarioComparatorOpen(false);
              setIsSavedScenariosActive(true);
            }}
            scenarioA={comparatorScenarioA}
            scenarioB={comparatorScenarioB}
            availableScenarios={savedScenariosList}
            currentInputs={inputs}
            onSelectScenarioA={setComparatorScenarioA}
            onSelectScenarioB={setComparatorScenarioB}
            onApplyScenario={handleSelectScenario}
          />
        )}

        {isComparatorOpen && (
          <ComparatorModal
            isOpen={isComparatorOpen}
            onClose={() => {
              setIsComparatorOpen(false);
              setIsConfigVisible(true);
            }}
            comparison={comparison}
          />
        )}

        {isRentVsBuyOpen && (
          <RentVsBuyModal
            isOpen={isRentVsBuyOpen}
            onClose={() => {
              setIsRentVsBuyOpen(false);
              setIsConfigVisible(true);
            }}
            currentInputs={calculatedInputs}
          />
        )}

        {isIncomeAssessmentOpen && (
          <IncomeAssessmentModal
            isOpen={isIncomeAssessmentOpen}
            onClose={() => {
              setIsIncomeAssessmentOpen(false);
              setIsConfigVisible(true);
            }}
            firstInstallment={result.firstInstallment}
            propertyValue={calculatedInputs.propertyValue}
          />
        )}

        {isAcquisitionCostsOpen && (
          <AcquisitionCostsModal
            isOpen={isAcquisitionCostsOpen}
            onClose={() => {
              setIsAcquisitionCostsOpen(false);
              setIsConfigVisible(true);
            }}
            propertyValue={calculatedInputs.propertyValue}
          />
        )}

        {!isHelpOpen && !isFaqOpen && !isTermsOpen && !isSavedScenariosViewActive && !isScenarioComparatorOpen && !isComparatorOpen && !isRentVsBuyOpen && !isIncomeAssessmentOpen && !isAcquisitionCostsOpen && (
          <>
            {/* HERO SECTION — Carrossel de Configuração da Simulação */}
            <div className="text-center max-w-[1060px] mx-auto flex flex-col items-center w-full">
          <AnimatePresence initial={false}>
            {isConfigVisible && (
              <motion.div
                key="simulator-carousel-wrapper"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                className="w-full overflow-hidden"
              >
                <SimulatorCarousel
                  inputs={inputs}
                  onChange={setInputs}
                  onReset={handleReset}
                  onSimulate={handleSimulate}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  onOpenHelp={() => {
                    setHelpInitialTab('glossary');
                    setHelpInitialCategory('Sistema');
                    setHelpInitialSearch('');
                    setIsHelpOpen(true);
                    setIsFaqOpen(false);
                    setIsTermsOpen(false);
                    setIsExtraAmortizationOpen(false);
                    setIsSavedScenariosActive(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animação de Carregamento de 3 Segundos ao Clicar em SIMULAR */}
        {isSimulating && (
          <div className="max-w-[1060px] mx-auto">
            <SimulationLoader durationSeconds={3} />
          </div>
        )}

        {/* Painel de Resultados Exibido Abaixo ao Clicar em SIMULAR */}
        {hasCalculated && !isSimulating && (
          <div ref={resultsRef} className="space-y-8 animate-fadeIn max-w-[1060px] mx-auto scroll-mt-24">

            {/* Seletor de Abas da Análise (Ordem: Resumo e KPIs, Tabela mês a mês, Gráfico) */}
            <div className="relative flex items-center justify-between p-1 bg-black border border-white/20 rounded-[75px]">
              {/* Aba 1: Resumo e KPIs */}
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'summary' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'summary' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Resumo</span>
                  <span className="hidden sm:inline">Resumo &amp; KPIs</span>
                </span>
              </button>

              {/* Aba 2: Tabela */}
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'table' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'table' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Tabela</span>
                  <span className="hidden sm:inline">Tabela Mês a Mês</span>
                </span>
              </button>

              {/* Aba 3: Gráfico */}
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'chart' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'chart' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <LineChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Gráfico</span>
              </button>
            </div>

            {/* Conteúdo Exclusivo da Aba Selecionada (Fade & Micro-Elevação) */}
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="tab-summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ResultsSummary
                    result={result}
                    comparison={comparison}
                    onOpenComparison={handleOpenComparator}
                    onOpenRentVsBuy={handleOpenRentVsBuy}
                    onOpenIncomeAssessment={handleOpenIncomeAssessment}
                    onOpenAcquisitionCosts={handleOpenAcquisitionCosts}
                    inputs={calculatedInputs}
                    baselineResult={baselineResult}
                    onInputsChange={(updated) => {
                      setInputs(updated);
                      setCalculatedInputs(updated);
                    }}
                    isExtraAmortizationOpen={isExtraAmortizationOpen}
                    onToggleExtraAmortization={() => {
                      setIsExtraAmortizationOpen(!isExtraAmortizationOpen);
                      playTypeSound();
                    }}
                    onScenarioSaved={handleScenarioSaved}
                  />
                </motion.div>
              )}

              {activeTab === 'chart' && (
                <motion.div
                  key="tab-chart"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AmortizationChart result={result} />
                </motion.div>
              )}

              {activeTab === 'table' && (
                <motion.div
                  key="tab-table"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AmortizationTable result={result} inputs={calculatedInputs} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
          </>
        )}

      </main>

      {/* Rodapé Institucional com Grid de Bancos Parceiros e Selo Bacen */}
      <Footer
        onOpenTerms={() => {
          setIsTermsOpen(true);
          setIsHelpOpen(false);
          setIsFaqOpen(false);
          setIsExtraAmortizationOpen(false);
          setIsSavedScenariosActive(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFaq={() => {
          setIsFaqOpen(true);
          setIsHelpOpen(false);
          setIsTermsOpen(false);
          setIsExtraAmortizationOpen(false);
          setIsSavedScenariosActive(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHelp={() => {
          setHelpInitialTab('manual');
          setHelpInitialCategory('Todos');
          setHelpInitialSearch('');
          setIsHelpOpen(true);
          setIsFaqOpen(false);
          setIsTermsOpen(false);
          setIsExtraAmortizationOpen(false);
          setIsSavedScenariosActive(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSimulator={() => {
          setIsHelpOpen(false);
          setIsFaqOpen(false);
          setIsTermsOpen(false);
          setIsExtraAmortizationOpen(false);
          setIsSavedScenariosActive(false);
          setIsConfigVisible(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modais Integrados */}
      <SpecsViewerModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

    </div>
  );
}
