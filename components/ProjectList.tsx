
import React from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  isMobile?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete, onStatusChange, isMobile = false }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.DONE: return 'bg-green-100 text-green-700 border-green-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center shadow-inner">
        <div className="text-slate-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-500 font-bold text-lg">No active projects yet.</p>
        <p className="text-slate-400 text-sm mt-1">Add your first project to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Swipe Hint */}
      {(isMobile || true) && (
        <div className="flex items-center justify-center space-x-3 text-blue-500 bg-blue-50/50 py-3 rounded-xl border border-blue-100 md:hidden animate-pulse mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest">Swipe for details</span>
        </div>
      )}

      <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden ${isMobile ? 'max-h-[600px] overflow-y-auto' : ''}`}>
        <div className="overflow-x-auto w-full">
          <table className={`w-full text-left border-collapse ${isMobile ? 'min-w-[700px]' : ''}`}>
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Lead</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Progress</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6 min-w-[250px]">
                    <div className="text-lg font-black text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">{project.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created {new Date(project.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-black text-white mr-4 shadow-lg border-2 border-white flex-shrink-0">
                        {project.owner.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{project.owner}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={project.status}
                      onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border-2 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 cursor-pointer outline-none ${getStatusColor(project.status)}`}
                    >
                      {Object.values(ProjectStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => onDelete(project.id)}
                      className="inline-flex items-center px-5 py-3 border-2 border-red-50 hover:border-red-500 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all rounded-2xl active:scale-90 whitespace-nowrap shadow-sm"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
