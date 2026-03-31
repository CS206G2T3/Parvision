const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

// ── Seed data reset on every login ───────────────────────────────────────────
const SEED_FRIEND_REQUESTS = [
  { id: 1, fromUserId: 6, toUserId: 7, fromUserName: 'Rachel Tan', toUserName: 'Marcus Lee', status: 'pending', createdAt: '2026-03-28T08:30:00.000Z' },
  { id: 2, fromUserId: 2, toUserId: 7, fromUserName: 'Daniel Ng', toUserName: 'Marcus Lee', status: 'pending', createdAt: '2026-03-28T14:15:00.000Z' },
  { id: 3, fromUserId: 7, toUserId: 8, fromUserName: 'Marcus Lee', toUserName: 'Priya Sharma', status: 'pending', createdAt: '2026-03-27T11:00:00.000Z' },
  { id: 4, fromUserId: 7, toUserId: 9, fromUserName: 'Marcus Lee', toUserName: 'Alex Chen', status: 'pending', createdAt: '2026-03-27T15:00:00.000Z' },
]

const SEED_FRIENDS = [
  { id: 1, userId: 7, friendId: 3, friendName: 'Jared Yeo', createdAt: '2026-03-15T09:00:00.000Z' },
  { id: 2, userId: 3, friendId: 7, friendName: 'Marcus Lee', createdAt: '2026-03-15T09:00:00.000Z' },
  { id: 3, userId: 7, friendId: 4, friendName: 'Kevin Lim', createdAt: '2026-03-18T12:30:00.000Z' },
  { id: 4, userId: 4, friendId: 7, friendName: 'Marcus Lee', createdAt: '2026-03-18T12:30:00.000Z' },
  { id: 5, userId: 7, friendId: 5, friendName: 'Sarah Wong', createdAt: '2026-03-20T16:45:00.000Z' },
  { id: 6, userId: 5, friendId: 7, friendName: 'Marcus Lee', createdAt: '2026-03-20T16:45:00.000Z' },
]

function resetFriendsData() {
  const db = router.db
  db.set('friendRequests', SEED_FRIEND_REQUESTS.map(r => ({ ...r }))).write()
  db.set('friends', SEED_FRIENDS.map(f => ({ ...f }))).write()
}

server.use(cors())
server.use(jsonServer.bodyParser)

server.post('/register', (req, res) => {
  const { name, phone, password } = req.body

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const db = router.db
  const existing = db.get('users').find({ phone }).value()

  if (existing) {
    return res.status(409).json({ error: 'Phone number already registered' })
  }

  const users = db.get('users').value()
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1

  const newUser = {
    id: newId,
    name,
    phone,
    password,
    createdAt: new Date().toISOString(),
  }

  db.get('users').push(newUser).write()

  const { password: _pw, ...safeUser } = newUser
  return res.status(201).json(safeUser)
})

server.post('/login', (req, res) => {
  const { identifier, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const db = router.db
  const users = db.get('users').value()
  const user = users.find(u =>
    (u.phone === identifier || u.name === identifier) && u.password === password
  )

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  resetFriendsData()

  const { password: _pw, ...safeUser } = user
  return res.status(200).json(safeUser)
})

// ── Friend endpoints ─────────────────────────────────────────────────────────

server.get('/users/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase()
  if (!q) return res.json([])
  const db = router.db
  const users = db.get('users').value()
  const results = users
    .filter(u => u.name.toLowerCase().startsWith(q))
    .map(({ password, ...safe }) => safe)
  return res.json(results)
})

server.post('/friends/accept', (req, res) => {
  const { requestId } = req.body
  if (!requestId) return res.status(400).json({ error: 'Missing requestId' })
  const db = router.db
  const request = db.get('friendRequests').find({ id: requestId }).value()
  if (!request) return res.status(404).json({ error: 'Request not found' })
  if (request.status !== 'pending') return res.status(400).json({ error: 'Request is not pending' })

  db.get('friendRequests').find({ id: requestId }).assign({ status: 'accepted' }).write()

  const friends = db.get('friends').value()
  const nextId = friends.length > 0 ? Math.max(...friends.map(f => f.id)) + 1 : 1
  const now = new Date().toISOString()

  db.get('friends').push({
    id: nextId,
    userId: request.fromUserId,
    friendId: request.toUserId,
    friendName: request.toUserName,
    createdAt: now,
  }).write()

  db.get('friends').push({
    id: nextId + 1,
    userId: request.toUserId,
    friendId: request.fromUserId,
    friendName: request.fromUserName,
    createdAt: now,
  }).write()

  return res.json({ success: true })
})

server.post('/friends/reject', (req, res) => {
  const { requestId } = req.body
  if (!requestId) return res.status(400).json({ error: 'Missing requestId' })
  const db = router.db
  const request = db.get('friendRequests').find({ id: requestId }).value()
  if (!request) return res.status(404).json({ error: 'Request not found' })

  db.get('friendRequests').find({ id: requestId }).assign({ status: 'rejected' }).write()
  return res.json({ success: true })
})

server.post('/friends/remove', (req, res) => {
  const { userId, friendId } = req.body
  if (!userId || !friendId) return res.status(400).json({ error: 'Missing userId or friendId' })
  const db = router.db

  db.get('friends').remove(f => f.userId === userId && f.friendId === friendId).write()
  db.get('friends').remove(f => f.userId === friendId && f.friendId === userId).write()

  return res.json({ success: true })
})

server.use(middlewares)
server.use(router)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`)
})
