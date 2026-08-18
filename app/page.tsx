"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateModel, teams } from "./model";
import { DataManager, type Game, type Opponent, type Pitcher } from "./data-manager";

const games = [
  { pitcher: "Logan Gilbert", team: "SEA", opponent: "@ TEX", line: 6.5, projection: 7.2, confidence: 78 },
  { pitcher: "Framber Valdez", team: "HOU", opponent: "vs. LAA", line: 5.5, projection: 6.1, confidence: 72 },
  { pitcher: "Cole Ragans", team: "KC", opponent: "@ MIN", line: 7.5, projection: 7.1, confidence: 64 },
];

export default function Home() {
  const [opponents,setOpponents]=useState<Opponent[]>([]),[pitchers,setPitchers]=useState<Pitcher[]>([]),[schedule,setSchedule]=useState<Game[]>([]);
  const refresh=useCallback(async()=>{try{const r=await fetch("/api/data");if(!r.ok)return;const d=await r.json() as {opponents:Opponent[];pitchers:Pitcher[];games:Game[]};setOpponents(d.opponents);setPitchers(d.pitchers);setSchedule(d.games)}catch{}},[]);
  useEffect(()=>{refresh()},[refresh]);
  const [tbf, setTbf] = useState(409), [strikeouts, setStrikeouts] = useState(91);
  const [bfPerIp, setBfPerIp] = useState(4.1313), [projectedIp, setProjectedIp] = useState(5.72);
  const [opponent, setOpponent] = useState("Baltimore Orioles"), [hand, setHand] = useState<"L"|"R">("L");
  const [line, setLine] = useState(4.5), [overOdds, setOverOdds] = useState(1.64), [underOdds, setUnderOdds] = useState(1.94), [context, setContext] = useState(1);
  const profile=opponents.find(o=>o.team===opponent);
  const allTeams=Array.from(new Set([...teams,...opponents.map(o=>o.team)])).sort();
  const result = useMemo(() => calculateModel({tbf,strikeouts,bfPerIp,projectedIp,opponent,hand,line,overOdds,underOdds,context,profile}), [tbf,strikeouts,bfPerIp,projectedIp,opponent,hand,line,overOdds,underOdds,context,profile]);
  const applyPitcher=(name:string)=>{const p=pitchers.find(x=>x.name===name);if(!p)return;setTbf(p.tbf);setStrikeouts(p.strikeouts);setBfPerIp(p.bf_per_ip);setProjectedIp(p.projected_ip);setContext(p.context);setHand(p.hand)};
  const applyGame=(id:string)=>{const g=schedule.find(x=>x.id===Number(id));if(!g)return;setLine(g.k_line);setOverOdds(g.over_odds);setUnderOdds(g.under_odds)};

  return <main>
    <nav className="topbar">
      <div className="brand"><span className="brand-mark">K</span><span>STRIKE<span className="lime">LAB</span></span></div>
      <div className="navlinks"><a className="active" href="#model">Model</a><a href="#board">Today&apos;s board</a><a href="#data">Update data</a><a href="#method">Methodology</a></div>
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
        <div className="panel-head"><div><span className="step">01</span><h2>Build the matchup</h2></div><button onClick={() => {setTbf(409);setStrikeouts(91);setBfPerIp(4.1313);setProjectedIp(5.72);setOpponent("Baltimore Orioles");setHand("L");setLine(4.5);setOverOdds(1.64);setUnderOdds(1.94);setContext(1)}}>RESET</button></div>
        <div className="identity"><div className="avatar">SP</div><div><label>PITCHER</label><input aria-label="Pitcher name" defaultValue="Shane McClanahan" /><small>{hand}HP · CUSTOM MATCHUP</small></div></div>
        {(pitchers.length>0||schedule.length>0)&&<div className="quick-load">{pitchers.length>0&&<label><span>LOAD SAVED PITCHER</span><select defaultValue="" onChange={e=>applyPitcher(e.target.value)}><option value="" disabled>Select pitcher…</option>{pitchers.map(p=><option key={p.id}>{p.name}</option>)}</select></label>}{schedule.length>0&&<label><span>LOAD SCHEDULE PRICES</span><select defaultValue="" onChange={e=>applyGame(e.target.value)}><option value="" disabled>Select game…</option>{schedule.map(g=><option key={g.id} value={g.id}>{g.away_team} @ {g.home_team}</option>)}</select></label>}</div>}
        <div className="field-grid">
          <NumberField label="BATTERS FACED (TBF)" value={tbf} setValue={setTbf} step="1" />
          <NumberField label="STRIKEOUTS (SO)" value={strikeouts} setValue={setStrikeouts} step="1" />
          <NumberField label="BF PER INNING" value={bfPerIp} setValue={setBfPerIp} step="0.01" />
          <NumberField label="PROJECTED IP" value={projectedIp} setValue={setProjectedIp} step="0.1" />
          <label className="field"><span>OPPONENT</span><select value={opponent} onChange={e => setOpponent(e.target.value)}>{allTeams.map(team=><option key={team}>{team}</option>)}</select></label>
          <label className="field"><span>PITCHER HAND</span><select value={hand} onChange={e => setHand(e.target.value as "L"|"R")}><option value="L">Left-handed</option><option value="R">Right-handed</option></select></label>
          <NumberField label="SPORTSBOOK LINE" value={line} setValue={setLine} step="0.5" />
          <NumberField label="OVER ODDS (DECIMAL)" value={overOdds} setValue={setOverOdds} step="0.01" />
          <NumberField label="UNDER ODDS (DECIMAL)" value={underOdds} setValue={setUnderOdds} step="0.01" />
          <NumberField label="CONTEXT FACTOR" value={context} setValue={setContext} step="0.01" />
        </div>
      </div>

      <aside className="result-panel">
        <div className="panel-head dark"><div><span className="step">02</span><h2>Model output</h2></div><span className="signal">STRONG SIGNAL</span></div>
        <div className="projection"><span>PROJECTED STRIKEOUTS</span><strong>{result.expectedKs.toFixed(2)}</strong><div className="range">MODEL OVER PROBABILITY <b>{(result.overProbability*100).toFixed(1)}%</b></div></div>
        <div className="recommendation"><div><span>MODEL DECISION</span><strong>{result.recommendation.toUpperCase()}</strong></div><div className="edge"><span>EDGE VS LINE</span><b>{result.edge >= 0 ? "+" : ""}{result.edge.toFixed(2)} K</b></div></div>
        <div className="confidence"><div><span>CONFIDENCE · {result.confidence}</span><b>{(result.kelly*100).toFixed(2)}% stake</b></div><div className="meter"><i style={{ width: `${Math.min(100,Math.max(0,result.kelly/.03*100))}%` }} /></div></div>
        <p className="explain"><b>{(result.matchupK*100).toFixed(2)}% matchup K rate</b> after pitcher regression and a {result.opponentFactor.toFixed(3)}× opponent factor. Over EV: {(result.overEV*100).toFixed(1)}% · Under EV: {(result.underEV*100).toFixed(1)}%.</p>
      </aside>
    </section>

    <section className="board" id="board">
      <div className="section-title"><div><span className="eyebrow">QUICK READ</span><h2>Today&apos;s model board</h2></div><button>VIEW ALL MATCHUPS →</button></div>
      <div className="table"><div className="tr th"><span>PITCHER</span><span>MATCHUP</span><span>LINE</span><span>PROJ.</span><span>LEAN</span><span>CONF.</span></div>
        {games.map((game, i) => <div className="tr" key={game.pitcher}><span className="pitcher"><i>{i + 1}</i><b>{game.pitcher}</b><small>{game.team}</small></span><span>{game.opponent}</span><span>{game.line.toFixed(1)}</span><span><b>{game.projection.toFixed(1)}</b></span><span className={game.projection >= game.line ? "over" : "under"}>{game.projection >= game.line ? "OVER" : "UNDER"}</span><span><b>{game.confidence}%</b></span></div>)}
      </div>
    </section>
    <DataManager opponents={opponents} pitchers={pitchers} games={schedule} onRefresh={refresh}/>
    <section className="formula" id="method"><span className="eyebrow">WORKBOOK MODEL v2</span><h2>Transparent by design.</h2><p>Pitcher K% is regressed toward the league using batters faced. The opponent profile blends season rate, stabilized handedness split, and stabilized last-30 form. The matchup rate is multiplied by projected batters faced, then a Poisson distribution converts expected Ks into prop probability, EV, and quarter-Kelly stake.</p></section>
    <footer><div className="brand"><span className="brand-mark">K</span><span>STRIKELAB</span></div><p>Projections are estimates, not guarantees. Built for informed analysis.</p><span>MODEL v0.1</span></footer>
  </main>;
}

function NumberField({ label, value, setValue, suffix, step }: { label: string; value: number; setValue: (value: number) => void; suffix?: string; step?: string }) {
  return <label className="field"><span>{label}</span><div><input type="number" value={value} step={step} onChange={e => setValue(Number(e.target.value))} /><b>{suffix}</b></div></label>;
}
