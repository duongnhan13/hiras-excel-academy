export type UserApprovalStatus = 'pending' | 'approved' | 'rejected';
export type UserTrackDomain = 'accounting' | 'sales' | 'inventory' | 'hr_ops';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  status?: UserApprovalStatus;
  activeDomain?: UserTrackDomain;
  createdAt?: string;
  permissions: {
    canTakeBasic: boolean;
    canTakeIntermediate: boolean;
    canTakeAdvanced: boolean;
  };
  progress?: string[];
  password?: string;
  lockOuts?: Record<string, string>;
  lockOutCounts?: Record<string, number>;
}

export interface QuizSettings {
  timeLimit: Record<string, number>;
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

interface DatabaseShape {
  users: User[];
  results: QuizResult[];
  settings: QuizSettings;
}

type MutationRequest =
  | { type: 'addUser'; payload: { user: User } }
  | { type: 'updateUserStatus'; payload: { id: string; status: UserApprovalStatus } }
  | { type: 'updateUserDomain'; payload: { id: string; activeDomain: UserTrackDomain } }
  | { type: 'updateUserPermissions'; payload: { id: string; permissions: User['permissions'] } }
  | { type: 'updateUserPassword'; payload: { id: string; password: string } }
  | { type: 'lockUser'; payload: { id: string; level: string; lockDays: number; nextCount: number; expiresAt: string } }
  | { type: 'unlockUser'; payload: { id: string; level: string } }
  | { type: 'resetUserQuizState'; payload: { id: string } }
  | { type: 'deleteUser'; payload: { id: string } }
  | { type: 'updateSettings'; payload: { settings: QuizSettings } }
  | { type: 'saveResult'; payload: { result: QuizResult } }
  | { type: 'toggleProgress'; payload: { userId: string; sectionId: string } };

const DEFAULT_USERS: User[] = [
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
];

const DEFAULT_SETTINGS: QuizSettings = {
  timeLimit: {
    Basic: 15,
    Intermediate: 30,
    Advanced: 45,
  },
};

let cachedData: DatabaseShape | null = null;
let hydrationPromise: Promise<DatabaseShape> | null = null;
let mutationChain: Promise<unknown> = Promise.resolve();

const cloneUser = (user: User): User => ({
  ...user,
  permissions: { ...user.permissions },
  progress: [...(user.progress || [])],
  lockOuts: { ...(user.lockOuts || {}) },
  lockOutCounts: { ...(user.lockOutCounts || {}) },
});

const cloneUsers = (users: User[]) => users.map(cloneUser);

const cloneResult = (result: QuizResult): QuizResult => ({ ...result });

const cloneResults = (results: QuizResult[]) => results.map(cloneResult);

const normalizeUserId = (id: string) => id.trim();

const getUserIdKey = (id: string) => normalizeUserId(id).toLocaleLowerCase('vi-VN');

const normalizeTimeLimitValue = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.round(parsed);
  return rounded >= 1 ? rounded : fallback;
};

const VI_LEVEL_LABELS: Record<string, string> = {
  'Cơ bản': 'Basic',
  'Trung cấp': 'Intermediate',
  'Nâng cao': 'Advanced',
};

const getDefaultData = (): DatabaseShape => ({
  users: cloneUsers(DEFAULT_USERS),
  results: [],
  settings: {
    timeLimit: { ...DEFAULT_SETTINGS.timeLimit },
  },
});

const normalizeApprovalStatus = (user: Partial<User>): UserApprovalStatus => {
  if (user.role === 'admin') return 'approved';
  if (user.status === 'pending' || user.status === 'approved' || user.status === 'rejected') {
    return user.status;
  }
  return 'approved';
};

const normalizeData = (raw: any): DatabaseShape => {
  const base = getDefaultData();
  const timeLimit = raw?.settings?.timeLimit || {};

  return {
    users: Array.isArray(raw?.users) && raw.users.length > 0
      ? raw.users.map((user: User) => ({
          ...cloneUser(user),
          status: normalizeApprovalStatus(user),
          permissions: {
            canTakeBasic: Boolean(user?.permissions?.canTakeBasic ?? true),
            canTakeIntermediate: Boolean(user?.permissions?.canTakeIntermediate),
            canTakeAdvanced: Boolean(user?.permissions?.canTakeAdvanced),
          },
        }))
      : base.users,
    results: Array.isArray(raw?.results) ? cloneResults(raw.results) : [],
    settings: {
      timeLimit: {
        Basic: normalizeTimeLimitValue(timeLimit.Basic ?? timeLimit['Cơ bản'], base.settings.timeLimit.Basic),
        Intermediate: normalizeTimeLimitValue(timeLimit.Intermediate ?? timeLimit['Trung cấp'], base.settings.timeLimit.Intermediate),
        Advanced: normalizeTimeLimitValue(timeLimit.Advanced ?? timeLimit['Nâng cao'], base.settings.timeLimit.Advanced),
      },
    },
  };
};

