// Simple in-memory rate limiter for development
// In production, use Redis or similar

const rateLimitStore = new Map()

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (clientIP) {
    return clientIP
  }

  // Fallback to a default for localhost
  return '127.0.0.1'
}

export function rateLimit(maxRequests = 100, windowMs = 60 * 1000) { // 100 requests per 15 minutes
  return (request) => {
    const clientIP = getClientIP(request)
    const now = Date.now()
    const windowStart = now - windowMs

    if (!rateLimitStore.has(clientIP)) {
      rateLimitStore.set(clientIP, [])
    }

    const requests = rateLimitStore.get(clientIP)

    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    rateLimitStore.set(clientIP, validRequests)

    if (validRequests.length >= maxRequests) {
      return new Response(JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(windowMs / 1000).toString()
        }
      })
    }

    // Add current request
    validRequests.push(now)

    return null // Continue processing
  }
}

// Clean up old entries periodically (simple cleanup)
setInterval(() => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const windowStart = now - windowMs

  for (const [ip, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    if (validRequests.length === 0) {
      rateLimitStore.delete(ip)
    } else {
      rateLimitStore.set(ip, validRequests)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes