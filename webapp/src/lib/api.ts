import WebApp from '@twa-dev/sdk';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
    const initData = WebApp?.initData || '';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return {
        'Content-Type': 'application/json',
        'X-TG-INIT-DATA': initData,
        'X-CLIENT-UA': ua,
    };
}

export async function getSpinPools() {
    const res = await fetch(`${API}/api/v1/spins/pools`, { headers: authHeaders() });
    if (!res.ok) throw new Error('pools_failed');
    return res.json() as Promise<Array<{ id:number; price:number; rewards:any[] }>>;
}

export async function rollSpin(price: number, cid?: string) {
    const res = await fetch(`${API}/api/v1/spins/roll`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ price, cid }),
    });
    if (!res.ok) throw new Error('roll_failed');
    return res.json() as Promise<{ rollId:number; result:any; deltaCrystals:number; balance:number }>;
}
