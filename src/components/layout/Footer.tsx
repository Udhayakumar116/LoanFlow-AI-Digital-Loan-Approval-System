import React from 'react';
import { Shield, Server, CheckCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 sm:px-8 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-slate-300">LoanFlow Platform v1.0.0</span>
          <span className="text-slate-600">|</span>
          <span>Enterprise AI Digital Loan System</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="font-medium">Spring Boot Backend Operational</span>
          </div>

          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span>OpenAPI Swagger Docs</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
