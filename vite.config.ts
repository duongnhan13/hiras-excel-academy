import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

type User = {
  id: string
  name: string
  role: 'admin' | 'user'
  status?: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  permissions: {
    canTakeBasic: boolean
    canTakeIntermediate: boolean
    canTakeAdvanced: boolean
  }
  progress?: string[]
  password?: string
  lockOuts?: Record<string, string>
  lockOutCounts?: Record<string, number>
}

type QuizResult = {
  id: string
  userId: string
  level: string
  score: number
  total: number
  date: string
  timeTaken: number
}

type QuizSettings = {
  timeLimit: Record<string, number>
}

type DatabaseShape = {
  users: User[]
  results: QuizResult[]
  settings: QuizSettings
}

type MutationRequest =
  | { type: 'addUser'; payload: { user: User } }
  | { type: 'updateUserStatus'; payload: { id: string; status: 'pending' | 'approved' | 'rejected' } }
  | { type: 'updateUserPermissions'; payload: { id: string; permissions: User['permissions'] } }
  | { type: 'updateUserPassword'; payload: { id: string; password: string } }
  | { type: 'lockUser'; payload: { id: string; level: string; lockDays: number; nextCount: number; expiresAt: string } }
  | { type: 'unlockUser'; payload: { id: string; level: string } }
  | { type: 'resetUserQuizState'; payload: { id: string } }
  | { type: 'deleteUser'; payload: { id: string } }
  | { type: 'updateSettings'; payload: { settings: QuizSettings } }
  | { type: 'saveResult'; payload: { result: QuizResult } }
  | { type: 'toggleProgress'; payload: { userId: string; sectionId: string } }

const DEFAULT_DB: DatabaseShape = {
  users: [
    {
      id: 'admin',
      name: 'Quan tri vien',
      role: 'admin',
      status: 'approved',
      permissions: { canTakeBasic: true, canTakeIntermediate: true, canTakeAdvanced: true },
      progress: [],
      password: 'admin',
      lockOuts: {},
      lockOutCounts: {},
    },
    {
      id: 'NV001',
      name: 'Nguyen Van A',
      role: 'user',
      status: 'approved',
      permissions: { canTakeBasic: true, canTakeIntermediate: false, canTakeAdvanced: false },
      progress: [],
      password: '123',
      lockOuts: {},
      lockOutCounts: {},
    },
    {
      id: 'NV002',
      name: 'Tran Thi B',
      role: 'user',
      status: 'approved',
      permissions: { canTakeBasic: true, canTakeIntermediate: true, canTakeAdvanced: false },
      progress: [],
      password: '123',
      lockOuts: {},
      lockOutCounts: {},
    },
  ],
  results: [],
  settings: {
    timeLimit: {
      Basic: 15,
      Intermediate: 30,
      Advanced: 45,
    },
  },
}

const cloneDb = (db: DatabaseShape): DatabaseShape => JSON.parse(JSON.stringify(db))

const normalizeUserId = (id: string) => id.trim()

const getUserIdKey = (id: string) => normalizeUserId(id).toLocaleLowerCase('vi-VN')

const normalizeTimeLimitValue = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  const rounded = Math.round(parsed)
  return rounded >= 1 ? rounded : fallback
}

const normalizeDb = (raw: Partial<DatabaseShape> | null | undefined): DatabaseShape => {
  const base = cloneDb(DEFAULT_DB)
  const timeLimit = raw?.settings?.timeLimit || {}
  const users = Array.isArray(raw?.users) && raw.users.length > 0 ? raw.users : base.users
  const results = Array.isArray(raw?.results) ? raw.results : base.results

  return {
    users: users.map((user) => ({
      ...user,
      status: user?.role === 'admin' ? 'approved' : (user?.status || 'approved'),
      permissions: {
        canTakeBasic: Boolean(user?.permissions?.canTakeBasic ?? true),
        canTakeIntermediate: Boolean(user?.permissions?.canTakeIntermediate),
        canTakeAdvanced: Boolean(user?.permissions?.canTakeAdvanced),
      },
      progress: Array.isArray(user?.progress) ? user.progress : [],
      lockOuts: user?.lockOuts ? { ...user.lockOuts } : {},
      lockOutCounts: user?.lockOutCounts ? { ...user.lockOutCounts } : {},
    })),
    results: results.map((result) => ({ ...result })),
    settings: {
      timeLimit: {
        Basic: normalizeTimeLimitValue(timeLimit.Basic, base.settings.timeLimit.Basic),
        Intermediate: normalizeTimeLimitValue(timeLimit.Intermediate, base.settings.timeLimit.Intermediate),
        Advanced: normalizeTimeLimitValue(timeLimit.Advanced, base.settings.timeLimit.Advanced),
      },
    },
  }
}

const ensureDbFile = (dbPath: string) => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, `${JSON.stringify(DEFAULT_DB, null, 2)}\n`, 'utf8')
  }
}

