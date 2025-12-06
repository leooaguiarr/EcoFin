
import React from 'react';
import { LayoutDashboard, PlusCircle, List, Wallet, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Novo Lançamento', icon: PlusCircle },
    { id: 'list', label: 'Extrato', icon: List },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800 bg-dot-pattern relative overflow-hidden">
      
      {/* Ambient Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Top Right Greenish Blob */}
        <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        {/* Top Left Blueish Blob */}
        <div className="absolute top-[5%] -left-[5%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        {/* Bottom Center Indigo Blob */}
        <div className="absolute -bottom-[10%] left-[20%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar Mobile / Desktop */}
      <aside className="bg-slate-900/95 backdrop-blur-sm text-white w-full md:w-64 flex-shrink-0 md:h-screen sticky top-0 z-20 flex flex-col justify-between shadow-2xl border-r border-slate-800/50">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50 bg-slate-900">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">EcoFin</h1>
          </div>
          <nav className="mt-6 px-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                  <span className="font-medium tracking-wide text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800/50 bg-slate-900">
            <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sair</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
