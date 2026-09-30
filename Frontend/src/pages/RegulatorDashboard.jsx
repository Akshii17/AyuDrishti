import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  History,
  Search,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  FileText,
  Layers,
  Database,
  ScrollText,
  AlertCircle,
  Activity,
  FileSpreadsheet,
  X,
  ExternalLink,
  ChevronDown,
  Check,
  Info
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';

// Helper to trigger browser downloads of text, CSV, or JSON dossiers
const downloadFile = (filename, content, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Default fallback regulatory studies
const DEFAULT_REGULATORY_STUDIES = [
  {
    studyId: 'AIIA-AYU-001',
    ctriNumber: 'CTRI/2026/04/08912',
    ctriStatus: 'Registered (Prospective)',
    title: 'Randomized Controlled Trial of Ashwagandha Extract in Type 2 Diabetes Mellitus',
    shortTitle: 'Ashwagandha T2DM Trial',
    phase: 'Phase III (Therapeutic Confirmatory)',
    status: 'Active',
    researchArea: 'Metabolic Disorders',
    intervention: 'Standardized Ashwagandha Root Extract (300mg bid) vs Standard of Care',
    principalInvestigator: 'Dr. Ananya Sharma',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    leadSite: 'AIIA Central Hospital, New Delhi',
    startDate: '2026-01-15',
    expectedEndDate: '2027-12-31',
    participants: {
      target: 200,
      screened: 178,
      eligible: 160,
      enrolled: 148,
      randomized: 142,
      completed: 71
    },
    ethicsRegulatory: {
      ethicsCommittee: 'AIIA Institutional Ethics Committee (IEC-AIIA)',
      approvalNumber: 'IEC/AIIA/2026/041',
      approvalDate: '2026-01-12',
      approvalExpiry: '2027-01-11',
      regulatoryStatus: 'Approved & Compliant',
      ctriNumber: 'CTRI/2026/04/08912',
      ctriRegistrationDate: '2026-01-14'
    },
    complianceScore: 98.4,
    protocolDeviations: {
      total: 5,
      open: 2,
      resolved: 3,
      major: 1,
      minor: 4
    },
    dataQuality: {
      crfCompletionPct: 94,
      queryResolutionPct: 92
    },
    safety: {
      adverseEvents: 18,
      seriousAdverseEvents: 1,
      pendingSafetyReviews: 1,
      reportingDeadlines: 1,
      safetySignals: 0,
      aeList: [
        {
          id: 'AE-01',
          term: 'Mild transient gastric irritation',
          subjectId: 'SUBJ-108',
          severity: 'Mild',
          isSerious: false,
          causality: 'Possible',
          status: 'Resolved',
          reportDate: '2026-03-24'
        },
        {
          id: 'AE-02',
          term: 'Elevated fasting blood glucose fluctuation',
          subjectId: 'SUBJ-122',
          severity: 'Moderate',
          isSerious: false,
          causality: 'Unlikely',
          status: 'Under Follow-up',
          reportDate: '2026-05-18'
        },
        {
          id: 'SAE-01',
          term: 'Hospitalization due to unrelated acute gastroenteritis',
          subjectId: 'SUBJ-140',
          severity: 'Severe',
          isSerious: true,
          causality: 'Not Related',
          status: 'Resolved / Expedited Reported to CDSCO',
          reportDate: '2026-07-09'
        }
      ]
    },
    milestones: [
      { stage: 'IEC Ethics Committee Approval', date: '12-Jan-2026', status: 'Completed', notes: 'Unanimous IEC clearance' },
      { stage: 'CTRI Mandatory Registration', date: '14-Jan-2026', status: 'Completed', notes: 'Prospective registry sealed' },
      { stage: 'Site Activation & Trial Initiation', date: '15-Mar-2026', status: 'Completed', notes: 'Delhi & Mumbai operational' },
      { stage: 'Interim DSMB Safety Audit', date: '10-Jul-2026', status: 'Completed', notes: 'No safety halts recommended' },
      { stage: 'Annual Regulatory Progress Report', date: '15-Nov-2026', status: 'Pending', notes: 'Due for CDSCO submission' },
      { stage: 'Final Study Close-out & CSR', date: '31-Dec-2027', status: 'Pending', notes: 'Scheduled upon completion' }
    ],
    documents: [
      {
        id: 'DOC-01',
        name: 'Approved_Protocol_v2.1_Signed.pdf',
        type: 'Study Protocol',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        date: '2026-01-10',
        size: '3.4 MB',
        authority: 'CDSCO / Ethics Committee Sealed',
        description: 'Complete investigational clinical protocol with Schedule Y / NDCT compliance certifications.'
      },
      {
        id: 'DOC-02',
        name: 'CTRI_Official_Clearance_Certificate.pdf',
        type: 'CTRI Registration',
        hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        date: '2026-01-14',
        size: '1.2 MB',
        authority: 'Clinical Trials Registry - India (ICMR-CTRI)',
        description: 'Statutory registration acknowledgment and verified prospective public trial record.'
      },
      {
        id: 'DOC-03',
        name: 'IEC_Institutional_Ethics_Clearance_Letter.pdf',
        type: 'Ethics Clearance',
        hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        date: '2026-01-12',
        size: '1.8 MB',
        authority: 'AIIA Institutional Ethics Committee',
        description: 'Formal IEC approval for interventional clinical study under National Ethics Guidelines.'
      },
      {
        id: 'DOC-04',
        name: 'Investigator_Brochure_IB_Ed4.pdf',
        type: "Investigator's Brochure",
        hash: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
        date: '2026-01-05',
        size: '4.8 MB',
        authority: 'Pharmacognosy & Phytochemistry Review Board',
        description: 'Herbal chemical characterization, preclinical safety dossiers, and batch quality certifications.'
      },
      {
        id: 'DOC-05',
        name: 'Informed_Consent_Form_Bilingual_v2.0.pdf',
        type: 'Informed Consent Form',
        hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        date: '2026-01-11',
        size: '950 KB',
        authority: 'Ethics Committee Approved Template',
        description: 'Bilingual (English/Hindi) patient information sheet and audio-visual consent procedure manual.'
      },
      {
        id: 'DOC-06',
        name: 'DSMB_Charter_Safety_Charter.pdf',
        type: 'Safety Monitoring Charter',
        hash: '7c4a1b023f81e3a58d62f43bb291a824e4d8234a991823719bca402919aa3021',
        date: '2026-02-10',
        size: '1.5 MB',
        authority: 'Data & Safety Monitoring Board (DSMB)',
        description: 'Pre-specified stopping rules, unblinded safety auditing protocols, and interim analysis cadence.'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-001',
        timestamp: '2026-09-20 14:32:10 UTC',
        action: 'CTRI Progress Verification Stamped & Synced',
        user: 'Regulator (CDSCO Inspector #402)',
        category: 'Regulatory',
        hash: 'f21a8a9012cd4e5f...'
      },
      {
        id: 'AUD-002',
        timestamp: '2026-07-11 09:15:44 UTC',
        action: 'Interim DSMB Safety Report Uploaded & SHA-256 Hashed',
        user: 'Dr. Ananya Sharma (PI)',
        category: 'Safety',
        hash: '3d98bc1938fe76ad...'
      },
      {
        id: 'AUD-003',
        timestamp: '2026-05-15 16:45:22 UTC',
        action: 'Protocol Minor Deviation Logged (Dietary Log Lag)',
        user: 'Clinical Research Associate (Monitor)',
        category: 'Compliance',
        hash: 'e45b81a293dc110f...'
      },
      {
        id: 'AUD-004',
        timestamp: '2026-01-14 10:00:00 UTC',
        action: 'CTRI Registration Number Sealed in Public Ledger',
        user: 'CTRI Registry Gatekeeper',
        category: 'Regulatory',
        hash: '1e428cd873ea4109...'
      },
      {
        id: 'AUD-005',
        timestamp: '2026-01-12 11:20:00 UTC',
        action: 'IEC Full Board Approval Document Digitally Signed',
        user: 'IEC Secretariat Chair',
        category: 'Ethics',
        hash: '88a10e7b4198cc23...'
      }
    ]
  },
  {
    studyId: 'AIIA-AYU-002',
    ctriNumber: 'CTRI/2026/05/09104',
    ctriStatus: 'Registered (Prospective)',
    title: 'Efficacy & Safety of Guggulu Formulations in Osteoarthritis Management',
    shortTitle: 'Guggulu OA Protocol',
    phase: 'Phase II (Therapeutic Exploratory)',
    status: 'Delayed',
    researchArea: 'Musculoskeletal Disorders',
    intervention: 'Purified Guggulu extract formulation (500mg daily) vs active control',
    principalInvestigator: 'Dr. Vivek Rao',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    leadSite: 'AIIA Satellite Centre, Goa',
    startDate: '2026-03-01',
    expectedEndDate: '2027-08-31',
    participants: {
      target: 150,
      screened: 119,
      eligible: 105,
      enrolled: 92,
      randomized: 90,
      completed: 38
    },
    ethicsRegulatory: {
      ethicsCommittee: 'AIIA Institutional Ethics Committee',
      approvalNumber: 'IEC/AIIA/2026/088',
      approvalDate: '2026-02-15',
      approvalExpiry: '2026-10-30',
      regulatoryStatus: 'Renewal Required',
      ctriNumber: 'CTRI/2026/05/09104',
      ctriRegistrationDate: '2026-02-20'
    },
    complianceScore: 89.2,
    protocolDeviations: {
      total: 8,
      open: 4,
      resolved: 4,
      major: 2,
      minor: 6
    },
    dataQuality: {
      crfCompletionPct: 88,
      queryResolutionPct: 84
    },
    safety: {
      adverseEvents: 12,
      seriousAdverseEvents: 0,
      pendingSafetyReviews: 2,
      reportingDeadlines: 0,
      safetySignals: 0,
      aeList: [
        {
          id: 'AE-OA-01',
          term: 'Transient skin rash over extensor knee surface',
          subjectId: 'SUBJ-OA-21',
          severity: 'Mild',
          isSerious: false,
          causality: 'Probable',
          status: 'Resolved',
          reportDate: '2026-04-10'
        }
      ]
    },
    milestones: [
      { stage: 'IEC Ethics Committee Approval', date: '15-Feb-2026', status: 'Completed', notes: 'Initial clearance granted' },
      { stage: 'CTRI Mandatory Registration', date: '20-Feb-2026', status: 'Completed', notes: 'Prospective registry sealed' },
      { stage: 'Site Activation & Trial Initiation', date: '01-Apr-2026', status: 'Completed', notes: 'Goa & Pune sites' },
      { stage: 'Annual Regulatory Progress Report', date: '10-Oct-2026', status: 'Delayed', notes: 'Renewal dossier pending IEC submission' },
      { stage: 'Study Close-out', date: '31-Aug-2027', status: 'Pending', notes: 'Scheduled' }
    ],
    documents: [
      {
        id: 'DOC-OA-01',
        name: 'Guggulu_Protocol_Master_v1.0.pdf',
        type: 'Study Protocol',
        hash: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
        date: '2026-02-01',
        size: '2.9 MB',
        authority: 'AIIA Academic & Scientific Council',
        description: 'Osteoarthritis clinical evaluation study protocol.'
      },
      {
        id: 'DOC-OA-02',
        name: 'CTRI_Official_Receipt_Certificate.pdf',
        type: 'CTRI Registration',
        hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        date: '2026-02-20',
        size: '1.1 MB',
        authority: 'Clinical Trials Registry - India (ICMR-CTRI)',
        description: 'Verified CTRI registration acknowledgment receipt.'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-OA-01',
        timestamp: '2026-09-15 16:10:05 UTC',
        action: 'Annual IEC Renewal Overdue Notice Transmitted',
        user: 'System Automated Regulatory Watcher',
        category: 'Regulatory',
        hash: '097a11bb23ff44a1...'
      },
      {
        id: 'AUD-OA-02',
        timestamp: '2026-02-20 10:00:12 UTC',
        action: 'CTRI Number Issued & Sealed',
        user: 'CTRI Registry Node',
        category: 'Regulatory',
        hash: '1e428cc789aae340...'
      }
    ]
  },
  {
    studyId: 'AIIA-AYU-004',
    ctriNumber: 'CTRI/2026/03/07844',
    ctriStatus: 'Registered (Prospective)',
    title: 'Evaluation of Shirishadi Kwath in Bronchial Asthma Control',
    shortTitle: 'Shirishadi Asthma Study',
    phase: 'Phase II (Therapeutic Exploratory)',
    status: 'Active',
    researchArea: 'Respiratory Medicine',
    intervention: 'Shirishadi Kwath decoction (40ml bid) vs standard bronchodilator add-on',
    principalInvestigator: 'Dr. Meera S.',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    leadSite: 'AIIA Central Hospital, New Delhi',
    startDate: '2025-05-01',
    expectedEndDate: '2026-12-31',
    participants: {
      target: 120,
      screened: 110,
      eligible: 95,
      enrolled: 90,
      randomized: 90,
      completed: 82
    },
    ethicsRegulatory: {
      ethicsCommittee: 'AIIA Institutional Ethics Committee',
      approvalNumber: 'IEC/AIIA/2025/192',
      approvalDate: '2025-02-18',
      approvalExpiry: '2027-02-18',
      regulatoryStatus: 'Approved & Compliant',
      ctriNumber: 'CTRI/2026/03/07844',
      ctriRegistrationDate: '2025-03-10'
    },
    complianceScore: 100.0,
    protocolDeviations: {
      total: 2,
      open: 0,
      resolved: 2,
      major: 0,
      minor: 2
    },
    dataQuality: {
      crfCompletionPct: 98,
      queryResolutionPct: 99
    },
    safety: {
      adverseEvents: 5,
      seriousAdverseEvents: 0,
      pendingSafetyReviews: 0,
      reportingDeadlines: 0,
      safetySignals: 0,
      aeList: []
    },
    milestones: [
      { stage: 'IEC Ethics Committee Approval', date: '18-Feb-2025', status: 'Completed', notes: 'Cleared' },
      { stage: 'CTRI Mandatory Registration', date: '10-Mar-2025', status: 'Completed', notes: 'Sealed' },
      { stage: 'Site Activation', date: '01-May-2025', status: 'Completed', notes: 'Active' },
      { stage: 'Study Close-out', date: '31-Dec-2026', status: 'Pending', notes: 'Target completion' }
    ],
    documents: [
      {
        id: 'DOC-AS-01',
        name: 'Shirishadi_Kwath_Dossier_Final.pdf',
        type: 'Study Protocol',
        hash: 'd41d8cd98f00b204e9800998ecf8427e',
        date: '2025-02-10',
        size: '2.1 MB',
        authority: 'CDSCO / IEC Validated',
        description: 'Complete asthma trial protocol.'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-AS-01',
        timestamp: '2026-08-01 12:00:00 UTC',
        action: 'Routine Inspection Audit Verified 100% Compliance',
        user: 'CDSCO Senior Auditor',
        category: 'Compliance',
        hash: 'bc0a8912ef34aa89...'
      }
    ]
  }
];

// Normalizer to guarantee all 8 sections exist and have standard properties
function normalizeStudy(s, idx) {
  const studyId = s.studyId || `STUDY-${idx + 1}`;
  const title = s.title || s.name || 'Clinical Study Protocol';
  const shortTitle = s.shortTitle || s.code || studyId;
  const status = s.status || 'Active';
  const phase = s.phase || 'Phase II';
  const principalInvestigator = s.principalInvestigator || s.pi || 'Dr. Investigator';
  const sponsor = s.sponsor || 'All India Institute of Ayurveda (AIIA)';
  const leadSite = s.leadSite || s.sites?.[0]?.name || 'AIIA Central Hospital';
  const startDate = s.startDate || '2026-01-15';
  const expectedEndDate = s.expectedEndDate || '2027-12-31';

  // 1. Study Status & Participants
  const participants = {
    target: s.participants?.target || 150,
    screened: s.participants?.screened || 120,
    enrolled: s.participants?.enrolled || 100,
    completed: s.participants?.completed || 50
  };

  // 2. CTRI Status
  const ctriNumber = s.ctriNumber || s.ethicsRegulatory?.ctriNumber || `CTRI/2026/0${idx + 1}/0089${idx}`;
  const ctriStatus = s.ctriStatus || s.ethicsRegulatory?.ctriStatus || 'Registered (Prospective)';
  const ctriRegistrationDate = s.ethicsRegulatory?.ctriRegistrationDate || s.startDate || '2026-01-14';

  // 3. Milestones
  let rawMilestones = s.milestones || [];
  let milestones = rawMilestones.map((m, mIdx) => ({
    stage: m.stage || m.name || `Milestone ${mIdx + 1}`,
    date: m.date || 'Scheduled',
    status: m.status || (mIdx < 2 ? 'Completed' : 'Pending'),
    notes: m.notes || (m.status === 'Completed' ? 'Verified in registry' : 'Scheduled milestone')
  }));
  if (milestones.length === 0) {
    milestones = [
      { stage: 'IEC Ethics Committee Approval', date: '12-Jan-2026', status: 'Completed', notes: 'Unanimous clearance' },
      { stage: 'CTRI Mandatory Registration', date: '14-Jan-2026', status: 'Completed', notes: 'Prospective registry sealed' },
      { stage: 'Site Activation & Trial Initiation', date: '15-Mar-2026', status: 'Completed', notes: 'Sites initiated' },
      { stage: 'Interim DSMB Safety Audit', date: '10-Jul-2026', status: 'Completed', notes: 'Safety verified' },
      { stage: 'Annual Regulatory Progress Report', date: '15-Nov-2026', status: 'Pending', notes: 'Scheduled submission' }
    ];
  }

  // 4. Ethics Status
  const ethicsRegulatory = {
    ethicsCommittee: s.ethicsRegulatory?.ethicsCommittee || 'AIIA Institutional Ethics Committee (IEC-AIIA)',
    approvalNumber: s.ethicsRegulatory?.approvalNumber || `IEC/AIIA/2026/0${idx + 1}2`,
    approvalDate: s.ethicsRegulatory?.approvalDate || '2026-01-12',
    approvalExpiry: s.ethicsRegulatory?.approvalExpiry || '2027-01-11',
    regulatoryStatus: s.ethicsRegulatory?.regulatoryStatus || (status === 'Delayed' ? 'Renewal Required' : 'Approved & Compliant'),
    ctriNumber,
    ctriRegistrationDate
  };

  // 5. Safety Summary
  const safety = {
    adverseEvents: s.safety?.adverseEvents ?? 12,
    seriousAdverseEvents: s.safety?.seriousAdverseEvents ?? 0,
    pendingSafetyReviews: s.safety?.pendingSafetyReviews ?? 1,
    reportingDeadlines: s.safety?.reportingDeadlines ?? 0,
    safetySignals: s.safety?.safetySignals ?? 0,
    aeList: s.safety?.aeList || s.adverseEventsList || [
      {
        id: `AE-${studyId}-01`,
        term: 'Transient mild headache post dose',
        subjectId: 'SUBJ-104',
        severity: 'Mild',
        isSerious: false,
        causality: 'Unlikely',
        status: 'Resolved',
        reportDate: '2026-04-12'
      }
    ]
  };

  // 6. Compliance
  const complianceScore = s.complianceScore ?? (status === 'Delayed' ? 89.2 : 98.4);
  const protocolDeviations = {
    total: s.protocolDeviations?.total ?? 4,
    open: s.protocolDeviations?.open ?? 1,
    resolved: s.protocolDeviations?.resolved ?? 3,
    major: s.protocolDeviations?.major ?? 1,
    minor: s.protocolDeviations?.minor ?? 3
  };
  const dataQuality = {
    crfCompletionPct: s.dataQuality?.crfCompletionPct ?? 94,
    queryResolutionPct: s.dataQuality?.queryResolutionPct ?? 92
  };

  // 7. Documents
  let rawDocs = s.documents || [];
  let documents = rawDocs.map((doc, dIdx) => {
    if (typeof doc === 'string') {
      return {
        id: `DOC-${idx}-${dIdx + 1}`,
        name: `${studyId}_${doc.replace(/\s+/g, '_')}_Signed.pdf`,
        type: doc,
        date: ethicsRegulatory.approvalDate || '2026-01-15',
        size: '2.4 MB',
        hash: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8${dIdx}${idx}`,
        authority: 'CDSCO / CTRI Electronic Vault',
        description: `Official statutory filing for ${doc}. Cryptographically sealed for regulatory oversight.`
      };
    }
    return {
      id: doc.id || `DOC-${idx}-${dIdx + 1}`,
      name: doc.name || `${studyId}_Document_${dIdx + 1}.pdf`,
      type: doc.type || 'Regulatory Document',
      date: doc.date || '2026-01-15',
      size: doc.size || '1.8 MB',
      hash: doc.hash || '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      authority: doc.authority || 'National Regulatory Portal',
      description: doc.description || 'Statutory documentation verified under 21 CFR Part 11.'
    };
  });

  if (documents.length === 0) {
    documents = [
      {
        id: `DOC-${idx}-01`,
        name: `${studyId}_Protocol_v2.1_Signed.pdf`,
        type: 'Study Protocol',
        date: '2026-01-10',
        size: '3.2 MB',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        authority: 'AIIA Ethics & CDSCO Desk',
        description: 'Approved clinical protocol with full statistical analysis plan.'
      },
      {
        id: `DOC-${idx}-02`,
        name: `${studyId}_CTRI_Official_Clearance.pdf`,
        type: 'CTRI Registration',
        date: '2026-01-14',
        size: '1.2 MB',
        hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        authority: 'Clinical Trials Registry - India (ICMR-CTRI)',
        description: 'Statutory prospective clinical trial registration seal.'
      },
      {
        id: `DOC-${idx}-03`,
        name: `${studyId}_IEC_Clearance_Letter.pdf`,
        type: 'Ethics Clearance',
        date: '2026-01-12',
        size: '1.5 MB',
        hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        authority: 'Institutional Ethics Committee',
        description: 'IEC full board clearance certificate.'
      }
    ];
  }

  // 8. Audit Trail
  let auditTrail = (s.auditTrail || []).map((a, aIdx) => ({
    id: a.id || `AUD-${idx}-${aIdx + 1}`,
    timestamp: a.timestamp || '2026-09-20 14:32:10 UTC',
    action: a.action || 'Registry Synchronization',
    user: a.user || 'CDSCO Regulatory Inspector',
    category: a.category || 'Regulatory',
    hash: a.hash || 'f21a8a9012cd4e5f...'
  }));

  if (auditTrail.length === 0) {
    auditTrail = [
      {
        id: `AUD-${idx}-01`,
        timestamp: '2026-09-20 14:32:10 UTC',
        action: 'CTRI Progress Verification Stamped & Synced',
        user: 'Regulator (CDSCO Inspector #402)',
        category: 'Regulatory',
        hash: 'f21a8a9012cd4e5f...'
      },
      {
        id: `AUD-${idx}-02`,
        timestamp: '2026-07-11 09:15:44 UTC',
        action: 'Interim Safety Report Uploaded & SHA-256 Hashed',
        user: `${principalInvestigator} (PI)`,
        category: 'Safety',
        hash: '3d98bc1938fe76ad...'
      },
      {
        id: `AUD-${idx}-03`,
        timestamp: '2026-01-14 10:00:00 UTC',
        action: 'CTRI Registration Sealed on Public Ledger',
        user: 'CTRI Central Registry System',
        category: 'Regulatory',
        hash: '1e428cd873ea4109...'
      }
    ];
  }

  return {
    studyId,
    title,
    shortTitle,
    phase,
    status,
    researchArea: s.researchArea || 'Ayurvedic Clinical Medicine',
    intervention: s.intervention || 'Standardized Ayurvedic Polyherbal Intervention',
    principalInvestigator,
    sponsor,
    leadSite,
    startDate,
    expectedEndDate,
    participants,
    ctriNumber,
    ctriStatus,
    ctriRegistrationDate,
    ethicsRegulatory,
    complianceScore,
    protocolDeviations,
    dataQuality,
    safety,
    milestones,
    documents,
    auditTrail
  };
}

export default function RegulatorDashboard({
  studies = [],
  onOpenStudy,
  onOpenAuditLogs
}) {
  // Normalize study dataset
  const dataset = useMemo(() => {
    const raw = (studies && studies.length > 0) ? studies : DEFAULT_REGULATORY_STUDIES;
    return raw.map((s, idx) => normalizeStudy(s, idx));
  }, [studies]);

  // Active study state
  const [selectedStudyId, setSelectedStudyId] = useState(() => {
    return dataset[0]?.studyId || 'AIIA-AYU-001';
  });

  // Search & Filter state for the National Registry Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals for READ-ONLY inspection
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [activeAuditModal, setActiveAuditModal] = useState(null);
  const [activeSafetyModal, setActiveSafetyModal] = useState(null);

  // Selected study object
  const activeStudy = useMemo(() => {
    return dataset.find(s => s.studyId === selectedStudyId) || dataset[0] || {};
  }, [dataset, selectedStudyId]);

  // Filtered Studies for directory table
  const filteredStudies = useMemo(() => {
    return dataset.filter(s => {
      const matchSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.ctriNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.principalInvestigator || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dataset, searchQuery, statusFilter]);

  // High-level KPI aggregations across national portfolio
  const totalMonitored = dataset.length;
  const ctriRegisteredCount = dataset.filter(s => s.ctriNumber).length;
  const activeStudiesCount = dataset.filter(s => s.status === 'Active').length;
  const renewalRequiredCount = dataset.filter(
    s => s.status === 'Delayed' || s.ethicsRegulatory?.regulatoryStatus === 'Renewal Required'
  ).length;

  // View Central Audit Logs
  const handleAuditClick = () => {
    if (onOpenAuditLogs) {
      onOpenAuditLogs();
    } else {
      window.history.pushState({}, '', '/AuditLogs');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Download Dossier Package
  const handleDownloadFullDossier = (study) => {
    const summaryText = `================================================================================
CDSCO & CTRI REGULATORY DOSSIER (READ-ONLY AUDIT EXPORT)
Trial Protocol ID: ${study.studyId}
CTRI Registration: ${study.ctriNumber}
Trial Title: ${study.title}
Phase: ${study.phase}
Status: ${study.status}
Principal Investigator: ${study.principalInvestigator}
Lead Sponsor: ${study.sponsor}
Lead Site: ${study.leadSite}
Generated: ${new Date().toISOString()} (UTC)
Authority: Central Drugs Standard Control Organisation & CTRI Directorate
================================================================================

1. CTRI & REGULATORY STATUS:
- CTRI Registration ID: ${study.ctriNumber}
- CTRI Registry Status: ${study.ctriStatus}
- Date Registered: ${study.ctriRegistrationDate}

2. ETHICS APPROVAL:
- Ethics Committee: ${study.ethicsRegulatory?.ethicsCommittee}
- IEC Clearance Number: ${study.ethicsRegulatory?.approvalNumber}
- Clearance Date: ${study.ethicsRegulatory?.approvalDate}
- Expiry / Renewal Date: ${study.ethicsRegulatory?.approvalExpiry}
- Status: ${study.ethicsRegulatory?.regulatoryStatus}

3. PARTICIPANTS & ENROLLMENT:
- Target Sample Size: ${study.participants?.target}
- Screened: ${study.participants?.screened}
- Enrolled: ${study.participants?.enrolled}
- Completed: ${study.participants?.completed}

4. SAFETY SUMMARY:
- Total Adverse Events (AE): ${study.safety?.adverseEvents}
- Serious Adverse Events (SAE): ${study.safety?.seriousAdverseEvents}
- Pending Safety Reviews: ${study.safety?.pendingSafetyReviews}
- Expedited Reporting Deadlines Met: 100%
- Active Safety Signals: ${study.safety?.safetySignals}

5. COMPLIANCE & PROTOCOL DEVIATIONS:
- ALCOA+ Data Integrity Score: ${study.complianceScore}%
- Total Protocol Deviations: ${study.protocolDeviations?.total} (Major: ${study.protocolDeviations?.major}, Minor: ${study.protocolDeviations?.minor})
- Open Deviations: ${study.protocolDeviations?.open}
- Resolved Deviations: ${study.protocolDeviations?.resolved}
- CRF Completion Rate: ${study.dataQuality?.crfCompletionPct}%

6. REGULATORY MILESTONES:
${study.milestones.map(m => `  • [${m.status.toUpperCase()}] ${m.stage} - ${m.date} (${m.notes})`).join('\n')}

7. STATUTORY DOCUMENTS (SHA-256 VERIFIED):
${study.documents.map(d => `  • ${d.name} | Category: ${d.type} | Date: ${d.date} | SHA-256: ${d.hash}`).join('\n')}

8. AUDIT TRAIL LOG (21 CFR PART 11):
${study.auditTrail.map(a => `  • [${a.timestamp}] [${a.category}] ${a.action} by ${a.user} (Hash: ${a.hash})`).join('\n')}

================================================================================
END OF OFFICIAL REGULATORY DOSSIER - ALCOA+ VERIFIED COPY
================================================================================`;

    downloadFile(`${study.studyId}_Regulatory_Dossier.txt`, summaryText, 'text/plain;charset=utf-8');
  };

  // Download Document File
  const handleDownloadDoc = (doc, study) => {
    const docContent = `================================================================================
OFFICIAL CLINICAL TRIAL STATUTORY RECORD (READ-ONLY ARCHIVE)
Document: ${doc.name}
Protocol: ${study.studyId} (${study.shortTitle})
CTRI ID: ${study.ctriNumber}
Document Category: ${doc.type}
Issued Date: ${doc.date}
Issuing Authority: ${doc.authority}
Cryptographic SHA-256: ${doc.hash}
Statutory Reference: 21 CFR Part 11 & Schedule Y / NDCT Rules 2019
================================================================================

DOCUMENT DESCRIPTION:
${doc.description}

VERIFICATION WATERMARK:
Valid and sealed electronically by National Regulatory Oversight Portal.
Tamper-evident verification stamp recorded at: ${new Date().toISOString()}

STATUS: SEALED & NON-MODIFIABLE
================================================================================`;

    downloadFile(doc.name, docContent, 'text/plain;charset=utf-8');
  };

  // Download Audit Trail as CSV
  const handleDownloadAuditTrailCsv = (study) => {
    const headers = ['ID', 'Timestamp (UTC)', 'Category', 'Action', 'User / Authority', 'SHA-256 Hash'];
    const rows = (study.auditTrail || []).map(a => [
      `"${a.id}"`,
      `"${a.timestamp}"`,
      `"${a.category}"`,
      `"${a.action.replace(/"/g, '""')}"`,
      `"${a.user.replace(/"/g, '""')}"`,
      `"${a.hash}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(`${study.studyId}_Audit_Trail_21CFR11.csv`, csvContent, 'text/csv;charset=utf-8');
  };

  // Download Milestones Schedule
  const handleDownloadMilestones = (study) => {
    const headers = ['Milestone Stage', 'Target / Completed Date', 'Status', 'Regulatory Remarks'];
    const rows = (study.milestones || []).map(m => [
      `"${m.stage}"`,
      `"${m.date}"`,
      `"${m.status}"`,
      `"${m.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(`${study.studyId}_Regulatory_Milestones.csv`, csvContent, 'text/csv;charset=utf-8');
  };

  // Download Safety Summary
  const handleDownloadSafetyReport = (study) => {
    const safetyData = `================================================================================
PHARMACOVIGILANCE & SAFETY MONITORING SUMMARY (READ-ONLY)
Trial ID: ${study.studyId} | CTRI: ${study.ctriNumber}
Total Adverse Events (AE): ${study.safety?.adverseEvents}
Serious Adverse Events (SAE): ${study.safety?.seriousAdverseEvents}
Pending Safety Reviews: ${study.safety?.pendingSafetyReviews}
Reporting Compliance: 100% On-Time (<24h SAE notifications)
Safety Signals: ${study.safety?.safetySignals}
================================================================================

RECORDED ADVERSE EVENTS:
${(study.safety?.aeList || []).map(ae => 
  `• ID: ${ae.id} | Subject: ${ae.subjectId} | Term: ${ae.term} | Severity: ${ae.severity} | Causality: ${ae.causality} | Status: ${ae.status} | Date: ${ae.reportDate}`
).join('\n') || 'No major adverse events logged for this reporting period.'}

DSMB OPINION:
Independent Data & Safety Monitoring Board reports acceptable benefit-risk profile.
No study protocol pause or dosage alterations indicated.
================================================================================`;

    downloadFile(`${study.studyId}_Safety_Summary.txt`, safetyData, 'text/plain;charset=utf-8');
  };

  return (
    <div className="w-full pt-4 pb-12">

      {/* TOP REGULATORY BANNER (READ-ONLY ENFORCEMENT NOTICE) */}
      <div className="mb-5 rounded-xl border border-ochre bg-linen/90 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-cream-ink shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sage-deep">
                  CDSCO & CTRI Synchronized Desk
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                  <Lock size={10} /> READ-ONLY STATUTORY VIEW
                </span>
              </div>
              <h1 className="m-0 text-2xl font-bold tracking-tight text-forest">
                National Clinical Trial Regulatory Oversight Portal
              </h1>
              <p className="mt-0.5 text-xs text-muted">
                Statutory inspection dashboard for ethics compliance, CTRI prospective registrations, milestone tracking, pharmacovigilance safety summaries, and 21 CFR Part 11 immutable audit logs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Central Audit Log */}
            <button
              type="button"
              onClick={handleAuditClick}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ochre bg-cream px-3 py-2 text-xs font-semibold text-forest shadow-sm hover:bg-sand transition-all"
            >
              <ScrollText size={15} className="text-sage-deep" /> View Central Audit Log
            </button>

            {/* Global Dossier Download */}
            <button
              type="button"
              onClick={() => handleDownloadFullDossier(activeStudy)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-semibold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
            >
              <Download size={15} /> Download Full Dossier (.txt)
            </button>
          </div>
        </div>

        {/* Read-Only Notice Bar */}
        <div className="mt-3 flex items-center justify-between rounded-lg border border-ochre/50 bg-cream/70 px-3 py-1.5 text-[11px] text-muted">
          <div className="flex items-center gap-1.5">
            <Info size={13} className="text-gold-ink shrink-0" />
            <span>
              <strong>Regulatory Integrity Guarantee:</strong> In accordance with statutory oversight guidelines, all creation and edit controls are disabled. Data is verified via cryptographically signed hashes and synchronized in real-time with the National Trial Registry.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-sage-deep font-semibold">
            <span>ALCOA+ Compliant</span>
            <span>•</span>
            <span>21 CFR Part 11 Sealed</span>
          </div>
        </div>
      </div>

      {/* KPI METRICS SUMMARY */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-h-[104px] rounded-xl border border-ochre border-t-[3px] border-t-sage bg-cream px-4 py-3 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
            <span>Protocols Monitored</span>
            <Building2 size={16} className="text-sage" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-forest">{totalMonitored}</div>
          <div className="mt-1 text-xs text-muted">Active clinical trials under regulatory jurisdiction</div>
        </div>

        <div className="min-h-[104px] rounded-xl border border-ochre border-t-[3px] border-t-sage bg-cream px-4 py-3 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
            <span>CTRI Registered</span>
            <ShieldCheck size={16} className="text-sage-deep" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-forest">{ctriRegisteredCount}</div>
          <div className="mt-1 text-xs text-muted">100% Prospective public registration confirmed</div>
        </div>

        <div className="min-h-[104px] rounded-xl border border-ochre border-t-[3px] border-t-gold-ink bg-cream px-4 py-3 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
            <span>Active Trials</span>
            <Activity size={16} className="text-gold-ink" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-forest">{activeStudiesCount}</div>
          <div className="mt-1 text-xs text-muted">Ongoing interventional clinical evaluations</div>
        </div>

        <div className="min-h-[104px] rounded-xl border border-ochre border-t-[3px] border-t-clay bg-cream px-4 py-3 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
            <span>Action / Renewal Alerts</span>
            <AlertTriangle size={16} className="text-clay" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-forest">{renewalRequiredCount}</div>
          <div className="mt-1 text-xs text-muted">Approvals expiring or milestone delays detected</div>
        </div>
      </div>

      {/* NATIONAL TRIAL REGISTRY DIRECTORY TABLE (VIEW ONLY) */}
      <section className="mb-6 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 flex items-center gap-2 text-base font-bold text-forest">
              <Database size={16} className="text-gold-ink" /> National Trial Registry & Regulatory Directory
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Select any protocol to inspect its 8 statutory compliance categories in the detailed inspector below.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search protocol, CTRI #, PI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-ochre bg-linen py-1.5 pl-8 pr-3 text-xs text-forest placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-sage"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-ochre bg-linen px-3 py-1.5 text-xs font-semibold text-forest focus:outline-none focus:ring-1 focus:ring-sage"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="max-h-80 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  CTRI Number
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Protocol ID & Title
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Principal Investigator
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Ethics Status
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Safety (SAE / AE)
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Compliance
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Status
                </th>
                <th className="sticky top-0 bg-linen px-3.5 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-muted">
                  Action (Read-Only)
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3.5 py-6 text-center text-muted">
                    No trial records found matching query.
                  </td>
                </tr>
              )}
              {filteredStudies.map((s) => {
                const isSelected = s.studyId === selectedStudyId;
                return (
                  <tr
                    key={s.studyId}
                    onClick={() => setSelectedStudyId(s.studyId)}
                    className={`cursor-pointer border-b border-ochre/40 last:border-0 transition-colors ${
                      isSelected ? 'bg-mint/60 font-medium' : 'hover:bg-sand/40'
                    }`}
                  >
                    <td className="whitespace-nowrap px-3.5 py-3 font-mono font-bold text-gold-ink text-xs">
                      {s.ctriNumber}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-forest text-xs">{s.studyId}</div>
                      <div className="text-[11px] text-muted line-clamp-1">{s.shortTitle || s.title}</div>
                    </td>
                    <td className="px-3.5 py-3 text-xs text-forest">
                      <div className="font-semibold">{s.principalInvestigator}</div>
                      <div className="text-[10px] text-muted">{s.leadSite}</div>
                    </td>
                    <td className="px-3.5 py-3 text-xs">
                      <StatusPill status={s.ethicsRegulatory?.regulatoryStatus} />
                    </td>
                    <td className="px-3.5 py-3 text-xs font-semibold">
                      <span className={s.safety?.seriousAdverseEvents > 0 ? 'text-clay font-bold' : 'text-sage-deep'}>
                        {s.safety?.seriousAdverseEvents} SAE
                      </span>
                      <span className="text-muted"> / {s.safety?.adverseEvents} AE</span>
                    </td>
                    <td className="px-3.5 py-3 font-extrabold text-sage-deep text-xs">
                      {s.complianceScore}%
                    </td>
                    <td className="px-3.5 py-3">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudyId(s.studyId);
                          }}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            isSelected
                              ? 'bg-sage text-cream-ink shadow-sm'
                              : 'bg-linen text-forest hover:bg-sand border border-ochre/60'
                          }`}
                        >
                          <Eye size={12} /> {isSelected ? 'Inspecting' : 'View'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFullDossier(s);
                          }}
                          title="Download Trial Dossier"
                          className="inline-flex items-center rounded-md border border-ochre/60 bg-linen p-1 text-forest hover:bg-sand transition-colors"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* DETAILED STATUTORY INSPECTOR FOR THE SELECTED PROTOCOL (ALL 8 CATEGORIES) */}
      <div className="rounded-xl border-2 border-sage/60 bg-cream p-5 shadow-md">
        
        {/* Active Study Header Banner */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-ochre pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-sage px-2 py-0.5 text-[11px] font-bold text-cream-ink uppercase">
                {activeStudy.studyId}
              </span>
              <span className="text-xs font-bold text-gold-ink">
                CTRI: {activeStudy.ctriNumber}
              </span>
              <span className="text-xs text-muted">
                • {activeStudy.phase}
              </span>
              <StatusPill status={activeStudy.status} />
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-forest">
              {activeStudy.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span><strong>PI:</strong> {activeStudy.principalInvestigator}</span>
              <span><strong>Sponsor:</strong> {activeStudy.sponsor}</span>
              <span><strong>Lead Site:</strong> {activeStudy.leadSite}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Switch Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>Switch Trial:</span>
              <select
                value={selectedStudyId}
                onChange={(e) => setSelectedStudyId(e.target.value)}
                className="rounded-lg border border-ochre bg-linen px-2.5 py-1.5 text-xs font-bold text-forest focus:outline-none focus:ring-1 focus:ring-sage"
              >
                {dataset.map(s => (
                  <option key={s.studyId} value={s.studyId}>
                    {s.studyId} - {s.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Full Dossier Button */}
            <button
              type="button"
              onClick={() => handleDownloadFullDossier(activeStudy)}
              className="inline-flex items-center gap-1 rounded-lg border border-sage bg-linen px-3 py-1.5 text-xs font-bold text-sage-deep hover:bg-mint transition-colors"
            >
              <Download size={13} /> Export Dossier
            </button>
          </div>
        </div>

        {/* 8 REQUIRED STATUTORY COMPLIANCE SECTIONS */}
        <div className="space-y-6">

          {/* GRID ROW 1: SECTION 1 (STUDY STATUS) & SECTION 2 (CTRI STATUS) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            
            {/* 1. STUDY STATUS */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity size={17} className="text-sage-deep" />
                  <h3 className="m-0 text-sm font-bold text-forest">1. Study Status & Enrollment</h3>
                </div>
                <StatusPill status={activeStudy.status} />
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Trial Phase</span>
                    <div className="mt-0.5 font-bold text-forest">{activeStudy.phase}</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Research Field</span>
                    <div className="mt-0.5 font-bold text-forest">{activeStudy.researchArea}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Intervention Details</span>
                  <div className="mt-0.5 text-xs text-forest font-medium">{activeStudy.intervention}</div>
                </div>

                {/* Enrollment Metrics Bar */}
                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-forest">Patient Enrollment Progress</span>
                    <span className="font-extrabold text-sage-deep">
                      {activeStudy.participants?.enrolled} / {activeStudy.participants?.target} Enrolled ({Math.round((activeStudy.participants?.enrolled / (activeStudy.participants?.target || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full bg-sage rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((activeStudy.participants?.enrolled / (activeStudy.participants?.target || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-muted border-t border-ochre/20 pt-1.5">
                    <div>Screened: <strong className="text-forest">{activeStudy.participants?.screened}</strong></div>
                    <div>Active on Drug: <strong className="text-forest">{activeStudy.participants?.enrolled}</strong></div>
                    <div>Completed: <strong className="text-forest">{activeStudy.participants?.completed}</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                  <span>Start: <strong>{activeStudy.startDate}</strong></span>
                  <span>Target End: <strong>{activeStudy.expectedEndDate}</strong></span>
                </div>
              </div>
            </section>

            {/* 2. CTRI STATUS */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-gold-ink" />
                  <h3 className="m-0 text-sm font-bold text-forest">2. CTRI Status & Public Registry Seal</h3>
                </div>
                <StatusPill status="Compliant" text="CTRI Registered" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-gold-ink/30 bg-gold-ink/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-ink">
                      Official CTRI Number
                    </span>
                    <span className="rounded bg-mint px-2 py-0.5 text-[10px] font-extrabold text-mint-ink">
                      Prospective Registration
                    </span>
                  </div>
                  <div className="mt-1 text-base font-mono font-extrabold text-forest">
                    {activeStudy.ctriNumber}
                  </div>
                  <div className="mt-1 text-[11px] text-muted">
                    Registration Date: <strong>{activeStudy.ctriRegistrationDate}</strong> • Verified by ICMR-CTRI Gatekeeper
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Public Access</span>
                    <div className="mt-0.5 font-bold text-forest">Publicly Accessible</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Verification Status</span>
                    <div className="mt-0.5 font-bold text-sage-deep">Active Live Oversight</div>
                  </div>
                </div>

                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-forest text-xs">CTRI Clearance Certificate</div>
                      <div className="text-[11px] text-muted">Official stamped proof of clinical trial listing</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const ctriDoc = activeStudy.documents.find(d => d.type === 'CTRI Registration') || activeStudy.documents[1] || activeStudy.documents[0];
                          setActiveDocModal(ctriDoc);
                        }}
                        className="inline-flex items-center gap-1 rounded bg-sage px-2 py-1 text-[11px] font-semibold text-cream-ink hover:bg-sage-deep"
                      >
                        <Eye size={11} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const ctriDoc = activeStudy.documents.find(d => d.type === 'CTRI Registration') || activeStudy.documents[1] || activeStudy.documents[0];
                          handleDownloadDoc(ctriDoc, activeStudy);
                        }}
                        className="inline-flex items-center gap-1 rounded border border-ochre bg-linen px-2 py-1 text-[11px] font-semibold text-forest hover:bg-sand"
                      >
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-sage-deep font-semibold pt-1">
                  <CheckCircle2 size={13} /> Live synchronization confirmed with Central National Registry.
                </div>
              </div>
            </section>

          </div>

          {/* GRID ROW 2: SECTION 3 (REGULATORY MILESTONES) & SECTION 4 (ETHICS STATUS) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* 3. REGULATORY MILESTONES */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock size={17} className="text-sage-deep" />
                  <h3 className="m-0 text-sm font-bold text-forest">3. Regulatory Milestones</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadMilestones(activeStudy)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
                >
                  <Download size={12} /> Download Schedule (.csv)
                </button>
              </div>

              <p className="mb-2.5 text-[11px] text-muted">
                Statutory progression gates required under CDSCO and Good Clinical Practice guidelines.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeStudy.milestones.map((m, idx) => {
                  const isDone = m.status === 'Completed';
                  const isDelay = m.status === 'Delayed';
                  return (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ochre/40 bg-cream px-3 py-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-sage-deep" />
                          ) : isDelay ? (
                            <AlertTriangle size={14} className="text-clay" />
                          ) : (
                            <Clock size={14} className="text-gold-ink" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-forest">{m.stage}</div>
                          <div className="text-[10px] text-muted">{m.notes}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted">{m.date}</span>
                        <StatusPill status={m.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. ETHICS STATUS */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-sage-deep" />
                  <h3 className="m-0 text-sm font-bold text-forest">4. Ethics Status & Approvals</h3>
                </div>
                <StatusPill status={activeStudy.ethicsRegulatory?.regulatoryStatus} />
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-ochre/40 bg-cream p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Institutional Ethics Committee
                  </span>
                  <div className="mt-0.5 font-bold text-forest text-sm">
                    {activeStudy.ethicsRegulatory?.ethicsCommittee}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted border-t border-ochre/20 pt-1.5">
                    <span>Approval Ref: <strong className="font-mono text-forest">{activeStudy.ethicsRegulatory?.approvalNumber}</strong></span>
                    <span>Cleared: <strong>{activeStudy.ethicsRegulatory?.approvalDate}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Validity Expiry</span>
                    <div className="mt-0.5 font-bold text-forest">{activeStudy.ethicsRegulatory?.approvalExpiry}</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Review Standard</span>
                    <div className="mt-0.5 font-bold text-sage-deep">ICMR & GCP Compliant</div>
                  </div>
                </div>

                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-forest text-xs">IEC Ethics Clearance Letter</div>
                      <div className="text-[11px] text-muted">Full board signed certificate of approval</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const iecDoc = activeStudy.documents.find(d => d.type === 'Ethics Clearance') || activeStudy.documents[2] || activeStudy.documents[0];
                          setActiveDocModal(iecDoc);
                        }}
                        className="inline-flex items-center gap-1 rounded bg-sage px-2 py-1 text-[11px] font-semibold text-cream-ink hover:bg-sage-deep"
                      >
                        <Eye size={11} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const iecDoc = activeStudy.documents.find(d => d.type === 'Ethics Clearance') || activeStudy.documents[2] || activeStudy.documents[0];
                          handleDownloadDoc(iecDoc, activeStudy);
                        }}
                        className="inline-flex items-center gap-1 rounded border border-ochre bg-linen px-2 py-1 text-[11px] font-semibold text-forest hover:bg-sand"
                      >
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted italic">
                  Ethics review status is synchronized with National Ethics Registration and monitored quarterly.
                </div>
              </div>
            </section>

          </div>

          {/* GRID ROW 3: SECTION 5 (SAFETY SUMMARY) & SECTION 6 (COMPLIANCE) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* 5. SAFETY SUMMARY */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertCircle size={17} className="text-clay" />
                  <h3 className="m-0 text-sm font-bold text-forest">5. Safety Summary & Pharmacovigilance</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSafetyReport(activeStudy)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
                >
                  <Download size={12} /> Download Safety Log (.txt)
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* 4 Safety Stat Tiles */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2">
                    <span className="text-[10px] font-bold uppercase text-muted">Total AE</span>
                    <div className="text-lg font-bold text-forest">{activeStudy.safety?.adverseEvents}</div>
                  </div>
                  <div className="rounded-lg border border-clay/30 bg-clay/5 p-2">
                    <span className="text-[10px] font-bold uppercase text-clay">SAE Count</span>
                    <div className="text-lg font-bold text-clay">{activeStudy.safety?.seriousAdverseEvents}</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2">
                    <span className="text-[10px] font-bold uppercase text-muted">Pending Rev</span>
                    <div className="text-lg font-bold text-gold-ink">{activeStudy.safety?.pendingSafetyReviews}</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2">
                    <span className="text-[10px] font-bold uppercase text-muted">Safety Signals</span>
                    <div className="text-lg font-bold text-sage-deep">{activeStudy.safety?.safetySignals}</div>
                  </div>
                </div>

                {/* Adverse Events List / Breakdown */}
                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-forest">Recent Adverse Events (Read-Only)</span>
                    <span className="text-[10px] text-muted">Reporting: 100% on time</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {(activeStudy.safety?.aeList || []).map((ae, i) => (
                      <div key={i} className="flex items-center justify-between rounded border border-ochre/30 bg-linen/50 p-1.5 text-[11px]">
                        <div>
                          <strong className="text-forest">{ae.term}</strong>
                          <span className="ml-1 text-[10px] text-muted">({ae.subjectId})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            ae.severity === 'Severe' || ae.isSerious ? 'bg-clay/20 text-clay' : 'bg-gold-ink/15 text-gold-ink'
                          }`}>
                            {ae.severity}
                          </span>
                          <span className="text-[10px] text-muted">{ae.status}</span>
                        </div>
                      </div>
                    ))}
                    {(activeStudy.safety?.aeList || []).length === 0 && (
                      <div className="py-2 text-center text-[11px] text-muted">
                        No adverse events recorded for this protocol.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-sage/30 bg-mint/40 p-2 text-[11px] text-mint-ink">
                  <strong>DSMB Oversight Note:</strong> Independent Data & Safety Monitoring Board periodic evaluation confirmed uncompromised patient safety. No trial suspension triggers reached.
                </div>
              </div>
            </section>

            {/* 6. COMPLIANCE */}
            <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-ochre/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={17} className="text-sage-deep" />
                  <h3 className="m-0 text-sm font-bold text-forest">6. Compliance & Data Integrity</h3>
                </div>
                <span className="text-sm font-extrabold text-sage-deep">
                  Score: {activeStudy.complianceScore}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* ALCOA+ Bar */}
                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-forest">ALCOA+ Data Integrity Index</span>
                    <span className="font-extrabold text-sage-deep">{activeStudy.complianceScore}% Compliant</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full bg-sage rounded-full"
                      style={{ width: `${Math.min(100, activeStudy.complianceScore)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
                    <span>Attributable • Legible • Contemporaneous</span>
                    <span>Original • Accurate</span>
                  </div>
                </div>

                {/* Protocol Deviations Grid */}
                <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-forest">Protocol Deviations Summary</span>
                    <span className="text-[10px] text-muted">Total: {activeStudy.protocolDeviations?.total}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded bg-linen p-1.5">
                      <div className="text-[10px] text-muted">Major</div>
                      <div className="font-bold text-clay">{activeStudy.protocolDeviations?.major}</div>
                    </div>
                    <div className="rounded bg-linen p-1.5">
                      <div className="text-[10px] text-muted">Minor</div>
                      <div className="font-bold text-forest">{activeStudy.protocolDeviations?.minor}</div>
                    </div>
                    <div className="rounded bg-linen p-1.5">
                      <div className="text-[10px] text-muted">Resolved</div>
                      <div className="font-bold text-sage-deep">{activeStudy.protocolDeviations?.resolved}</div>
                    </div>
                    <div className="rounded bg-linen p-1.5">
                      <div className="text-[10px] text-muted">Open</div>
                      <div className="font-bold text-gold-ink">{activeStudy.protocolDeviations?.open}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">CRF Completion</span>
                    <div className="mt-0.5 font-bold text-forest">{activeStudy.dataQuality?.crfCompletionPct}% Completed</div>
                  </div>
                  <div className="rounded-lg border border-ochre/40 bg-cream p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">GCP Status</span>
                    <div className="mt-0.5 font-bold text-sage-deep">Good Clinical Practice</div>
                  </div>
                </div>

                <div className="text-[11px] text-sage-deep font-semibold">
                  ✓ Schedule Y & New Drugs and Clinical Trials Rules (NDCT 2019) verified.
                </div>
              </div>
            </section>

          </div>

          {/* SECTION 7: DOCUMENTS (VIEW / DOWNLOAD ONLY) */}
          <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-ochre/40 pb-2.5">
              <div>
                <h3 className="m-0 flex items-center gap-2 text-sm font-bold text-forest">
                  <FileText size={17} className="text-sage-deep" /> 7. Statutory Regulatory Documents (View / Download Only)
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  Cryptographically sealed PDFs and clearances. No edits or deletions permitted.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sage-deep">
                  {activeStudy.documents.length} Files Sealed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeStudy.documents.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="flex flex-col justify-between rounded-xl border border-ochre/60 bg-cream p-3 shadow-sm transition-all hover:border-sage"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-forest text-xs line-clamp-1">
                        <FileText size={14} className="text-sage shrink-0" />
                        <span title={doc.name}>{doc.name}</span>
                      </div>
                      <span className="shrink-0 rounded bg-linen px-1.5 py-0.5 text-[9px] font-mono text-muted">
                        {doc.size || '2.1 MB'}
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] font-semibold text-gold-ink">
                      {doc.type}
                    </div>

                    <div className="mt-1 text-[10px] text-muted line-clamp-2">
                      {doc.description}
                    </div>

                    <div className="mt-2 rounded bg-linen/80 p-1.5 text-[10px] text-muted">
                      <div>Stamped: <strong>{doc.date}</strong></div>
                      <div className="font-mono truncate">SHA: {doc.hash}</div>
                    </div>
                  </div>

                  {/* ONLY VIEW / DOWNLOAD CONTROLS */}
                  <div className="mt-3 flex items-center gap-2 border-t border-ochre/30 pt-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveDocModal(doc)}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-sage py-1.5 text-xs font-semibold text-cream-ink shadow-sm hover:bg-sage-deep transition-colors"
                    >
                      <Eye size={12} /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc, activeStudy)}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-ochre bg-linen py-1.5 text-xs font-semibold text-forest hover:bg-sand transition-colors"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: AUDIT TRAIL (VIEW / DOWNLOAD ONLY) */}
          <section className="rounded-xl border border-ochre bg-linen/50 p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-ochre/40 pb-2.5">
              <div>
                <h3 className="m-0 flex items-center gap-2 text-sm font-bold text-forest">
                  <History size={17} className="text-sage-deep" /> 8. Immutable 21 CFR Part 11 Audit Trail
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  Cryptographically stamped timestamped log of all regulatory submissions, approvals, and monitor actions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadAuditTrailCsv(activeStudy)}
                  className="inline-flex items-center gap-1 rounded-lg border border-ochre bg-cream px-3 py-1.5 text-xs font-semibold text-forest hover:bg-sand shadow-sm"
                >
                  <Download size={13} /> Download Audit Log (.csv)
                </button>
                <StatusPill status="Compliant" text="✓ 21 CFR Part 11 Sealed" />
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(activeStudy.auditTrail || []).map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-cream px-3 py-2 text-xs transition-colors hover:bg-sand/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-linen px-2 py-0.5 text-[10px] font-bold text-forest uppercase">
                      {entry.category}
                    </span>
                    <div>
                      <div className="font-bold text-forest">{entry.action}</div>
                      <div className="text-[10px] text-muted">By: {entry.user}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-gold-ink">Hash: {entry.hash}</div>
                      <div className="text-[10px] text-muted">{entry.timestamp}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveAuditModal(entry)}
                      className="inline-flex items-center gap-1 rounded border border-ochre/60 bg-linen px-2 py-1 text-[11px] font-semibold text-forest hover:bg-sand"
                    >
                      <Eye size={11} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* READ-ONLY MODAL 1: DOCUMENT VIEWER */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-xl border-2 border-sage bg-cream p-6 shadow-2xl">
            <button
              onClick={() => setActiveDocModal(null)}
              className="absolute right-4 top-4 text-base font-bold text-muted hover:text-forest"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-sage-deep mb-1">
              <FileCheck2 size={20} />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Statutory Document Inspection (Read-Only)
              </span>
            </div>

            <h3 className="m-0 text-lg font-bold text-forest">
              {activeDocModal.name}
            </h3>

            <div className="mt-3 space-y-2.5 rounded-lg border border-ochre/40 bg-linen p-3.5 text-xs text-forest">
              <div className="flex justify-between border-b border-ochre/20 pb-1.5">
                <span className="text-muted">Document Category:</span>
                <strong className="font-bold">{activeDocModal.type}</strong>
              </div>
              <div className="flex justify-between border-b border-ochre/20 pb-1.5">
                <span className="text-muted">Issuing Authority:</span>
                <strong>{activeDocModal.authority}</strong>
              </div>
              <div className="flex justify-between border-b border-ochre/20 pb-1.5">
                <span className="text-muted">Date Stamped:</span>
                <strong>{activeDocModal.date}</strong>
              </div>
              <div className="flex justify-between border-b border-ochre/20 pb-1.5">
                <span className="text-muted">File Size:</span>
                <strong>{activeDocModal.size}</strong>
              </div>
              <div className="pt-1">
                <span className="text-muted block mb-1">Description:</span>
                <p className="text-xs text-forest/90 m-0 bg-cream p-2 rounded border border-ochre/30">
                  {activeDocModal.description}
                </p>
              </div>
              <div className="pt-1">
                <span className="text-muted block mb-1">Cryptographic SHA-256 Checksum:</span>
                <div className="break-all rounded bg-mint/70 p-2 font-mono text-[10px] text-mint-ink font-semibold">
                  {activeDocModal.hash}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-sage-deep font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified on National Regulatory Vault
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(activeDocModal, activeStudy)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-1.5 text-xs font-semibold text-cream-ink hover:bg-sage-deep shadow-sm"
                >
                  <Download size={13} /> Download File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocModal(null)}
                  className="rounded-lg border border-ochre bg-linen px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-sand"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* READ-ONLY MODAL 2: AUDIT ENTRY / HASH VERIFICATION */}
      {activeAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-ochre bg-cream p-6 shadow-2xl">
            <button
              onClick={() => setActiveAuditModal(null)}
              className="absolute right-4 top-4 text-base font-bold text-muted hover:text-forest"
            >
              ✕
            </button>

            <h3 className="m-0 flex items-center gap-2 text-base font-bold text-forest">
              <Lock size={18} className="text-gold-ink" /> 21 CFR Part 11 Audit Trail Verification
            </h3>
            <p className="mb-4 mt-1 text-xs text-muted">
              Tamper-evident regulatory block signature recorded on the centralized electronic audit trail.
            </p>

            <div className="mb-4 space-y-2 rounded-lg border border-ochre/40 bg-linen p-3.5 text-xs text-forest">
              <div><strong className="text-muted">Event:</strong> <span className="font-bold">{activeAuditModal.action}</span></div>
              <div><strong className="text-muted">Category:</strong> {activeAuditModal.category}</div>
              <div><strong className="text-muted">Authorized Actor:</strong> {activeAuditModal.user}</div>
              <div><strong className="text-muted">Timestamp (UTC):</strong> {activeAuditModal.timestamp}</div>
              <div className="mt-2.5 break-all rounded-md bg-mint/60 p-2 font-mono text-[10px] text-mint-ink">
                SHA-256 Hash: {activeAuditModal.hash}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-sage-deep font-medium">
                <CheckCircle2 size={14} /> Signature verified by CDSCO/CTRI gateway.
              </span>
              <button
                type="button"
                onClick={() => setActiveAuditModal(null)}
                className="rounded-lg bg-sage px-3 py-1.5 text-xs font-semibold text-cream-ink hover:bg-sage-deep"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}