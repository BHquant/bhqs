import { useEffect } from 'react'
export default function Index() {
  useEffect(()=>{ window.location.href='/login' }, [])
  return null
}
