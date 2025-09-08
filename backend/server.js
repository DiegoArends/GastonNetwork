import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Simple in-memory cache to reduce Twitch API calls
const cache = new Map()
const getCached = (key) => {
  const entry = cache.get(key)
  if (!entry) return null
  const { value, expiresAt } = entry
  if (Date.now() > expiresAt) {
    cache.delete(key)
    return null
  }
  return value
}
const setCached = (key, value, ttlMs = 60_000) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

// Helpers to call Twitch Helix API
async function getAppAccessToken(clientId, clientSecret) {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`
  const res = await fetch(url, { method: 'POST' })
  if (!res.ok) throw new Error('twitch_token_error')
  const data = await res.json()
  return data.access_token
}

async function fetchHelix(endpoint, token, clientId, params = {}) {
  const usp = new URLSearchParams(params)
  const res = await fetch(`https://api.twitch.tv/helix/${endpoint}?${usp.toString()}`, {
    headers: {
      'Client-Id': clientId,
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error('twitch_helix_error')
    err.status = res.status
    err.body = text
    throw err
  }
  return res.json()
}

// GET /api/twitch-latest?login=<channel>
// Returns: { isLive: boolean, vodId: string | null }
app.get('/api/twitch-latest', async (req, res) => {
  const login = String(req.query.login || '').trim().toLowerCase()
  if (!login) return res.status(400).json({ error: 'missing_login' })

  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'missing_twitch_credentials' })
  }

  try {
    const cacheKey = `latest:${login}`
    const cached = getCached(cacheKey)
    if (cached) return res.json(cached)

    const token = await getAppAccessToken(clientId, clientSecret)

    // Get user ID from login
    const users = await fetchHelix('users', token, clientId, { login })
    const userId = users.data?.[0]?.id
    if (!userId) return res.status(404).json({ error: 'user_not_found' })

    // 1) Is the channel live?
    const streams = await fetchHelix('streams', token, clientId, { user_id: userId })
    const isLive = Array.isArray(streams.data) && streams.data.length > 0

    let vodId = null
    if (!isLive) {
      // 2) Get latest VOD
      const videos = await fetchHelix('videos', token, clientId, {
        user_id: userId,
        first: 1,
        type: 'archive',
      })
      if (Array.isArray(videos.data) && videos.data.length > 0) {
        vodId = videos.data[0].id
      }
    }

    const payload = { isLive, vodId: vodId || null }
    setCached(cacheKey, payload, 60_000) // cache 60s
    return res.json(payload)
  } catch (err) {
    console.error('twitch_latest_error', {
      message: err?.message,
      status: err?.status,
      body: err?.body,
    })
    return res.status(502).json({ error: 'twitch_unavailable' })
  }
})

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`)
})
