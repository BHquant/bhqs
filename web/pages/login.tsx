import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/app' : undefined }
    })
    if (error) alert(error.message); else setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="text-2xl font-semibold flex justify-between">
          <span>BH Quant System</span>
          <span className="text-sm" title="Bezrat Hashem">בע״ה</span>
        </div>
        <p className="text-slate-600 text-sm">Login with a magic link. No password needed.</p>
        <input className="w-full border rounded px-3 py-2" placeholder="you@email.com"
          value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={sendLink} className="w-full rounded bg-black text-white py-2">Send Magic Link</button>
        {sent && <p className="text-xs text-emerald-600">Check your email to continue.</p>}
      </div>
    </div>
  )
}
