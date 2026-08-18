"use client";

import { useMemo, useState } from "react";

const games = [
  { pitcher: "Logan Gilbert", team: "SEA", opponent: "@ TEX", line: 6.5, projection: 7.2, confidence: 78 },
  { pitcher: "Framber Valdez", team: "HOU", opponent: "vs. LAA", line: 5.5, projection: 6.1, confidence: 72 },
  { pitcher: "Cole Ragans", team: "KC", opponent: "@ MIN", line: 7.5, projection: 7.1, confidence: 64 },
];

export default function Home() {
  const [k9, setK9] = useState(10.4);
  const [innings, setInnings] = useState(6.1);
  const [oppK, setOppK] = useState(24.8);
  const [recentK9, setRecentK9] = useState(11.2);
  const [handedness, setHandedness] = useState(1.03);
  const [line, setLine] = useState(6.5);
  const result = useMemo(() => {
    const base = (k9 / 9) * innings;
    const matchup = oppK / 22.4;
    const form = k9 > 0 ? Math.max(.85, Math.min(1.15, recentK9 / k9)) : 1;
    const projection = base * matchup * form * handedness;
    const edge = projection - line;
    return { projection, edge, confidence: Math.min(94, Math.round(55 + Math.abs(edge) * 10)), pick: edge >= 0 ? "OVER" : "UNDER" };
  }, [k9, innings, oppK, recentK9, handedness, line]);

  return <main>
    <nav className="topbar">
      <div className="brand"><span className="brand-mark">K</span><span>STRIKE<span className="lime">LAB</span></span></div>
      <div className="navlinks"><a className="active" href="#model">Model</a><a href="#board">Today&apos;s board</a><a href="#method">Methodology</a></div>
      <div className="live"><span /> MODEL LIVE</div>
    </nav>

    <section className="hero" id="model">
      <div className="eyebrow">PITCHER STRIKEOUT PROJECTION ENGINE</div>
      <h1>Find the edge<br />before <em>first pitch.</em></h1>
      <p className="lede">Turn pitcher form, opponent tendencies, and expected workload into one clear strikeout projection.</p>
      <div className="status-row"><span>MODEL 01</span><span className="rule" /><span>LAST CALCULATED <b>JUST NOW</b></span></div>
    </section>

    <section className="workspace">
      <div className="input-panel">
        <div className="panel-head"><div><span className="step">01</span><h2>Build the matchup</h2></div><button onClick={() => { setK9(10.4); setInnings(6.1); setOppK(24.8); setRecentK9(11.2); setHandedness(1.03); setLine(6.5); }}>RESET</button></div>
        <div className="identity"><div className="avatar">SP</div><div><label>PITCHER</label><input aria-label="Pitcher name" defaultValue="Logan Gilbert" /><small>RHP · SEATTLE</small></div></div>
        <div className="field-grid">
          <NumberField label="SEASON K/9" value={k9} setValue={setK9} step="0.1" />
          <NumberField label="EXPECTED IP" value={innings} setValue={setInnings} step="0.1" />
          <NumberField label="OPPONENT K%" value={oppK} setValue={setOppK} suffix="%" step="0.1" />
          <NumberField label="LAST 30 K/9" value={recentK9} setValue={setRecentK9} step="0.1" />
          <label className="field"><span>PLATOON ADJUSTMENT</span><select value={handedness} onChange={e => setHandedness(Number(e.target.value))}><option value="1.03">Favorable · +3%</option><option value="1">Neutral</option><option value="0.97">Unfavorable · −3%</option></select></label>
          <NumberField label="SPORTSBOOK LINE" value={line} setValue={setLine} step="0.5" />
        </div>
      </div>

      <aside className="result-panel">
        <div className="panel-head dark"><div><span className="step">02</span><h2>Model output</h2></div><span className="signal">STRONG SIGNAL</span></div>
        <div className="projection"><span>PROJECTED STRIKEOUTS</span><strong>{result.projection.toFixed(1)}</strong><div className="range">EXPECTED RANGE <b>{Math.max(0, result.projection - 1.8).toFixed(1)}—{(result.projection + 1.8).toFixed(1)}</b></div></div>
        <div className="recommendation"><div><span>MODEL LEAN</span><strong>{result.pick} {line.toFixed(1)}</strong></div><div className="edge"><span>EDGE</span><b>{result.edge >= 0 ? "+" : ""}{result.edge.toFixed(1)} K</b></div></div>
        <div className="confidence"><div><span>CONFIDENCE</span><b>{result.confidence}%</b></div><div className="meter"><i style={{ width: `${result.confidence}%` }} /></div></div>
        <p className="explain">Projection is driven by a <b>{oppK > 22.4 ? "high" : "low"} opponent strikeout rate</b>, {recentK9 >= k9 ? "positive" : "negative"} recent form, and a {handedness > 1 ? "favorable" : handedness < 1 ? "difficult" : "neutral"} platoon matchup.</p>
      </aside>
    </section>

    <section className="board" id="board">
      <div className="section-title"><div><span className="eyebrow">QUICK READ</span><h2>Today&apos;s model board</h2></div><button>VIEW ALL MATCHUPS →</button></div>
      <div className="table"><div className="tr th"><span>PITCHER</span><span>MATCHUP</span><span>LINE</span><span>PROJ.</span><span>LEAN</span><span>CONF.</span></div>
        {games.map((game, i) => <div className="tr" key={game.pitcher}><span className="pitcher"><i>{i + 1}</i><b>{game.pitcher}</b><small>{game.team}</small></span><span>{game.opponent}</span><span>{game.line.toFixed(1)}</span><span><b>{game.projection.toFixed(1)}</b></span><span className={game.projection >= game.line ? "over" : "under"}>{game.projection >= game.line ? "OVER" : "UNDER"}</span><span><b>{game.confidence}%</b></span></div>)}
      </div>
    </section>
    <section className="formula" id="method"><span className="eyebrow">CURRENT CALCULATION</span><h2>Transparent by design.</h2><p>Expected IP × season K/9 ÷ 9, adjusted for opponent strikeout rate, recent form, and platoon advantage. Your exact formula can be dropped into this calculation layer without changing the interface.</p></section>
    <footer><div className="brand"><span className="brand-mark">K</span><span>STRIKELAB</span></div><p>Projections are estimates, not guarantees. Built for informed analysis.</p><span>MODEL v0.1</span></footer>
  </main>;
}

function NumberField({ label, value, setValue, suffix, step }: { label: string; value: number; setValue: (value: number) => void; suffix?: string; step?: string }) {
  return <label className="field"><span>{label}</span><div><input type="number" value={value} step={step} onChange={e => setValue(Number(e.target.value))} /><b>{suffix}</b></div></label>;
}