const LOCAL_FALLBACK_KEY = 'hiras_cloud_fallback_db_v2';

const readLocalFallback = (): DatabaseShape | null => {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LOCAL_FALLBACK_KEY) : null;
    return raw ? normalizeData(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeLocalFallback = (data: DatabaseShape) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(data));
    }
  } catch {
    // ignore storage quota errors
  }
};

const getCachedData = () => {
  if (!cachedData) {
    cachedData = readLocalFallback() || getDefaultData();
  }
  return cachedData;
};

const setCachedData = (data: DatabaseShape) => {
  cachedData = normalizeData(data);
  writeLocalFallback(cachedData);
  return cachedData;
};

const refreshFromServer = async () => {
  try {
    const response = await fetch('/api/db', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`GET /api/db failed with ${response.status}`);
    }
    return setCachedData(await response.json());
  } catch (error) {
    console.warn('Using local fallback DB cache because /api/db was unreachable:', error);
    return getCachedData();
  }
};

const enqueueMutation = <T>(job: () => Promise<T>) => {
  const queued = mutationChain.then(job, job);
  mutationChain = queued.then(() => undefined, () => undefined);
  return queued;
};

const mutateServer = async (request: MutationRequest) =>
  enqueueMutation(async () => {
    try {
      const response = await fetch('/api/db/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`POST /api/db/mutate failed with ${response.status}`);
      }

      return setCachedData(await response.json());
    } catch (error) {
      console.warn('Server mutation unavailable, persisted to local fallback cache:', error);
      return getCachedData();
    }
  });

const mutateServerSafely = (request: MutationRequest) => {
  void mutateServer(request).catch(async (error) => {
    console.error('Mutation failed, refreshing cache', error);
    await refreshFromServer();
  });
};

const getNormalizedResultLevel = (level: string) => VI_LEVEL_LABELS[level] || level;

const cloneData = (data: DatabaseShape): DatabaseShape => ({
  users: cloneUsers(data.users),
  results: cloneResults(data.results),
  settings: {
    timeLimit: { ...data.settings.timeLimit },
  },
});

