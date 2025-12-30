
import React, { useState } from 'react';
import { Project } from '../types';
import { getProjectInsights } from '../services/geminiService';

interface ProjectAIInsightsProps {
  projects: Project[];
}

const ProjectAIInsights: React.FC<ProjectAIInsightsProps> = ({ projects }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getProjectInsights(projects);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Project Assistant</h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading || projects.length === 0}
          className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Analyzing...' : 'Get Status Report'}
        </button>
      </div>
      
      {insight ? (
        <div className="bg-white/80 p-4 rounded-lg border border-white shadow-inner">
          <p className="text-sm text-gray-700 leading-relaxed italic">
            "{insight}"
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Click the button to generate an AI summary of your current project health.
        </p>
      )}
    </div>
  );
};

export default ProjectAIInsights;
