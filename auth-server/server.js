const jsonServer = require('json-server')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

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
  const { phone, password } = req.body

  if (!phone || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const db = router.db
  const user = db.get('users').find({ phone, password }).value()

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const { password: _pw, ...safeUser } = user
  return res.status(200).json(safeUser)
})

server.use(middlewares)
server.use(router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`)
})
