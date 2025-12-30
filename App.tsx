
import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectStatus } from './types';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectAIInsights from './components/ProjectAIInsights';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('team_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    localStorage.setItem('team_projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (name: string, owner: string, status: ProjectStatus) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      owner,
      status,
      createdAt: Date.now(),
    };
    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: ProjectStatus) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.owner.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
    done: projects.filter(p => p.status === ProjectStatus.DONE).length
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out bg-slate-100 py-0 md:py-8 ${isMobileView ? 'flex items-center justify-center' : ''}`}>
      <div className={`transition-all duration-700 ease-in-out bg-slate-50 relative ${isMobileView ? 'w-full max-w-[420px] h-[850px] overflow-y-auto rounded-[3rem] border-[12px] border-slate-900 shadow-[0_0_0_4px_#475569,0_32px_64px_-12px_rgba(0,0,0,0.5)] scrollbar-hide' : 'w-full max-w-7xl mx-auto min-h-screen'}`}>
        
        {/* Header with Dark Blue Gradient */}
        <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-white/10 sticky top-0 z-50 shadow-xl overflow-hidden">
          <div className={`max-w-6xl mx-auto px-6 h-20 flex items-center justify-between`}>
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-md h-10 w-10 rounded-xl flex items-center justify-center mr-3 border border-white/20 shadow-inner">
                <span className="text-white font-black text-2xl">T</span>
              </div>
              {(!isMobileView || true) && <h1 className="text-xl font-black text-white tracking-tight uppercase">TeamFlow</h1>}
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMobileView(!isMobileView)}
                className="group relative bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2.5 px-4 rounded-full border border-white/20 flex items-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <div className={`absolute inset-0 bg-white/20 rounded-full transition-all duration-500 scale-0 group-hover:scale-100`}></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isMobileView ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Desktop View</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> Mobile View</>
                  )}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`mx-auto mt-8 pb-20 ${isMobileView ? 'px-6' : 'max-w-6xl px-8'}`}>
          <div className={`mb-12 text-center ${isMobileView ? 'mb-8' : ''}`}>
            <h2 className={`${isMobileView ? 'text-4xl' : 'text-5xl md:text-6xl'} font-black text-slate-900 mb-4 tracking-tighter`}>Project Tracker</h2>
            <p className={`${isMobileView ? 'text-base' : 'text-xl'} text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed`}>
              Manage your team's initiatives with enterprise clarity.
            </p>
          </div>

          <ProjectForm onAddProject={handleAddProject} isMobile={isMobileView} />
          
          <ProjectAIInsights projects={projects} />

          <div className={`flex flex-col ${isMobileView ? 'space-y-6' : 'md:flex-row md:items-center'} justify-between gap-6 mb-8`}>
            <div className="flex items-baseline gap-4">
              <h3 className="text-2xl font-black text-slate-800">Backlog</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                {searchTerm ? `${filteredProjects.length} found` : `${projects.length} Items`}
              </span>
            </div>
            
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <ProjectList 
            projects={filteredProjects} 
            onDelete={handleDeleteProject}
            onStatusChange={handleStatusChange}
            isMobile={isMobileView}
          />
        </main>

        <footer className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest pb-12 opacity-60">
          &copy; {new Date().getFullYear()} TeamFlow Pro &bull; {isMobileView ? 'Mobile Mode' : 'Desktop Mode'}
        </footer>
      </div>
    </div>
  );
};

export default App;
