import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Upload, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RegisterProtocol({ onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    pi: '',
    phase: 'Phase II (Therapeutic Exploratory)',
    targetDisease: '',
    targetSubjects: 100,
    primarySite: 'AIIA Central Hospital, New Delhi',
  });

  // Ayush Herb Posology List
  const [herbs, setHerbs] = useState([
    { herbName: 'Ashwagandha Extract (Withania somnifera)', dosage: '500mg', frequency: 'Twice Daily (BID)', anupana: 'Lukewarm Water' }
  ]);

  // Uploaded Files List
  const [uploadedFiles, setUploadedFiles] = useState([
    'Protocol_Synopsis_Draft_v1.0.pdf'
  ]);

  const handleAddHerb = () => {
    setHerbs([...herbs, { herbName: '', dosage: '', frequency: 'Twice Daily (BID)', anupana: 'Lukewarm Water' }]);
  };

  const handleRemoveHerb = (index) => {
    setHerbs(herbs.filter((_, i) => i !== index));
  };

  const handleHerbChange = (index, field, value) => {
    const updated = [...herbs];
    updated[index][field] = value;
    setHerbs(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Protocol "${formData.title || 'New Protocol'}" registered successfully! Docket transmitted to Institutional Ethics Committee (IEC).`);
      onBack();
    }, 1200);
  };

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button 
            className="btn-primary" 
            onClick={onBack} 
            style={{ padding: '6px 14px', fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h)' }}>
            📝 Clinical Trial Protocol Registration
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Initiate Ayush-GCP & CDSCO compliant protocol dossier for Institutional Ethics Committee (IEC) review
          </p>
        </div>
      </div>

      {/* MULTI-STEP PROGRESS TRACKER */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        marginBottom: '24px',
      }}>
        {[
          { step: 1, title: '1. Protocol Overview', sub: 'Title, PI & Target Population' },
          { step: 2, title: '2. Ayush Posology & Herbs', sub: 'Formulation, Dosing & Anupana' },
          { step: 3, title: '3. Regulatory & Attachments', sub: 'ICF, Dossiers & IEC Review' },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          return (
            <div 
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              style={{
                background: isActive ? 'var(--card-bg)' : isDone ? 'var(--code-bg)' : 'var(--bg)',
                border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                padding: '14px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? 'var(--accent)' : 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isDone ? <CheckCircle2 size={16} color="var(--badge-active-text)" /> : item.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
            </div>
          );
        })}
      </div>

      {/* FORM CONTAINER */}
      <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--accent)' }}>
        
        {/* STEP 1: PROTOCOL METADATA */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-h)' }}>Step 1: Primary Protocol Metadata</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Full Clinical Protocol Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Evaluation of Samshamani Vati in Post-Viral Fatigue and Immunity"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Short Acronym / Indication Name *</label>
                <input 
                  type="text" 
                  value={formData.shortTitle} 
                  onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                  placeholder="e.g., Post-Viral Fatigue"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Principal Investigator (PI) *</label>
                <input 
                  type="text" 
                  value={formData.pi} 
                  onChange={(e) => setFormData({ ...formData, pi: e.target.value })}
                  placeholder="e.g., Prof. Dr. Anand Kumar"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Trial Phase</label>
                <select 
                  value={formData.phase} 
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
                >
                  <option value="Phase I (Safety)">Phase I (Safety & Tolerability)</option>
                  <option value="Phase II (Therapeutic Exploratory)">Phase II (Therapeutic Exploratory)</option>
                  <option value="Phase III (Therapeutic Confirmatory)">Phase III (Therapeutic Confirmatory)</option>
                  <option value="Observational">Observational / Post-Marketing</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Target Sample Size (Subjects)</label>
                <input 
                  type="number" 
                  value={formData.targetSubjects} 
                  onChange={(e) => setFormData({ ...formData, targetSubjects: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="btn-primary" onClick={() => setCurrentStep(2)}>Next: Ayush Posology &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 2: AYUSH POSOLOGY & HERBS FORM BUILDER */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-h)' }}>Step 2: Ayush Formulation & Dosing Schedule</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Specify classical/proprietary Ayush herbs and co-administration vehicles (Anupana)</p>
              </div>
              <button className="btn-primary" onClick={handleAddHerb} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> Add Investigational Herb
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {herbs.map((item, index) => (
                <div key={index} style={{ padding: '16px', background: 'var(--code-bg)', borderRadius: '8px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Botanical / Herb Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Samshamani Vati"
                      value={item.herbName} 
                      onChange={(e) => handleHerbChange(index, 'herbName', e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Dosage Unit</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500mg"
                      value={item.dosage} 
                      onChange={(e) => handleHerbChange(index, 'dosage', e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Frequency</label>
                    <select 
                      value={item.frequency} 
                      onChange={(e) => handleHerbChange(index, 'frequency', e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                    >
                      <option value="Once Daily (QD)">Once Daily (QD)</option>
                      <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                      <option value="Thrice Daily (TID)">Thrice Daily (TID)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>Anupana (Vehicle)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Warm Water / Milk"
                      value={item.anupana} 
                      onChange={(e) => handleHerbChange(index, 'anupana', e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                    />
                  </div>

                  <button 
                    onClick={() => handleRemoveHerb(index)} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-terracotta)', cursor: 'pointer', marginTop: '16px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button className="btn-primary" onClick={() => setCurrentStep(1)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>&larr; Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(3)}>Next: Regulatory Dossier &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 3: REGULATORY ATTACHMENTS & CHECKLIST */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-h)' }}>Step 3: Document Uploads & Ayush-GCP Verification</h2>

            {/* Drag & Drop Box */}
            <div style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: '10px', 
              padding: '24px', 
              textAlign: 'center', 
              background: 'var(--code-bg)',
              cursor: 'pointer'
            }}
            onClick={() => {
              const fileName = `ICF_Version_2026_${Math.floor(Math.random()*100)}.pdf`;
              setUploadedFiles([...uploadedFiles, fileName]);
            }}
            >
              <Upload size={32} color="var(--accent)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-h)' }}>Click or Drag Protocol PDF / ICF / Investigator Brochure Here</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Supports PDF, DOCX up to 25MB (21 CFR Part 11 Encrypted)</div>
            </div>

            {/* Uploaded Files Tree */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>ATTACHED DOSSIER FILES ({uploadedFiles.length})</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14} /> {f}</span>
                    <span style={{ fontSize: '11px', color: 'var(--badge-active-text)', fontWeight: 700 }}>✓ SHA-256 Stamped</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-submission Compliance Checklist */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--badge-active-text)" /> Pre-Submission Ayush-GCP Verification Checklist
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>✓ CTRI Structure Compliant</span>
                <span>✓ Patient ICF Versioned</span>
                <span>✓ Anupana Safety Logged</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button className="btn-primary" onClick={() => setCurrentStep(2)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>&larr; Back</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Transmitting to IEC Chair...' : 'Submit Protocol to Ethics Committee'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}