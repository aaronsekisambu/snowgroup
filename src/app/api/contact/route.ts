import { NextResponse } from 'next/server'

// Messages from the website's forms are delivered to this inbox
const TO = process.env.CONTACT_TO || 'info@snowgroup.ltd'

// Forms send their own field names (ltf_name, name, email, tel …); this finds the usual ones
const pick = (data: Record<string, unknown>, ...keys: string[]) => {
  for (const [key, value] of Object.entries(data)) {
    if (keys.some((k) => key.toLowerCase().includes(k)) && typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c)

export async function POST(request: Request) {
  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please send the form again.' }, { status: 400 })
  }

  // a hidden field people never see: bots fill it in, so quietly accept and drop
  if (typeof data._honey === 'string' && data._honey) return NextResponse.json({ ok: true })

  const name = pick(data, 'name').slice(0, 200)
  const email = pick(data, 'email', 'mail').slice(0, 200)
  const phone = pick(data, 'tel', 'phone').slice(0, 60)
  const message = pick(data, 'message', 'msg').slice(0, 5000)

  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: 'Please add your name and an email or phone number.' }, { status: 422 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 422 })
  }

  const subject = `Website enquiry from ${name}`
  const lines = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Message', message],
  ].filter(([, value]) => value)

  try {
    // Resend, when a key is set on the server (most reliable)
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Snow Holdings Website <onboarding@resend.dev>',
          to: [TO],
          reply_to: email || undefined,
          subject,
          text: lines.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
          html: lines.map(([label, value]) => `<p><strong>${label}</strong><br>${escape(value).replace(/\n/g, '<br>')}</p>`).join(''),
        }),
      })
      if (!res.ok) throw new Error(`Resend responded ${res.status}`)
      return NextResponse.json({ ok: true })
    }

    // Otherwise FormSubmit, which needs no account: the first message asks the inbox to confirm once
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.snowgroup.ltd'
    const res = await fetch(`https://formsubmit.co/ajax/${TO}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin, Referer: `${origin}/contact` },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...(email && { _replyto: email }),
        ...Object.fromEntries(lines),
      }),
    })
    const result = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string }
    if (!res.ok || String(result.success) === 'false') throw new Error(result.message || `FormSubmit responded ${res.status}`)
    return NextResponse.json({ ok: true, note: result.message })
  } catch (error) {
    console.error('Contact form delivery failed:', error)
    return NextResponse.json(
      { error: 'We could not send your message right now. Please email info@snowgroup.ltd or message us on WhatsApp.' },
      { status: 502 },
    )
  }
}
