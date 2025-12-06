import React, { useState } from 'react';
import { Wallet, ArrowRight, Lock, User, Mail, ChevronLeft, KeyRound, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

type ViewState = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'new-password';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('login');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearForm = () => {
    setError('');
    setSuccessMsg('');
    setPassword('');
    setCode('');
    setConfirmPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = authService.login(email, password);
    if (result.success) {
      onLogin();
    } else {
      setError(result.message || 'Erro ao entrar.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    const result = authService.register(name, email, password);
    if (result.success) {
      setSuccessMsg('Conta criada com sucesso! Faça login.');
      setTimeout(() => {
        clearForm();
        setView('login');
      }, 1500);
    } else {
      setError(result.message || 'Erro ao cadastrar.');
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const code = authService.sendRecoveryCode(email);
    if (code) {
      // SIMULAÇÃO DE ENVIO DE EMAIL
      alert(`[SIMULAÇÃO] Seu código de recuperação é: ${code}`);
      setView('verify-code');
    } else {
      setError('E-mail não encontrado.');
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authService.verifyCode(email, code)) {
      setView('new-password');
    } else {
      setError('Código inválido.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (authService.resetPassword(email, password)) {
      setSuccessMsg('Senha alterada com sucesso!');
      setTimeout(() => {
        clearForm();
        setView('login');
      }, 1500);
    } else {
      setError('Erro ao alterar senha.');
    }
  };

  // Render Functions
  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Email</label>
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div>
         <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="••••••••"
          />
        </div>
        <div className="flex justify-end mt-2">
            <button 
                type="button" 
                onClick={() => { clearForm(); setView('forgot-password'); }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
                Esqueceu a senha?
            </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
      >
        Entrar no Sistema
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="pt-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">Ainda não tem conta?</p>
          <button 
            type="button"
            onClick={() => { clearForm(); setView('register'); }}
            className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
          >
            Criar novo usuário
          </button>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Nome Completo</label>
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="Seu nome"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="seu@email.com"
          />
        </div>
      </div>
      <div>
         <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
      >
        <UserPlus className="w-5 h-5" />
        Cadastrar
      </button>

      <div className="pt-2 text-center">
          <button 
            type="button"
            onClick={() => { clearForm(); setView('login'); }}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar para Login
          </button>
      </div>
    </form>
  );

  const renderForgotPassword = () => (
    <form onSubmit={handleSendCode} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-2">
         <p className="text-sm text-slate-500">Digite seu e-mail para receber um código de recuperação.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Email Cadastrado</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-slate-900/20"
      >
        Enviar Código
      </button>
       <div className="pt-2 text-center">
          <button 
            type="button"
            onClick={() => { clearForm(); setView('login'); }}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" /> Cancelar
          </button>
      </div>
    </form>
  );

  const renderVerifyCode = () => (
    <form onSubmit={handleVerifyCode} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="text-center mb-2">
         <p className="text-sm text-slate-500">Um código foi enviado para <strong>{email}</strong>.</p>
         <p className="text-xs text-emerald-600 mt-1">(Verifique o alerta do navegador)</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Código de 6 dígitos</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50 tracking-widest font-mono"
            placeholder="000000"
            maxLength={6}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-900/20"
      >
        Verificar Código
      </button>
    </form>
  );

  const renderNewPassword = () => (
    <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Nova Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="Nova senha"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Confirmar Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-slate-50/50"
            placeholder="Confirmar senha"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-slate-900/20"
      >
        Alterar Senha
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-dot-pattern relative overflow-hidden font-sans">
       {/* Ambient Background Blobs */}
       <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[5%] -left-[5%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">EcoFin</h1>
          <p className="text-slate-500 text-sm mt-2">Gestão Financeira</p>
        </div>

        {error && (
            <div className="text-rose-500 text-sm text-center font-medium bg-rose-50 py-3 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
        )}

        {successMsg && (
            <div className="text-emerald-600 text-sm text-center font-medium bg-emerald-50 py-3 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
              {successMsg}
            </div>
        )}

        {view === 'login' && renderLogin()}
        {view === 'register' && renderRegister()}
        {view === 'forgot-password' && renderForgotPassword()}
        {view === 'verify-code' && renderVerifyCode()}
        {view === 'new-password' && renderNewPassword()}
        
        <div className="mt-8 text-center text-xs text-slate-400">
          Acesso Restrito &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Login;