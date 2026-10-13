import seedDb from '../../db.json';

export type Level = 'Basic' | 'Intermediate' | 'Advanced';
export type UserApprovalStatus = 'pending' | 'approved' | 'rejected';

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
  createdAt?: string;
  permissions: UserPermissions;
  progress: string[];
  lockOuts?: Partial<Record<Level, string>>;
  lockOutCounts?: Partial<Record<Level, number>>;
}

export interface QuizResult {
  id: string;
  userId: string;
  level: Level;
  score: number;
  total: number;
  date: string;
  timeTaken: number;
}

export interface QuizSettings {
  timeLimit: Record<Level, number>;
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

const KV_KEY = 'hiras_excel_db_v1';

const defaultSettings: QuizSettings = {
  timeLimit: {
    Basic: 15,
    Intermediate: 30,
    Advanced: 45,
  },
};

const normalizeUserId = (value: string) => value.trim().toLocaleLowerCase('vi-VN');

export const normalizeSettings = (settings?: Partial<QuizSettings>): QuizSettings => ({
  timeLimit: {
    Basic: Math.max(1, Number(settings?.timeLimit?.Basic ?? defaultSettings.timeLimit.Basic)),
    Intermediate: Math.max(1, Number(settings?.timeLimit?.Intermediate ?? defaultSettings.timeLimit.Intermediate)),
    Advanced: Math.max(1, Number(settings?.timeLimit?.Advanced ?? defaultSettings.timeLimit.Advanced)),
  },
});

export const normalizeDbState = (raw?: Partial<DbState> | null): DbState => ({
  users: Array.isArray(raw?.users)
    ? raw.users.map((u) => ({
        ...u,
        status: u.role === 'admin' ? 'approved' : (u.status ?? 'approved'),
      }))
    : [],
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

export const applyCloudMutation = (current: DbState, payload: any): DbState => {
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

  switch (payload?.type) {
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
    case 'updateUserPassword': {
      const user = next.users.find((item) => item.id === payload.id);
      if (user && typeof payload.newPass === 'string' && payload.newPass) {
        user.password = payload.newPass;
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
    case 'setLockOut': {
      const user = next.users.find((item) => item.id === payload.id);
      const level = payload.level as Level | undefined;
      if (user && level) {
        user.lockOuts = user.lockOuts || {};
        user.lockOutCounts = user.lockOutCounts || {};
        if (payload.isoDate) {
          user.lockOuts[level] = payload.isoDate;
          user.lockOutCounts[level] = (user.lockOutCounts[level] || 0) + 1;
        } else {
          delete user.lockOuts[level];
          user.lockOutCounts[level] = 0;
        }
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
    case 'addResult': {
      const result = payload.result as QuizResult | undefined;
      if (!result?.userId || !result?.level) return next;
      next.results.push({
        ...result,
        id: result.id || Date.now().toString(),
        date: result.date || new Date().toISOString(),
      });
      const user = next.users.find((item) => item.id === result.userId);
      if (user && result.total > 0 && result.score / result.total >= 0.8) {
        if (result.level === 'Basic') user.permissions.canTakeIntermediate = true;
        if (result.level === 'Intermediate') user.permissions.canTakeAdvanced = true;
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
