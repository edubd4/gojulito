export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key')
  return !!apiKey && apiKey === process.env.N8N_API_KEY
}