const readDb = (dbPath: string) => {
  ensureDbFile(dbPath)
  const raw = fs.readFileSync(dbPath, 'utf-8')
  return normalizeDb(JSON.parse(raw))
}

const writeDb = (dbPath: string, db: DatabaseShape) => {
  const tempPath = `${dbPath}.tmp`
  fs.writeFileSync(tempPath, `${JSON.stringify(normalizeDb(db), null, 2)}\n`, 'utf8')
  fs.renameSync(tempPath, dbPath)
}

const readJsonBody = (req: any) =>
  new Promise<any>((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })

const applyMutation = (db: DatabaseShape, request: MutationRequest) => {
  const nextDb = normalizeDb(db)

  switch (request.type) {
    case 'addUser': {
      const id = normalizeUserId(request.payload.user.id)
      const name = request.payload.user.name.trim().replace(/\s+/g, ' ')

      if (id && name && !nextDb.users.some((user) => getUserIdKey(user.id) === getUserIdKey(id))) {
        nextDb.users.push({
          ...request.payload.user,
          id,
          name,
          status: request.payload.user.status || 'approved',
          createdAt: request.payload.user.createdAt || new Date().toISOString(),
          progress: [...(request.payload.user.progress || [])],
          lockOuts: { ...(request.payload.user.lockOuts || {}) },
          lockOutCounts: { ...(request.payload.user.lockOutCounts || {}) },
        })
      }
      break
    }
    case 'updateUserStatus': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user && user.role !== 'admin') {
        user.status = request.payload.status
      }
      break
    }
    case 'updateUserPermissions': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user) {
        user.permissions = { ...request.payload.permissions }
      }
      break
    }
    case 'updateUserPassword': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user) {
        user.password = request.payload.password
      }
      break
    }
    case 'lockUser': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user) {
        user.lockOuts = user.lockOuts || {}
        user.lockOutCounts = user.lockOutCounts || {}
        user.lockOutCounts[request.payload.level] = request.payload.nextCount
        user.lockOuts[request.payload.level] = request.payload.expiresAt
      }
      break
    }
    case 'unlockUser': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user?.lockOuts) {
        delete user.lockOuts[request.payload.level]
      }
      break
    }
    case 'resetUserQuizState': {
      const user = nextDb.users.find((item) => item.id === request.payload.id)
      if (user) {
        user.lockOuts = {}
        user.lockOutCounts = {}
      }
      break
    }
    case 'deleteUser': {
      nextDb.users = nextDb.users.filter((user) => user.id !== request.payload.id)
      nextDb.results = nextDb.results.filter((result) => result.userId !== request.payload.id)
      break
    }
    case 'updateSettings': {
      nextDb.settings = {
        timeLimit: {
          Basic: normalizeTimeLimitValue(request.payload.settings?.timeLimit?.Basic, DEFAULT_DB.settings.timeLimit.Basic),
          Intermediate: normalizeTimeLimitValue(request.payload.settings?.timeLimit?.Intermediate, DEFAULT_DB.settings.timeLimit.Intermediate),
          Advanced: normalizeTimeLimitValue(request.payload.settings?.timeLimit?.Advanced, DEFAULT_DB.settings.timeLimit.Advanced),
        },
      }
      break
    }
    case 'saveResult': {
      if (!nextDb.results.some((result) => result.id === request.payload.result.id)) {
        nextDb.results.push({ ...request.payload.result })
      }
      break
    }
    case 'toggleProgress': {
      const user = nextDb.users.find((item) => item.id === request.payload.userId)
      if (user) {
        user.progress = Array.isArray(user.progress) ? user.progress : []
        const progressIndex = user.progress.indexOf(request.payload.sectionId)
        if (progressIndex > -1) {
          user.progress.splice(progressIndex, 1)
        } else {
          user.progress.push(request.payload.sectionId)
        }
      }
      break
    }
    default:
      break
  }

  return normalizeDb(nextDb)
}

const mockApiPlugin = () => ({
  name: 'mock-api',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (!req.url || !req.url.startsWith('/api/db')) {
        next()
        return
      }

      const dbPath = path.resolve('db.json')

      if (req.url === '/api/db' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(readDb(dbPath)))
        return
      }

      if (req.url === '/api/db/mutate' && req.method === 'POST') {
        try {
          const request = (await readJsonBody(req)) as MutationRequest
          const currentDb = readDb(dbPath)
          const nextDb = applyMutation(currentDb, request)
          writeDb(dbPath, nextDb)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(nextDb))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Mutation failed', error: String(error) }))
        }
        return
      }

      if (req.url === '/api/db' && req.method === 'POST') {
        try {
          const nextDb = normalizeDb(await readJsonBody(req))
          writeDb(dbPath, nextDb)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(nextDb))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Replace failed', error: String(error) }))
        }
        return
      }

      next()
    })
  },
})

export default defineConfig({
  plugins: [mockApiPlugin()],
  server: {
    host: true,
    port: 5200,
    strictPort: true,
  },
})
