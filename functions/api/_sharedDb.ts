import seedDb from '../../db.json';

export type Level = 'Basic' | 'Intermediate' | 'Advanced';
export type UserApprovalStatus = 'pending' | 'approved' | 'rejected';
export type UserTrackDomain = 'accounting' | 'sales' | 'inventory' | 'hr_ops';

export interface UserPermissions {
  canTakeBasic: boolean;
  canTakeIntermediate: boolean;
  canTakeAdvanced: boolean;
}

export interface User {
  id: string;
  name: string;
  password?: string;
  role: 'admin' | 'user';
  status?: UserApprovalStatus;
  activeDomain?: UserTrackDomain;
  createdAt?: string;
  permissions: UserPermissions;
  progress: string[];
  lockOuts?: Record<string, string>;
  lockOutCounts?: Record<string, number>;
}

export interface QuizResult {
  id: string;
  userId: string;
  level: string;
  domain?: UserTrackDomain;
  score: number;
  total: number;
  date: string;
  timeTaken: number;
}

export interface QuizSettings {
  systemName?: string;
  timeLimit: Record<string, number>;
}

export interface DbState {
  users: User[];
  results: QuizResult[];
  settings: QuizSettings;
}

export interface CloudflareEnv {
  EXCEL_DB?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

const KV_KEY = 'hiras_excel_db_v2';

const defaultSettings: QuizSettings = {
  systemName: 'Excel Academy',
  timeLimit: {
    Basic: 15,
    Intermediate: 30,
    Advanced: 45,
  },
};

const normalizeUserId = (value: string) => value.trim().toLocaleLowerCase('vi-VN');

export const normalizeSettings = (settings?: Partial<QuizSettings>): QuizSettings => {
  const rawName = typeof settings?.systemName === 'string' ? settings.systemName.trim() : '';
  return {
    systemName: rawName || defaultSettings.systemName,
    timeLimit: {
      Basic: Math.max(1, Number(settings?.timeLimit?.Basic ?? defaultSettings.timeLimit.Basic)),
      Intermediate: Math.max(1, Number(settings?.timeLimit?.Intermediate ?? defaultSettings.timeLimit.Intermediate)),
      Advanced: Math.max(1, Number(settings?.timeLimit?.Advanced ?? defaultSettings.timeLimit.Advanced)),
    },
  };
};

export const normalizeDbState = (raw?: Partial<DbState> | null): DbState => ({
  users: Array.isArray(raw?.users) && raw.users.length > 0
    ? raw.users.map((u) => ({
        ...u,
        status: u.role === 'admin' ? 'approved' : (u.status ?? 'approved'),
        progress: Array.isArray(u.progress) ? u.progress : [],
        lockOuts: u.lockOuts ? { ...u.lockOuts } : {},
        lockOutCounts: u.lockOutCounts ? { ...u.lockOutCounts } : {},
      }))
    : [
        {
          id: 'admin',
          name: 'Quản trị viên',
          role: 'admin',
          status: 'approved',
          permissions: { canTakeBasic: true, canTakeIntermediate: true, canTakeAdvanced: true },
          progress: [],
          password: 'admin',
          lockOuts: {},
          lockOutCounts: {},
        },
      ],
  results: Array.isArray(raw?.results) ? raw.results : [],
  settings: normalizeSettings(raw?.settings),
});

let memoryDbFallback: DbState = normalizeDbState(seedDb as unknown as Partial<DbState>);

export const readCloudDb = async (env: CloudflareEnv): Promise<DbState> => {
  if (env?.EXCEL_DB) {
    try {
      const raw = await env.EXCEL_DB.get(KV_KEY);
      if (raw) {
        const parsed = normalizeDbState(JSON.parse(raw) as Partial<DbState>);
        memoryDbFallback = parsed;
        return parsed;
      }
      await env.EXCEL_DB.put(KV_KEY, JSON.stringify(memoryDbFallback));
      return memoryDbFallback;
    } catch (err) {
      console.error('KV read error, falling back to memory store:', err);
    }
  }
  return memoryDbFallback;
};

export const writeCloudDb = async (env: CloudflareEnv, state: DbState): Promise<DbState> => {
  const normalized = normalizeDbState(state);
  memoryDbFallback = normalized;
  if (env?.EXCEL_DB) {
    try {
      await env.EXCEL_DB.put(KV_KEY, JSON.stringify(normalized));
    } catch (err) {
      console.error('KV write error:', err);
    }
  }
  return normalized;
};

export const applyCloudMutation = (current: DbState, request: any): DbState => {
  const next: DbState = {
    users: current.users.map((user) => ({
      ...user,
      permissions: { ...user.permissions },
      progress: Array.isArray(user.progress) ? [...user.progress] : [],
      lockOuts: { ...(user.lockOuts || {}) },
      lockOutCounts: { ...(user.lockOutCounts || {}) },
    })),
    results: current.results.map((result) => ({ ...result })),
    settings: normalizeSettings(current.settings),
  };

  const payload = request?.payload ?? request ?? {};

  switch (request?.type) {
    case 'addUser': {
      const incoming = payload.user as User | undefined;
      if (!incoming?.id || !incoming?.name) return next;
      const incomingId = normalizeUserId(incoming.id);
      if (next.users.some((item) => normalizeUserId(item.id) === incomingId)) {
        return next;
      }
      next.users.push({
        ...incoming,
        id: incoming.id.trim(),
        name: incoming.name.trim().replace(/\s+/g, ' '),
        status: incoming.role === 'admin' ? 'approved' : (incoming.status ?? 'pending'),
        createdAt: incoming.createdAt || new Date().toISOString(),
        permissions: incoming.permissions || {
          canTakeBasic: true,
          canTakeIntermediate: false,
          canTakeAdvanced: false,
        },
        progress: Array.isArray(incoming.progress) ? incoming.progress : [],
        lockOuts: incoming.lockOuts || {},
        lockOutCounts: incoming.lockOutCounts || {},
      });
      return next;
    }
    case 'updateUserStatus': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user && user.role !== 'admin' && (payload.status === 'pending' || payload.status === 'approved' || payload.status === 'rejected')) {
        user.status = payload.status;
      }
      return next;
    }
    case 'updateUserDomain': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user && payload.activeDomain) {
        user.activeDomain = payload.activeDomain;
      }
      return next;
    }
    case 'updateUserPassword': {
      const user = next.users.find((item) => item.id === payload.id);
      const nextPass = payload.password ?? payload.newPass;
      if (user && typeof nextPass === 'string' && nextPass) {
        user.password = nextPass;
      }
      return next;
    }
    case 'deleteUser': {
      next.users = next.users.filter((item) => item.id !== payload.id);
      next.results = next.results.filter((item) => item.userId !== payload.id);
      return next;
    }
    case 'updateUserPermissions': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user && payload.permissions) {
        user.permissions = {
          canTakeBasic: Boolean(payload.permissions.canTakeBasic),
          canTakeIntermediate: Boolean(payload.permissions.canTakeIntermediate),
          canTakeAdvanced: Boolean(payload.permissions.canTakeAdvanced),
        };
      }
      return next;
    }
    case 'lockUser': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user && payload.level) {
        user.lockOuts = user.lockOuts || {};
        user.lockOutCounts = user.lockOutCounts || {};
        user.lockOutCounts[payload.level] = payload.nextCount;
        user.lockOuts[payload.level] = payload.expiresAt;
      }
      return next;
    }
    case 'unlockUser': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user?.lockOuts && payload.level) {
        delete user.lockOuts[payload.level];
      }
      return next;
    }
    case 'resetUserQuizState': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user) {
        user.lockOuts = {};
        user.lockOutCounts = {};
        user.permissions = user.role === 'admin'
          ? { canTakeBasic: true, canTakeIntermediate: true, canTakeAdvanced: true }
          : { canTakeBasic: true, canTakeIntermediate: false, canTakeAdvanced: false };
      }
      next.results = next.results.filter((item) => item.userId !== payload.id);
      return next;
    }
    case 'toggleProgress': {
      const user = next.users.find((item) => item.id === payload.userId);
      const sectionId = payload.sectionId as string | undefined;
      if (user && sectionId) {
        const index = user.progress.indexOf(sectionId);
        if (index === -1) user.progress.push(sectionId);
        else user.progress.splice(index, 1);
      }
      return next;
    }
    case 'saveResult':
    case 'addResult': {
      const result = payload.result as QuizResult | undefined;
      if (!result?.userId || !result?.level) return next;
      const nextResult = {
        ...result,
        id: result.id || Date.now().toString(),
        date: result.date || new Date().toISOString(),
      };
      if (!next.results.some((item) => item.id === nextResult.id)) {
        next.results.push(nextResult);
      }
      return next;
    }
    case 'updateSettings': {
      next.settings = normalizeSettings(payload.settings);
      return next;
    }
    default:
      return next;
  }
};
