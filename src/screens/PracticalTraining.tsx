import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Play, 
  Barcode, 
  Boxes, 
  Truck, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Layers,
  Smartphone
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, SkillCategory, Enrollment } from '../lib/types';

export interface PracticalActivity {
  id: string;
  roleId: string;
  activityNumber: number;
  title: string;
  category: string;
  estimatedMinutes: number;
  description: string;
  iconType: 'barcode' | 'boxes' | 'truck' | 'creditCard' | 'zap' | 'shield';
  terminalType: string;
  targetSku: string;
  simulationSteps: string[];
}

const ROLE_PRACTICAL_ACTIVITIES: Record<string, PracticalActivity[]> = {
  'logistics-supply-chain': [
    {
      id: 'log-prac-1',
      roleId: 'warehouse-associate',
      activityNumber: 1,
      title: 'Inbound / Receiving',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: ['Power on RF scanner and calibrate barcode sensor.', 'Scan incoming shipment QR and verify PO match.', 'Confirm piece-count and log seal integrity.']
    },
    {
      id: 'log-prac-3a',
      roleId: 'warehouse-associate',
      activityNumber: 2,
      title: 'Batch Wave Picking',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: ['Retrieve active pick wave on handheld terminal.', 'Audit items, expiration dates, and barcode tags.', 'Place in shipping carton and apply tamper seal.']
    },
    {
      id: 'log-prac-2b',
      roleId: 'warehouse-associate',
      activityNumber: 3,
      title: 'Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: ['Read directed route on RF screen (Aisle 04, Bay B).', 'Scan shelf location barcode to verify coordinates.', 'Place stock and confirm balance update.']
    },
    {
      id: 'log-prac-4b',
      roleId: 'warehouse-associate',
      activityNumber: 4,
      title: 'Outbound',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: ['Apply 5-layer stretch wrap around pallet load.', 'Affix shipping labels and hazardous placards.', 'Inspect carrier trailer and sign digital gate pass.']
    },
    {
      id: 'log-prac-5',
      roleId: 'warehouse-associate',
      activityNumber: 5,
      title: 'Return',
      category: 'Returns Processing',
      estimatedMinutes: 10,
      description: 'Process customer returns.',
      iconType: 'truck',
      terminalType: 'RETURNS v1.0',
      targetSku: 'RMA-999 / BAY-RETURNS',
      simulationSteps: ['Inspect item.', 'Log return.', 'Putaway.']
    }
  ],
  'retail-operations': [
    {
      id: 'log-prac-1',
      roleId: 'retail-store-associate',
      activityNumber: 1,
      title: 'Inbound / Receiving',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: ['Power on RF scanner and calibrate barcode sensor.', 'Scan incoming shipment QR and verify PO match.', 'Confirm piece-count and log seal integrity.']
    },
    {
      id: 'log-prac-3a',
      roleId: 'retail-store-associate',
      activityNumber: 2,
      title: 'Batch Wave Picking',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: ['Retrieve active pick wave on handheld terminal.', 'Audit items, expiration dates, and barcode tags.', 'Place in shipping carton and apply tamper seal.']
    },
    {
      id: 'log-prac-2b',
      roleId: 'retail-store-associate',
      activityNumber: 3,
      title: 'Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: ['Read directed route on RF screen (Aisle 04, Bay B).', 'Scan shelf location barcode to verify coordinates.', 'Place stock and confirm balance update.']
    },
    {
      id: 'log-prac-4b',
      roleId: 'retail-store-associate',
      activityNumber: 4,
      title: 'Outbound',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: ['Apply 5-layer stretch wrap around pallet load.', 'Affix shipping labels and hazardous placards.', 'Inspect carrier trailer and sign digital gate pass.']
    },
    {
      id: 'log-prac-5',
      roleId: 'retail-store-associate',
      activityNumber: 5,
      title: 'Return',
      category: 'Returns Processing',
      estimatedMinutes: 10,
      description: 'Process customer returns.',
      iconType: 'truck',
      terminalType: 'RETURNS v1.0',
      targetSku: 'RMA-999 / BAY-RETURNS',
      simulationSteps: ['Inspect item.', 'Log return.', 'Putaway.']
    }
  ],
  'quick-commerce': [
    {
      id: 'log-prac-1',
      roleId: 'dark-store-associate',
      activityNumber: 1,
      title: 'Inbound / Receiving',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: ['Power on RF scanner and calibrate barcode sensor.', 'Scan incoming shipment QR and verify PO match.', 'Confirm piece-count and log seal integrity.']
    },
    {
      id: 'log-prac-3a',
      roleId: 'dark-store-associate',
      activityNumber: 2,
      title: 'Batch Wave Picking',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: ['Retrieve active pick wave on handheld terminal.', 'Audit items, expiration dates, and barcode tags.', 'Place in shipping carton and apply tamper seal.']
    },
    {
      id: 'log-prac-2b',
      roleId: 'dark-store-associate',
      activityNumber: 3,
      title: 'Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: ['Read directed route on RF screen (Aisle 04, Bay B).', 'Scan shelf location barcode to verify coordinates.', 'Place stock and confirm balance update.']
    },
    {
      id: 'log-prac-4b',
      roleId: 'dark-store-associate',
      activityNumber: 4,
      title: 'Outbound',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: ['Apply 5-layer stretch wrap around pallet load.', 'Affix shipping labels and hazardous placards.', 'Inspect carrier trailer and sign digital gate pass.']
    },
    {
      id: 'log-prac-5',
      roleId: 'dark-store-associate',
      activityNumber: 5,
      title: 'Return',
      category: 'Returns Processing',
      estimatedMinutes: 10,
      description: 'Process customer returns.',
      iconType: 'truck',
      terminalType: 'RETURNS v1.0',
      targetSku: 'RMA-999 / BAY-RETURNS',
      simulationSteps: ['Inspect item.', 'Log return.', 'Putaway.']
    }
  ],
  'hospitality': [
    {
      id: 'log-prac-1',
      roleId: 'fb-service-associate',
      activityNumber: 1,
      title: 'Inbound / Receiving',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: ['Power on RF scanner and calibrate barcode sensor.', 'Scan incoming shipment QR and verify PO match.', 'Confirm piece-count and log seal integrity.']
    },
    {
      id: 'log-prac-3a',
      roleId: 'fb-service-associate',
      activityNumber: 2,
      title: 'Batch Wave Picking',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: ['Retrieve active pick wave on handheld terminal.', 'Audit items, expiration dates, and barcode tags.', 'Place in shipping carton and apply tamper seal.']
    },
    {
      id: 'log-prac-2b',
      roleId: 'fb-service-associate',
      activityNumber: 3,
      title: 'Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: ['Read directed route on RF screen (Aisle 04, Bay B).', 'Scan shelf location barcode to verify coordinates.', 'Place stock and confirm balance update.']
    },
    {
      id: 'log-prac-4b',
      roleId: 'fb-service-associate',
      activityNumber: 4,
      title: 'Outbound',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: ['Apply 5-layer stretch wrap around pallet load.', 'Affix shipping labels and hazardous placards.', 'Inspect carrier trailer and sign digital gate pass.']
    },
    {
      id: 'log-prac-5',
      roleId: 'fb-service-associate',
      activityNumber: 5,
      title: 'Return',
      category: 'Returns Processing',
      estimatedMinutes: 10,
      description: 'Process customer returns.',
      iconType: 'truck',
      terminalType: 'RETURNS v1.0',
      targetSku: 'RMA-999 / BAY-RETURNS',
      simulationSteps: ['Inspect item.', 'Log return.', 'Putaway.']
    }
  ],
  'facility-management': [
    {
      id: 'log-prac-1',
      roleId: 'facility-operations-officer',
      activityNumber: 1,
      title: 'Inbound / Receiving',
      category: 'Inbound Receiving',
      estimatedMinutes: 10,
      description: 'Scan master airway bills and log incoming pallets into the warehouse receiving ledger.',
      iconType: 'barcode',
      terminalType: 'RF TERMINAL v4.2',
      targetSku: 'AWB-DL-882910 / PALLET-01',
      simulationSteps: ['Power on RF scanner and calibrate barcode sensor.', 'Scan incoming shipment QR and verify PO match.', 'Confirm piece-count and log seal integrity.']
    },
    {
      id: 'log-prac-3a',
      roleId: 'facility-operations-officer',
      activityNumber: 2,
      title: 'Batch Wave Picking',
      category: 'Picking',
      estimatedMinutes: 10,
      description: 'Pick multi-line orders, verify tamper seals, and pack standard shipping cartons.',
      iconType: 'boxes',
      terminalType: 'PICK & PACK v3.1',
      targetSku: 'TOTE-TK-5502 / ORDER-09',
      simulationSteps: ['Retrieve active pick wave on handheld terminal.', 'Audit items, expiration dates, and barcode tags.', 'Place in shipping carton and apply tamper seal.']
    },
    {
      id: 'log-prac-2b',
      roleId: 'facility-operations-officer',
      activityNumber: 3,
      title: 'Putaway',
      category: 'Putaway',
      estimatedMinutes: 12,
      description: 'Route incoming stock to designated racking locations and lock bin coordinates.',
      iconType: 'boxes',
      terminalType: 'PUTAWAY ENGINE v2.8',
      targetSku: 'LOC-BIN-04-B / SKU-99401',
      simulationSteps: ['Read directed route on RF screen (Aisle 04, Bay B).', 'Scan shelf location barcode to verify coordinates.', 'Place stock and confirm balance update.']
    },
    {
      id: 'log-prac-4b',
      roleId: 'facility-operations-officer',
      activityNumber: 4,
      title: 'Outbound',
      category: 'Outbound Dispatch',
      estimatedMinutes: 10,
      description: 'Secure pallet stretch wrap, verify shipping labels, and sign digital dispatch pass.',
      iconType: 'truck',
      terminalType: 'DISPATCH GATE v1.9',
      targetSku: 'MANIFEST-TRK-7740 / BAY-03',
      simulationSteps: ['Apply 5-layer stretch wrap around pallet load.', 'Affix shipping labels and hazardous placards.', 'Inspect carrier trailer and sign digital gate pass.']
    },
    {
      id: 'log-prac-5',
      roleId: 'facility-operations-officer',
      activityNumber: 5,
      title: 'Return',
      category: 'Returns Processing',
      estimatedMinutes: 10,
      description: 'Process customer returns.',
      iconType: 'truck',
      terminalType: 'RETURNS v1.0',
      targetSku: 'RMA-999 / BAY-RETURNS',
      simulationSteps: ['Inspect item.', 'Log return.', 'Putaway.']
    }
  ]
};