export const DB = {
  ready: async () => {
    if (cachedData) return cachedData;
    if (!hydrationPromise) {
      hydrationPromise = refreshFromServer().finally(() => {
        hydrationPromise = null;
      });
    }
    return hydrationPromise;
  },
  refresh: async () => refreshFromServer(),
  getUsers: (): User[] => cloneUsers(getCachedData().users),
  getResults: (): QuizResult[] =>
    cloneResults(getCachedData().results).map((result) => ({
      ...result,
      level: getNormalizedResultLevel(result.level),
    })),
  getSettings: (): QuizSettings => ({
    timeLimit: { ...getCachedData().settings.timeLimit },
  }),
  getUser: (id: string): User | undefined => {
    const idKey = getUserIdKey(id);
    return DB.getUsers().find((user) => getUserIdKey(user.id) === idKey);
  },
  authenticate: (
    id: string,
    pass: string
  ): { ok: boolean; user?: User; reason?: 'invalid_credentials' | 'pending' | 'rejected' } => {
    const idKey = getUserIdKey(id);
    const user = DB.getUsers().find((item) => getUserIdKey(item.id) === idKey);
    if (!user || user.password !== pass) {
      return { ok: false, reason: 'invalid_credentials' };
    }
    const status = normalizeApprovalStatus(user);
    if (status === 'pending') {
      return { ok: false, reason: 'pending' };
    }
    if (status === 'rejected') {
      return { ok: false, reason: 'rejected' };
    }
    return { ok: true, user };
  },
  login: (id: string, pass: string): User | undefined => {
    const res = DB.authenticate(id, pass);
    return res.ok ? res.user : undefined;
  },
  getUserResults: (userId: string): QuizResult[] =>
    DB.getResults().filter((result) => result.userId === userId),
  addUser: async (user: User) => {
    const data = cloneData(getCachedData());
    const nextId = normalizeUserId(user.id);
    const nextName = user.name.trim().replace(/\s+/g, ' ');

    if (!nextId || !nextName || data.users.some((item) => getUserIdKey(item.id) === getUserIdKey(nextId))) {
      return undefined;
    }

    const nextUser = cloneUser({
      ...user,
      id: nextId,
      name: nextName,
      status: normalizeApprovalStatus(user),
      createdAt: user.createdAt || new Date().toISOString(),
      progress: user.progress || [],
      lockOuts: user.lockOuts || {},
      lockOutCounts: user.lockOutCounts || {},
    });

    data.users.push(nextUser);
    setCachedData(data);
    await mutateServer({ type: 'addUser', payload: { user: nextUser } });
    return nextUser;
  },
  updateUserStatus: async (id: string, status: UserApprovalStatus) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    data.users[index].status = status;
    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    await mutateServer({ type: 'updateUserStatus', payload: { id, status } });
    return updatedUser;
  },
  updateUserDomain: async (id: string, activeDomain: UserTrackDomain) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    data.users[index].activeDomain = activeDomain;
    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    await mutateServer({ type: 'updateUserDomain', payload: { id, activeDomain } });
    return updatedUser;
  },
  updateUserPermissions: async (id: string, permissions: User['permissions']) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    data.users[index].permissions = { ...permissions };
    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    await mutateServer({ type: 'updateUserPermissions', payload: { id, permissions: { ...permissions } } });
    return updatedUser;
  },
  updateUserPassword: async (id: string, password: string) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    data.users[index].password = password;
    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    await mutateServer({ type: 'updateUserPassword', payload: { id, password } });
    return updatedUser;
  },
  lockUser: (id: string, level: string) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return 0;

    const user = data.users[index];
    if (!user.lockOuts) user.lockOuts = {};
    if (!user.lockOutCounts) user.lockOutCounts = {};
    const currentCount = user.lockOutCounts[level] || 0;
    const nextCount = currentCount + 1;
    const lockDays = nextCount === 1 ? 1 : 3;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + lockDays);

    user.lockOutCounts[level] = nextCount;
    user.lockOuts[level] = expireDate.toISOString();
    setCachedData(data);
    mutateServerSafely({
      type: 'lockUser',
      payload: {
        id,
        level,
        lockDays,
        nextCount,
        expiresAt: expireDate.toISOString(),
      },
    });
    return lockDays;
  },
  unlockUser: (id: string, level: string) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return;

    delete data.users[index].lockOuts?.[level];
    setCachedData(data);
    mutateServerSafely({ type: 'unlockUser', payload: { id, level } });
  },
  resetUserQuizState: async (id: string) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    data.users[index].lockOuts = {};
    data.users[index].lockOutCounts = {};
    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    await mutateServer({ type: 'resetUserQuizState', payload: { id } });
    return updatedUser;
  },
  deleteUser: async (id: string) => {
    const data = cloneData(getCachedData());
    const filteredUsers = data.users.filter((user) => user.id !== id);
    if (filteredUsers.length === data.users.length) return false;

    data.users = filteredUsers;
    data.results = data.results.filter((result) => result.userId !== id);
    setCachedData(data);
    await mutateServer({ type: 'deleteUser', payload: { id } });
    return true;
  },
  updateSettings: async (settings: QuizSettings) => {
    const nextSettings: QuizSettings = {
      timeLimit: {
        Basic: normalizeTimeLimitValue(settings?.timeLimit?.Basic, DEFAULT_SETTINGS.timeLimit.Basic),
        Intermediate: normalizeTimeLimitValue(settings?.timeLimit?.Intermediate, DEFAULT_SETTINGS.timeLimit.Intermediate),
        Advanced: normalizeTimeLimitValue(settings?.timeLimit?.Advanced, DEFAULT_SETTINGS.timeLimit.Advanced),
      },
    };

    const data = cloneData(getCachedData());
    data.settings = nextSettings;
    setCachedData(data);
    await mutateServer({ type: 'updateSettings', payload: { settings: nextSettings } });
    return nextSettings;
  },
  saveResult: async (result: QuizResult) => {
    const data = cloneData(getCachedData());
    const nextResult = cloneResult(result);
    if (!data.results.some((item) => item.id === nextResult.id)) {
      data.results.push(nextResult);
    }
    setCachedData(data);
    await mutateServer({ type: 'saveResult', payload: { result: nextResult } });
    return nextResult;
  },
  toggleProgress: (userId: string, sectionId: string) => {
    const data = cloneData(getCachedData());
    const index = data.users.findIndex((user) => user.id === userId);
    if (index === -1) return undefined;

    if (!data.users[index].progress) data.users[index].progress = [];
    const progressIndex = data.users[index].progress!.indexOf(sectionId);
    if (progressIndex > -1) {
      data.users[index].progress!.splice(progressIndex, 1);
    } else {
      data.users[index].progress!.push(sectionId);
    }

    const updatedUser = cloneUser(data.users[index]);
    setCachedData(data);
    mutateServerSafely({ type: 'toggleProgress', payload: { userId, sectionId } });
    return updatedUser;
  },
};
