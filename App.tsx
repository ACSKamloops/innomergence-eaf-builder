
import React, { useState, useEffect } from 'react';
import { Download, RotateCcw, Settings, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { EAFBuilder } from './components/EAFBuilder';
import { OrgChart } from './components/OrgChart';
import { Tutorial, TourStep } from './components/Tutorial';
import { generateEAF } from './utils/pdfGenerator';
import { EAFFormDetails } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'eaf' | 'org'>('eaf');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Form Data State
  const [formDetails, setFormDetails] = useState<Omit<EAFFormDetails, 'amount' | 'description'>>({
    event: '',
    date: new Date().toLocaleDateString(),
    taskNumber: '',
    operationalPeriod: '',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    organization: 'Regional Emergency Program',
    authRepName: '',
    authRepLocation: 'EOC',
    phone: '',
    fax: '',
    email: ''
  });

  const [manualDescription, setManualDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'info' } | null>(null);

  // Notifications auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdateFormDetail = (key: keyof Omit<EAFFormDetails, 'amount' | 'description'>, value: string) => {
    setFormDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (manualDescription && !window.confirm("Are you sure you want to reset?")) return;
    setManualDescription("");
    setEstimatedCost(0);
    setNotification({ msg: "Form reset", type: "info" });
  };

  const handleExport = () => {
    if (!manualDescription) {
      alert("Please enter a description before exporting.");
      return;
    }
    setNotification({ msg: "Generating PDF...", type: "info" });
    
    // Compile full data
    const fullData: EAFFormDetails = {
      ...formDetails,
      description: manualDescription,
      amount: estimatedCost
    };

    setTimeout(() => {
      generateEAF(fullData);
      setNotification({ msg: "PDF Downloaded", type: "success" });
    }, 500);
  };

  const showNotify = (msg: string, type: 'success' | 'info') => {
    setNotification({ msg, type });
  };

  // --- Tutorial Steps Definition ---
  const tutorialSteps: TourStep[] = [
    {
      targetId: 'tour-start',
      title: 'Welcome to Innomergence EAF',
      content: 'This guided tool helps you draft Policy-Compliant Expenditure Authorization Forms. We combine provincial guardrails with AI to ensure your requests are accurate and approvable.',
    },
    {
      targetId: 'tour-navigation',
      title: '1. Tool Selection',
      content: 'Use this sidebar to switch between the EAF Builder and the ICS Org Chart tool. The Org Chart tool helps you build and export your command structure.',
      position: 'right'
    },
    {
      targetId: 'tour-header-settings',
      title: '2. Incident Context',
      content: 'Ensure the Task Number, Event Name, and Operational Period are correct. This information is required on the header of every Form 530 PDF.',
      position: 'right'
    },
    {
      targetId: 'tour-categories',
      title: '3. Select Category',
      content: 'Choose the type of expenditure.\n\nNote: Some categories (like "Security" or "Livestock") provide structured fill-in-the-blank Templates, while others (like "Other") use the flexible AI Smart Drafter.',
    },
    {
      targetId: 'tour-sidebar-policy',
      title: '4. Policy Guardrails',
      content: 'When a category is active, this sidebar updates with specific "Eligible" and "Ineligible" rules. The AI silently uses this data to ensure compliance.',
      position: 'right'
    },
    {
      targetId: 'tour-goals',
      title: '5. Prime the AI',
      content: 'Select the BCEMS Goals this request supports (e.g., "Protect Public Health"). The AI uses these to write the "Justification" section of your form.',
    },
    {
      targetId: 'tour-input-area',
      title: '6. AI Smart Draft',
      content: (
        <span>
          Enter rough notes here (e.g., "Need 5 guards for 3 days"). Then click <strong>AI Smart Draft</strong>.
          <br/><br/>
          The AI will rewrite your notes into formal, policy-compliant language, ensuring words like "Upgrade" are replaced with "Restore" to avoid rejection.
        </span>
      )
    },
    {
      targetId: 'tour-audit',
      title: '7. Risk Audit',
      content: 'Before exporting, click "Run Review". The AI acts as a Finance Section Chief, scanning your text for red flags, missing rates, or ineligible betterment words.',
    },
    {
      targetId: 'tour-preview',
      title: '8. Live Preview & Export',
      content: 'Your PDF is built in real-time here. When ready, click "Export Form 530" in the top right to download the official document.',
      position: 'left'
    }
  ];

  const startTutorial = () => {
    setActiveTab('eaf');
    // Ensure we have a selected category that uses MANUAL mode (like 'Other')
    // so that the AI/Goals steps (tour-goals, tour-input-area) are visible and valid.
    setSelectedCategory('Other');
    setShowTutorial(true);
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] text-navy-700 font-sans overflow-hidden relative">
      {/* Tutorial Overlay */}
      <Tutorial 
        steps={tutorialSteps} 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />

      {/* Notifications */}
      {notification && (
        <div className={clsx(
          "absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl shadow-blue-500/20 font-bold text-sm animate-in fade-in slide-in-from-top-4 backdrop-blur-md",
          notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-brand-500 text-white"
        )}>
          {notification.msg}
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        show={showSettings} 
        onClose={() => setShowSettings(false)} 
        details={formDetails} 
        onUpdate={handleUpdateFormDetail} 
      />

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        taskNumber={formDetails.taskNumber} 
        onEditHeader={() => setShowSettings(true)}
        onTaskNumberChange={(val) => handleUpdateFormDetail('taskNumber', val)}
        selectedCategory={selectedCategory}
        onStartTutorial={startTutorial}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-8 z-10">
          <div id="tour-start">
            <h2 className="text-2xl font-bold text-navy-700 tracking-tight">
              {activeTab === 'eaf' ? 'Expenditure Authorization' : 'Incident Command Structure'}
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {activeTab === 'eaf' ? 'Draft, verify, and export Form 530' : 'Build standard ICS organization charts'}
            </p>
          </div>
          {activeTab === 'eaf' && (
            <div className="flex gap-4">
              <button onClick={() => setShowSettings(true)} className="btn-secondary px-4 py-2 text-xs">
                 <Settings size={16} />
                 Header Info
              </button>
              <button onClick={handleReset} className="btn-secondary px-4 py-2 text-xs">
                <RotateCcw size={16} />
                Reset
              </button>
              <button onClick={handleExport} className="btn-primary px-5 py-2 text-xs">
                <Download size={16} />
                Export PDF
              </button>
            </div>
          )}
        </header>

        {activeTab === 'org' ? (
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="w-full h-full card-base">
              <OrgChart 
                taskNumber={formDetails.taskNumber} 
                eventName={formDetails.event} 
                operationalPeriod={formDetails.operationalPeriod}
              />
            </div>
          </div>
        ) : (
          <EAFBuilder 
            formDetails={formDetails}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            manualDescription={manualDescription}
            onUpdateDescription={setManualDescription}
            onUpdateCost={setEstimatedCost}
            onShowNotification={showNotify}
          />
        )}
      </main>
    </div>
  );
}

export default App;
