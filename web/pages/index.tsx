import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'  // <— RELATIVE path

export default function AppHome() {
  const [email, setEmail] = useState<string | null>(null)
  const [ticker, setTicker] = useState('TSLA')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])

  const runAnalysis = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker })
    })
    setResult(await res.json())
  }

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/login' }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center">BH</div>
            <b>BH Quant System</b>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">בע״ה</span>
            <span className="text-sm">{email}</span>
            <button onClick={logout} className="text-sm border px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <div className="font-semibold">Analyze Ticker</div>
          <input className="border rounded px-3 py-2 w-full" value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase())} />
          <button onClick={runAnalysis} className="rounded bg-black text-white px-4 py-2">Run Analysis</button>
          {result && <div className="text-sm text-slate-700 pt-2">
            <div>Prob Up: <b>{result.prob_up}%</b></div>
            <div>Prob Flat: <b>{result.prob_flat}%</b></div>
            <div>Prob Down: <b>{result.prob_down}%</b></div>
            <div>Target Δ7d: <b>{result.price_target_pct}%</b></div>
            <div>Model: <b>{result.model_version}</b></div>
          </div>}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/export/trades.xlsx`} className="underline">Download Trade Log (Excel)</a>
        </div>
      </div>
    </div>
  )
}