function getActivitiesForRole(roleId: string, skillId: string): PracticalActivity[] {
  if (ROLE_PRACTICAL_ACTIVITIES[skillId]) {
    return ROLE_PRACTICAL_ACTIVITIES[skillId];
  }
  return ROLE_PRACTICAL_ACTIVITIES['logistics-supply-chain'];
}

export function PracticalTrainingScreen() {
  const { currentRoute, navigate } = useRouter();
  const allEnrollments: Enrollment[] = enrollmentStore.getEnrollments();
  
  const enrolledRoles = allEnrollments.map(enr => {
    const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
    const skill = SKILL_CATEGORIES.find(s => s.id === (role.skillId || enr.skillId)) || SKILL_CATEGORIES[0];
    return { enrollment: enr, role, skill };
  });

  const initialRoleId = currentRoute.params?.roleId || (enrolledRoles[0]?.role.id || JOB_ROLES[0].id);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId);

  // Active track information
  const activeTrack = enrolledRoles.find(t => t.role.id === selectedRoleId) || enrolledRoles[0] || {
    enrollment: {
      id: `enr-${Date.now()}`,
      roleId: JOB_ROLES[0].id,
      skillId: SKILL_CATEGORIES[0].id,
      plan: 'pro',
      enrollmentDate: new Date().toISOString().split('T')[0],
      completedModules: [],
      currentModuleId: 'mod-1',
      quizScores: {},
      isCompleted: false
    } as Enrollment,
    role: JOB_ROLES[0],
    skill: SKILL_CATEGORIES[0]
  };

  const role = activeTrack.role;
  const skill = activeTrack.skill;
  const enrollment = activeTrack.enrollment;

  const practicalActivities = getActivitiesForRole(role.id, skill.id);
  const completedActivities = enrollment.completedPracticalActivities || [];

  // If activityId is in router params or selected by user, we show the ACTUAL SIMULATION screen
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(() => {
    if (currentRoute.params?.activityId) return currentRoute.params.activityId;
    if (currentRoute.params?.activityIndex !== undefined) {
      const idx = Number(currentRoute.params.activityIndex);
      return practicalActivities[idx]?.id || practicalActivities[0]?.id || null;
    }
    return null;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeActivity = practicalActivities.find(a => a.id === activeSimulationId) || practicalActivities[0];
  const activeActivityIndex = practicalActivities.findIndex(a => a.id === activeActivity?.id);
  const isCurrentCompleted = activeSimulationId ? completedActivities.includes(activeSimulationId) : false;

  const handleStepComplete = () => {
    if (!activeActivity) return;
    if (currentStepIndex < activeActivity.simulationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      enrollmentStore.completePracticalActivity(enrollment.id, activeActivity.id);
    }
  };

  const handleNextSimulation = () => {
    if (activeActivityIndex < practicalActivities.length - 1) {
      const nextAct = practicalActivities[activeActivityIndex + 1];
      setActiveSimulationId(nextAct.id);
      setCurrentStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Return to cards overview
      setActiveSimulationId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetStep = () => {
    setCurrentStepIndex(0);
  };

  const ACTIVITY_TRAINING_MAP: Record<string, { url: string; title: string }> = {
    'log-prac-1': { url: '/Practice/inbound-training.html', title: 'Inbound Receiving Desktop WMS Simulator' },
    'log-prac-3a': { url: '/Practice/picking-training.html', title: 'Batch Wave Picking Desktop WMS Simulator' },
    'log-prac-2b': { url: '/Practice/inventory-training.html', title: 'Inventory Putaway Desktop WMS Simulator' },
    'log-prac-4b': { url: '/Practice/outbound-training.html', title: 'Outbound Packing & Dispatch Desktop WMS Simulator' },
    'log-prac-5': { url: '/Practice/return-training.html', title: 'Return QC & Reverse Logistics Desktop WMS Simulator' },
    // Resources
    'res-1': { url: '/Practice/item-barcode-master-sheet.html', title: 'Item Barcode Master Sheet' },
    'res-2': { url: '/Practice/location-barcode-sheet.html', title: 'Location Barcode Sheet' },
    'res-3': { url: '/Practice/practice-po-sheets.html', title: 'Practice PO Sheets' },
    'res-4': { url: '/Practice/task-reference-sheets.html', title: 'Task Reference Sheets' },
  };

  const getTrainingLink = (activityId: string) => {
    return ACTIVITY_TRAINING_MAP[activityId] || null;
  };

  const LEARNER_RESOURCES = [
    { id: 'res-3', title: 'PO & ASN Sheets', iconType: 'boxes' },
    { id: 'res-1', title: 'Item Barcode Sheet', iconType: 'barcode' },
    { id: 'res-2', title: 'Location Barcode Sheet', iconType: 'barcode' },
    { id: 'res-4', title: 'Task Reference Sheets', iconType: 'creditCard' },
  ] as const;

  const getLearnerResourceIcon = (type: string) => {
    switch (type) {
      case 'barcode': return <Barcode className="w-5 h-5" />;
      case 'boxes': return <Boxes className="w-5 h-5" />;
      case 'creditCard': return <CreditCard className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'barcode': return <div className="text-3xl">📦</div>; // Warehouse receiving/carton
      case 'boxes': return <div className="text-3xl">🛒</div>; // Picking cart
      case 'truck': return <div className="text-3xl">🚛</div>; // Dispatch truck
      case 'creditCard': return <div className="text-3xl">📋</div>; // Checklist
      case 'zap': return <div className="text-3xl">⚡</div>; // Efficiency/Speed
      default: return <div className="text-3xl">🏗️</div>; // Racks/Warehouse
    }
  };

  // -------------------------------------------------------------
  // VIEW 2: ACTUAL SIMULATION SCREEN (WHEN A CARD IS CLICKED)
  // -------------------------------------------------------------
  if (activeSimulationId && activeActivity) {
    return (
      <div className="w-full bg-[#0B192C]/[0.02] min-h-screen pb-20 font-sans text-slate-900">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-18 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            
            <button 
              onClick={() => {
                setActiveSimulationId(null);
                setCurrentStepIndex(0);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Simulation Lab</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {role.title} •
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Simulation 0{activeActivity.activityNumber}
              </span>
            </div>

          </div>
        </header>

        {/* Actual Simulator Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
          
          {/* Title & Info Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                {activeActivity.category}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>~{activeActivity.estimatedMinutes} Mins</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
              {activeActivity.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeActivity.description}
            </p>

            {getTrainingLink(activeActivity.id) && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    const link = getTrainingLink(activeActivity.id)!;
                    navigate('training-viewer', { url: link.url, title: link.title });
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer border border-blue-200"
                >
                  <span>🖥️ Launch Virtual Desktop Simulator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Interactive Simulation Sandbox Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 text-white p-6 sm:p-7 shadow-lg space-y-6">
            
            {/* Console Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">{activeActivity.terminalType}</span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                STEP {currentStepIndex + 1} OF {activeActivity.simulationSteps.length}
              </div>
            </div>

            {/* Main Interactive Display */}
            <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
              
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operating Standard Protocol (SOP):
              </div>

              <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {activeActivity.simulationSteps[currentStepIndex]}
              </div>

              {/* Target Indicator */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400">TARGET SKU / REGISTRY</div>
                <div className="text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
                  {activeActivity.targetSku}
                </div>
              </div>

            </div>

            {/* Step Progress Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Simulation Progress</span>
                <span>
                  {Math.round(((currentStepIndex + 1) / activeActivity.simulationSteps.length) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activeActivity.simulationSteps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      sIdx < currentStepIndex || (sIdx === currentStepIndex && isCurrentCompleted)
                        ? 'bg-emerald-400'
                        : sIdx === currentStepIndex
                        ? 'bg-blue-500'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Execution Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <button
                onClick={handleResetStep}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Simulation</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                {currentStepIndex === activeActivity.simulationSteps.length - 1 && isCurrentCompleted ? (
                  <button
                    onClick={handleNextSimulation}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{activeActivityIndex < practicalActivities.length - 1 ? 'Next Simulation' : 'Back to Simulation Lab'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStepComplete}
                    id="execute-sim-step-btn"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>
                      {currentStepIndex === activeActivity.simulationSteps.length - 1
                        ? 'Complete & Verify Simulation'
                        : 'Execute Step →'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Success Banner when Completed */}
          {isCurrentCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Simulation Successfully Completed & Logged
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Your workplace activity has been recorded in your learning profile.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSimulationId(null);
                  setCurrentStepIndex(0);
                }}
                className="shrink-0 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                All Simulations
              </button>
            </div>
          )}

        </main>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: SIMULATION LAB ALL CARDS (CLICKABLE LIST OF SIMULATIONS)
  // -------------------------------------------------------------
  return (
    <div className="w-full bg-[#F5F5F7] min-h-screen pb-20 font-sans text-slate-900">
      
      {/* 1. CLEAN MINIMAL HEADER */}
      <header className="bg-[#1D1D1F] border-b border-zinc-800 sticky top-16 sm:top-18 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                navigate('role-detail', { roleId: role.id });
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Simulation Lab
              </h1>
              <span className="text-xs text-zinc-400">
                {role.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full">
              {completedActivities.length} of {practicalActivities.length} Completed
            </span>
          </div>

        </div>
      </header>

      {/* 2. MAIN SIMULATION CARDS CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Track Switcher (If multiple enrollments exist) */}
        {enrolledRoles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {enrolledRoles.map((track) => {
              const isSelected = track.role.id === selectedRoleId;
              const acts = getActivitiesForRole(track.role.id, track.skill.id);
              const doneCount = track.enrollment.completedPracticalActivities?.length || 0;

              return (
                <button
                  key={track.role.id}
                  onClick={() => {
                    setSelectedRoleId(track.role.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-[#0B192C] text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{track.role.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {doneCount}/{acts.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* CLEAN CLICKABLE SIMULATION CARDS GRID */}
        <div className="grid grid-cols-2 gap-4">
          {practicalActivities.map((act, idx) => {
            const isCompleted = completedActivities.includes(act.id);
            const cardColors = [
              'border-blue-200',
              'border-emerald-200',
              'border-orange-200',
              'border-purple-200',
              'border-teal-200'
            ];
            const borderColor = cardColors[idx % cardColors.length];

            return (
              <div
                key={act.id}
                id={`sim-card-${act.id}`}
                className={`bg-white rounded-[24px] p-5 border ${borderColor} shadow-sm transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:shadow-lg hover:border-slate-300 hover:scale-105`}
                onClick={() => {
                  const link = getTrainingLink(act.id);
                  if (link) {
                    if (enrollment?.id) {
                      enrollmentStore.completePracticalActivity(enrollment.id, act.id);
                    }
                    navigate('training-viewer', { url: link.url, title: link.title, returnTo: 'practical-training' });
                  } else {
                    setActiveSimulationId(act.id);
                    setCurrentStepIndex(0);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {/* Header: Number & Progress */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                    0{act.activityNumber}
                  </span>
                  <div className="w-9 h-9 rounded-full border-2 border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {isCompleted ? '100%' : '0%'}
                  </div>
                </div>

                {/* Main: Icon & Title */}
                <div className="flex flex-col items-center justify-center flex-grow py-4">
                  <div className="text-8xl mb-4">
                    {getIcon(act.iconType)}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight text-center">
                    {act.title === 'Inbound / Receiving' ? 'Inbound' : 
                     act.title === 'Batch Wave Picking' ? 'Picking' : 
                     act.title === 'Putaway' ? 'Inventory' : act.title}
                  </h3>
                </div>

                {/* Footer: Start Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = getTrainingLink(act.id);
                    if (link) {
                      if (enrollment?.id) {
                        enrollmentStore.completePracticalActivity(enrollment.id, act.id);
                      }
                      navigate('training-viewer', { url: link.url, title: link.title, returnTo: 'practical-training' });
                    } else {
                      setActiveSimulationId(act.id);
                      setCurrentStepIndex(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isCompleted ? 'Practice Again' : 'Start Simulation'} →
                </button>
              </div>
            );
          })}
        </div>

        {/* Learner Resources Section */}
        <div className="pt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Learner Resources</h2>
          <div className="space-y-4">
            {LEARNER_RESOURCES.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  const link = getTrainingLink(res.id);
                  if (link) {
                    navigate('training-viewer', { url: link.url, title: link.title });
                  }
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md hover:border-slate-400 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#0B192C] group-hover:text-white transition-colors">
                    {getLearnerResourceIcon(res.iconType)}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{res.title}</span>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg group-hover:bg-blue-100 cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
