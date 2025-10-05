import { useEffect, useMemo, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import { getJSON, postJSON } from '../lib/api'

type BalanceResp = { balance: number }

export default function Balance() {
    // пока возьмём userId из initData (или 1 для локалки)
    const userId = useMemo(() => {
        const id = WebApp?.initDataUnsafe?.user?.id
        return id ?? 1
    }, [])

    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    async function load() {
        setErr(null); setLoading(true)
        try {
            const data = await getJSON<BalanceResp>(`/wallets/${userId}`)
            setBalance(data.balance)
        } catch (e: any) {
            setErr(e.message ?? 'load error')
        } finally {
            setLoading(false)
        }
    }

    async function credit(amount: number) {
        setErr(null); setLoading(true)
        try {
            const data = await postJSON<BalanceResp>(`/wallets/${userId}/credit`, {
                amount, reason: 'promo', cid: `demo-credit-${Date.now()}`
            })
            setBalance(data.balance)
        } catch (e: any) {
            setErr(e.message ?? 'credit error')
        } finally {
            setLoading(false)
        }
    }

    async function debit(amount: number) {
        setErr(null); setLoading(true)
        try {
            const data = await postJSON<BalanceResp>(`/wallets/${userId}/debit`, {
                amount, reason: 'buyin', cid: `demo-debit-${Date.now()}`
            })
            setBalance(data.balance)
        } catch (e: any) {
            setErr(e.message ?? 'debit error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
            <h2>Баланс</h2>
            {loading && <div>Загрузка…</div>}
            {err && <div style={{ color: 'crimson' }}>{err}</div>}
            <div style={{
                padding: 16, border: '1px solid #ddd', borderRadius: 12,
                fontSize: 18, display: 'flex', alignItems: 'center', gap: 8
            }}>
                <span>Кристаллы:</span>
                <b>{balance ?? '—'}</b>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => credit(100)}>+100</button>
                <button onClick={() => credit(1000)}>+1000</button>
                <button onClick={() => debit(20)}>-20</button>
                <button onClick={() => debit(50)}>-50</button>
            </div>

            <small>
                userId: <code>{userId}</code>
            </small>
        </div>
    )
}
