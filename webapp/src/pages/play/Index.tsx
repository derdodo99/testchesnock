import { useEffect, useMemo, useState } from 'react';
import { getSpinPools, rollSpin } from '../../lib/api';
import WebApp from '@twa-dev/sdk';

type Pool = { id:number; price:number; rewards: Array<{label:string; type:string; value?:number; chance:number}> };

export default function PlayPage() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [price, setPrice] = useState<number>(25);
    const [loading, setLoading] = useState(false);
    const [last, setLast] = useState<{delta:number; label?:string; value?:number} | null>(null);

    useEffect(() => {
        WebApp.ready();
        getSpinPools().then(setPools).catch(console.error);
    }, []);

    const current = useMemo(() => pools.find(p => p.price === price), [pools, price]);

    async function onGo() {
        if (!current || loading) return;
        setLoading(true);
        try {
            const cid = `spin-${price}-${Date.now()}`;
            const res = await rollSpin(price, cid);
            setLast({ delta: res.deltaCrystals, label: res.result?.label, value: res.result?.value });
            WebApp.HapticFeedback.impactOccurred('medium');
        } catch (e) {
            console.error(e);
            WebApp.HapticFeedback.notificationOccurred('error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 12, display:'flex', gap:8 }}>
                {[25,50,100,250].map(p => (
                    <button
                        key={p}
                        onClick={() => setPrice(p)}
                        style={{
                            padding:'8px 12px',
                            borderRadius:12,
                            border: '1px solid #2c2c2c',
                            background: price===p ? '#3a6cf4' : 'transparent',
                            color: price===p ? '#fff' : '#ddd'
                        }}
                    >
                        {p} 🔷
                    </button>
                ))}
            </div>

            <div style={{
                height: 140, borderRadius:16, background:'#111',
                border:'1px solid #222', display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom: 12
            }}>
                {last
                    ? <div style={{textAlign:'center'}}>
                        <div style={{fontSize:48}}>{last.label || '🎲'}</div>
                        <div style={{color:last.delta>=0?'#67e480':'#e46767'}}>
                            {last.delta>=0 ? `+${last.delta}` : `${last.delta}`} 🔷
                        </div>
                    </div>
                    : <div style={{opacity:.6}}>Spin preview</div>}
            </div>

            <button
                onClick={onGo}
                disabled={loading}
                style={{
                    width:'100%', padding:'14px 16px', borderRadius:14,
                    border:'none', background:'#3a6cf4', color:'#fff', fontSize:16
                }}
            >
                {loading ? 'Rolling…' : `I'm lucky, Go! ${price} 🔷`}
            </button>

            <div style={{marginTop:16}}>
                <div style={{opacity:.8, marginBottom:8}}>You can win…</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
                    {(current?.rewards || []).map((r, i) => (
                        <div key={i} style={{background:'#0e0e0e', border:'1px solid #222', borderRadius:12, padding:8}}>
                            <div style={{fontSize:28, textAlign:'center'}}>{r.label}</div>
                            <div style={{fontSize:12, opacity:.8, textAlign:'center', marginTop:4}}>
                                {r.type==='crystals' ? `${r.value} 🔷` : 'gift'}
                            </div>
                            <div style={{fontSize:11, opacity:.5, textAlign:'center', marginTop:2}}>
                                {r.chance}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
