import React, { useState, useRef } from 'react';
import { useStudents } from '../context/StudentContext';
import { useNotification } from '../context/NotificationContext';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ArrowRight, 
  RefreshCw, 
  FileSpreadsheet, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { sampleCsvTemplateContent } from '../services/mockData';
import confetti from 'canvas-confetti';

interface UploadCsvPageProps {
  onNavigate: (page: string, studentId?: number) => void;
}

export const UploadCsvPage: React.FC<UploadCsvPageProps> = ({ onNavigate }) => {
  const { uploadCsvData } = useStudents();
  const { showToast } = useNotification();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setErrorMsg(null);
    setUploadResult(null);

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Invalid file format. Only .CSV files are accepted by EarlyFlag.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File exceeds 5MB limit. Please upload a smaller dataset.');
      return;
    }

    setSelectedFile(file);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setUploadProgress(15);
    setProcessingStage('Uploading student attendance and marks batch...');

    try {
      // Stage 1: Upload
      await new Promise(r => setTimeout(r, 600));
      setUploadProgress(45);
      setProcessingStage('Parsing records & comparing 14-day rolling attendance...');

      // Stage 2: Signal Analysis
      await new Promise(r => setTimeout(r, 600));
      setUploadProgress(75);
      setProcessingStage('Computing multi-signal risk scores and explainable triggers...');

      // Stage 3: Complete
      const result = await uploadCsvData(selectedFile);
      setUploadProgress(100);
      setProcessingStage('Risk snapshot updated successfully!');
      setUploadResult(result);

      // Trigger light confetti celebration on success
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to process CSV file. Please verify column formatting.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsvTemplateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'earlyflag_student_data_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'info', message: 'Template CSV downloaded successfully.' });
  };

  const handleQuickLoadSampleCsv = () => {
    const sampleBlob = new Blob([sampleCsvTemplateContent], { type: 'text/csv' });
    const sampleFile = new File([sampleBlob], 'earlyflag_term2_demo_batch.csv', { type: 'text/csv' });
    handleFileSelected(sampleFile);
    showToast({
      type: 'info',
      title: 'Sample CSV Loaded',
      message: 'Click "Start Processing" to compute risk scores.'
    });
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setErrorMsg(null);
    setUploadProgress(0);
    setProcessingStage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="page-content animate-fade">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Upload Student Data', active: true }
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Upload Student Academic Data
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Upload raw attendance, term marks, and engagement CSV files to compute fresh 4-signal explainable risk scores.
        </p>
      </div>

      {/* Main Upload Area Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: Drag & Drop Dropzone */}
        <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Select or Drop CSV Dataset
              </h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleQuickLoadSampleCsv}
                style={{ fontSize: '0.75rem', gap: '0.35rem' }}
              >
                <Sparkles size={13} color="var(--brand-primary-light)" />
                <span>Quick-Load Demo CSV</span>
              </button>
            </div>

            {/* Drop Zone Box */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--brand-primary-light)' : selectedFile ? 'var(--risk-low)' : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-lg)',
                background: dragActive ? 'var(--brand-primary-soft)' : 'var(--bg-subtle)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelected(e.target.files[0]);
                  }
                }}
              />

              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: selectedFile ? 'var(--risk-low-bg)' : 'var(--brand-primary-soft)',
                  color: selectedFile ? 'var(--risk-low)' : 'var(--brand-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                {selectedFile ? <FileSpreadsheet size={28} /> : <UploadCloud size={28} />}
              </div>

              {selectedFile ? (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB • CSV Format Ready
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    Drag & Drop your CSV file here
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 1rem auto' }}>
                    or browse files from your computer (Standard .CSV format)
                  </p>
                  <span className="btn btn-secondary btn-sm">
                    Choose CSV File
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  marginTop: '1rem',
                  background: 'var(--risk-high-bg)',
                  border: '1px solid var(--risk-high-border)',
                  color: 'var(--risk-high-text)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Upload Progress Bar (When Processing) */}
            {isProcessing && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--brand-primary-light)' }}>{processingStage}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${uploadProgress}%`,
                      background: 'var(--brand-primary-light)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Success Results Card */}
            {uploadResult && (
              <div
                style={{
                  marginTop: '1.25rem',
                  background: 'var(--risk-low-bg)',
                  border: '1px solid var(--risk-low-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  color: 'var(--risk-low-text)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Upload & Risk Computation Successful!</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: 'var(--bg-surface)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: '0.75rem 0',
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Processed</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {uploadResult.totalProcessed}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--risk-med-text)' }}>Medium Risk</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--risk-med-text)' }}>
                      {uploadResult.mediumRiskFound}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--risk-high-text)' }}>High Risk</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--risk-high-text)' }}>
                      {uploadResult.highRiskFound}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onNavigate('students')}
                >
                  <span>View Updated Students Risk List</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            {selectedFile && !uploadResult && (
              <button className="btn btn-secondary btn-sm" onClick={resetUploadState} disabled={isProcessing}>
                Cancel
              </button>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={handleStartUpload}
              disabled={!selectedFile || isProcessing || !!uploadResult}
              style={{ gap: '0.4rem' }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Computing Risk...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  <span>Process Dataset & Generate Risk Scores</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: CSV Format Guidelines & Template Downloader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Template Card */}
          <div className="ef-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FileSpreadsheet size={18} color="var(--brand-primary-light)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Download CSV Template
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Use our verified CSV schema containing standard fields for students, attendance status, subject-wise marks, fees, and engagement logs.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadTemplate} style={{ width: '100%', gap: '0.4rem' }}>
              <Download size={14} />
              <span>Download Official CSV Template (.csv)</span>
            </button>
          </div>

          {/* Schema Specs Card */}
          <div className="ef-card" style={{ background: 'var(--bg-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Required Column Headers:
            </h4>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6, margin: 0 }}>
              <li><code>student_id</code> & <code>name</code> (Student identifier)</li>
              <li><code>class</code> & <code>section</code> (e.g. 10, A)</li>
              <li><code>date</code> & <code>attendance_status</code> ('present' / 'absent')</li>
              <li><code>subject</code>, <code>term</code>, <code>marks_score</code>, <code>max_score</code></li>
              <li><code>fee_due_date</code>, <code>fee_amount</code>, <code>fee_status</code> ('paid' / 'unpaid')</li>
              <li><code>engagement_flag</code> ('disciplinary', 'disengaged', 'praise')</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
