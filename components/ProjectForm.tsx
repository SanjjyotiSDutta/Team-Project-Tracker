
import React, { useState } from 'react';
import { ProjectStatus } from '../types';
import { getProjectPreview } from '../services/geminiService';

interface ProjectFormProps {
  onAddProject: (name: string, owner: string, status: ProjectStatus) => void;
  isMobile?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onAddProject, isMobile = false }) => {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.NOT_STARTED);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && owner.trim()) {
      onAddProject(name, owner, status);
      setName('');
      setOwner('');
      setStatus(ProjectStatus.NOT_STARTED);
      setSuggestions(null);
    }
  };

  const handlePreview = async () => {
    if (!name.trim() || !owner.trim()) return;
    setLoadingPreview(true);
    const result = await getProjectPreview(name, owner, status);
    setSuggestions(result);
    setLoadingPreview(false);
  };

  const inputClasses = `w-full ${isMobile ? 'px-7 py-6 text-xl' : 'px-4 py-3'} border-2 border-slate-100 rounded-2xl bg-white text-slate-700 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm font-medium placeholder-slate-300`;
  const labelClasses = `${isMobile ? 'text-sm' : 'text-xs'} font-black text-slate-500 uppercase tracking-widest mb-3 ml-1 block`;

  const isFormValid = name.trim() !== '' && owner.trim() !== '';

  return (
    <div className={`bg-white ${isMobile ? 'p-8 -translate-y-4' : 'p-8 -translate-y-6'} rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 mb-12 transform`}>
      <div className="flex items-center mb-8">
        <div className="h-8 w-1.5 bg-blue-600 rounded-full mr-3"></div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">New Project Entry</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-3' : ''} gap-8 items-end`}>
          <div>
            <label className={labelClasses}>Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="Design Audit..."
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Project Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={inputClasses}
              placeholder="Full Name..."
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className={inputClasses}
            >
              {Object.values(ProjectStatus).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Suggestions Area */}
        {suggestions && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest italic">AI Preview Logic</span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {suggestions}
            </div>
          </div>
        )}

        <div className={`flex flex-col ${!isMobile ? 'md:flex-row' : ''} gap-4 pt-4`}>
          <button
            type="submit"
            className={`flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest ${isMobile ? 'py-6 text-xl' : 'py-4'} px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 active:scale-95`}
          >
            Commit Project
          </button>
          <button
            type="button"
            onClick={handlePreview}
            disabled={!isFormValid || loadingPreview}
            className={`flex-1 border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 text-slate-500 font-black uppercase tracking-widest ${isMobile ? 'py-6 text-xl' : 'py-4'} px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3`}
          >
            {loadingPreview ? (
              <>
                <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Preview AI
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
