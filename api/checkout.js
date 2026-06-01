export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { name, contact } = req.body || {}
    const userName = name || 'Membro do Covil'

    const orderNsu =
      'COVIL-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
    const tag = process.env.INFINITEPAY_TAG || 'miguel-zacca'
    const host = req.headers.host || 'localhost:3000'
    const proto = host.includes('localhost') ? 'http' : 'https'

    const redirectUrl = `${proto}://${host}/?success=true`

    const ipRes = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: tag,
        redirect_url: redirectUrl,
        order_nsu: orderNsu,
        items: [
          {
            quantity: 1,
            price: 300, // 3 reais in cents
            description: `Covil - Taxa de Solicitação de Acesso`,
          },
        ],
        customer: {
          name: userName,
          email: 'contato@covil.com', // Dummy email as it's not collected
          phone: contact,
        },
      }),
    })

    if (!ipRes.ok) {
      const err = await ipRes.text()
      console.error('[Checkout] InfinitePay error:', err)
      return res.status(400).json({ error: 'Erro ao gerar pagamento' })
    }

    const ipData = await ipRes.json()
    if (!ipData.url) {
      return res.status(400).json({ error: 'URL de pagamento inválida' })
    }

    return res.status(200).json({ paymentUrl: ipData.url, orderNsu })
  } catch (error) {
    console.error('[Checkout] error:', error)
    return res.status(500).json({ error: 'Erro interno' })
  }
}
