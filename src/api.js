/**
 * Configuración de API con URLs Relativas para CloudFront Reverse Proxy.
 * 
 * En CloudFront:
 *   - /index.html (y assets) -> Origen S3 (Frontend)
 *   - /api/*                 -> Origen API Gateway (Backend Lambda)
 * 
 * Al usar rutas relativas (/api/...), el navegador consulta el mismo origen
 * (https://dxxxxxx.cloudfront.net/api/...), eliminando por completo los problemas de CORS
 * y sin necesidad de comprar dominios ni pagar certificados SSL.
 */
export const API_BASE = import.meta.env.VITE_API_BASE || '/api'
export const DEFAULT_CHAT_ENDPOINT = import.meta.env.VITE_CHAT_API_URL || `${API_BASE}/chat`

async function request(method, body) {
  const res = await fetch(`${API_BASE}/user`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || `Error ${res.status}`)
    error.status = res.status
    throw error
  }

  return data
}

export function createUser({ email, name }) {
  return request('POST', name ? { email, name } : { email })
}

export function updateUser({ id, ...fields }) {
  return request('PUT', { id, ...fields })
}

/**
 * Envia un mensaje al modelo de IA Generativa alojado en AWS Lambda.
 * Usa la ruta relativa /api/chat que CloudFront redirige a API Gateway.
 * 
 * @param {Object} params
 * @param {string} params.message - Mensaje del usuario
 * @param {Array} params.history - Historial de mensajes previos
 * @param {string} [params.endpointUrl] - URL del endpoint (por defecto relativa: '/api/chat')
 * @param {boolean} [params.mockMode] - Simulación de respuesta si aún no se desplegó la Lambda
 */
export async function sendChatMessage({
  message,
  history = [],
  endpointUrl = DEFAULT_CHAT_ENDPOINT,
  mockMode = false,
}) {
  if (mockMode) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      reply: `[Modo Simulación Activo]\nRecibido: "${message}".\n\nEn producción, CloudFront interceptará la ruta relativa "${endpointUrl}" y la enviará a tu API Gateway sin errores de CORS y sin costo de dominio.`,
    }
  }

  try {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        prompt: message,
        history,
      }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const errMsg =
        data?.message ||
        data?.error ||
        `Error en API (${res.status} ${res.statusText})`
      const error = new Error(errMsg)
      error.status = res.status
      throw error
    }

    // Acepta respuestas en cualquier formato común de Lambda
    const replyText =
      data?.reply ||
      data?.response ||
      data?.answer ||
      data?.message ||
      data?.completion ||
      data?.text ||
      data?.output ||
      (typeof data === 'string' ? data : JSON.stringify(data))

    return { reply: replyText }
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar a "${endpointUrl}". Si estás en local con 'npm run dev', verifica el proxy de vite.config.js. En CloudFront, verifica que el Behavior /api/* apunte a tu API Gateway.`
      )
    }
    throw err
  }
}
