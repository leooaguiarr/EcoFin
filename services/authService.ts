import { User } from '../types';

const USERS_KEY = 'ecofin_users';
const RECOVERY_CODES_KEY = 'ecofin_recovery_codes';

// Helper privado para pegar usuários salvos
const getUsers = (): User[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

// Helper privado para salvar usuários
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Login: Verifica credenciais
  login: (email: string, password: string): { success: boolean; user?: { name: string; email: string }; message?: string } => {
    // Admin backdoor (opcional, mantido por conveniência)
    if (email === 'admin' && password === 'admin') {
      return { success: true, user: { name: 'Administrador', email: 'admin' } };
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return { success: true, user: { name: user.name, email: user.email } };
    }
    return { success: false, message: 'Email ou senha incorretos.' };
  },

  // Registro: Cria novo usuário
  register: (name: string, email: string, password: string): { success: boolean; message?: string } => {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    users.push({ name, email, password });
    saveUsers(users);
    return { success: true };
  },

  // Recuperação: "Envia" código (retorna o código para ser exibido em alert)
  sendRecoveryCode: (email: string): string | null => {
    const users = getUsers();
    const userExists = users.some(u => u.email === email) || email === 'admin';

    if (!userExists) return null;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Salva código temporário
    const codes = JSON.parse(localStorage.getItem(RECOVERY_CODES_KEY) || '{}');
    codes[email] = code;
    localStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));

    return code;
  },

  // Recuperação: Verifica código
  verifyCode: (email: string, code: string): boolean => {
    const codes = JSON.parse(localStorage.getItem(RECOVERY_CODES_KEY) || '{}');
    return codes[email] === code;
  },

  // Recuperação: Redefine senha
  resetPassword: (email: string, newPassword: string): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex >= 0) {
      users[userIndex].password = newPassword;
      saveUsers(users);
      
      // Limpa código usado
      const codes = JSON.parse(localStorage.getItem(RECOVERY_CODES_KEY) || '{}');
      delete codes[email];
      localStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));
      
      return true;
    }
    return false;
  }
};