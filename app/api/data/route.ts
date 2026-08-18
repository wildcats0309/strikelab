import { ensureSchema } from "../../../db/store";

const tableFor = (entity: string) => entity === "opponents" ? "opponents" : entity === "pitchers" ? "pitchers" : entity === "games" ? "games" : null;
const fields = {
  opponents: ["team","season_pa","season_so","vs_l_pa","vs_l_so","vs_r_pa","vs_r_so","last_30_pa","last_30_so"],
  pitchers: ["name","hand","team","tbf","strikeouts","bf_per_ip","projected_ip","context"],
  games: ["game_date","away_team","home_team","away_pitcher","home_pitcher","k_line","over_odds","under_odds"],
} as const;

export async function GET() {
  try { const db = await ensureSchema(); const [opponents,pitchers,games] = await db.batch([db.prepare("SELECT * FROM opponents ORDER BY team"),db.prepare("SELECT * FROM pitchers ORDER BY name"),db.prepare("SELECT * FROM games ORDER BY game_date DESC, id DESC")]); return Response.json({opponents:opponents.results,pitchers:pitchers.results,games:games.results}); }
  catch(e){ return Response.json({error:e instanceof Error?e.message:"Unable to load data"},{status:500}); }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>; const entity=String(payload.entity??""); const table=tableFor(entity); if(!table) return Response.json({error:"Invalid data type"},{status:400});
    const allowed=fields[entity as keyof typeof fields]; const values=allowed.map(k=>payload[k]); if(values.some(v=>v===undefined||v==="")) return Response.json({error:"Complete every field"},{status:400});
    const db=await ensureSchema(); const now=new Date().toISOString(); const columns=[...allowed,"updated_at"]; const marks=columns.map(()=>"?").join(",");
    const result=await db.prepare(`INSERT INTO ${table} (${columns.join(",")}) VALUES (${marks})`).bind(...values,now).run(); return Response.json({id:result.meta.last_row_id},{status:201});
  } catch(e){ return Response.json({error:e instanceof Error?e.message:"Unable to save"},{status:500}); }
}

export async function PUT(request: Request) {
  try {
    const payload=await request.json() as Record<string,unknown>; const entity=String(payload.entity??""); const table=tableFor(entity); const id=Number(payload.id); if(!table||!id)return Response.json({error:"Invalid record"},{status:400});
    const allowed=fields[entity as keyof typeof fields]; const values=allowed.map(k=>payload[k]); const db=await ensureSchema(); const set=allowed.map(k=>`${k}=?`).join(","); await db.prepare(`UPDATE ${table} SET ${set}, updated_at=? WHERE id=?`).bind(...values,new Date().toISOString(),id).run(); return Response.json({ok:true});
  } catch(e){return Response.json({error:e instanceof Error?e.message:"Unable to update"},{status:500});}
}

export async function DELETE(request: Request) {
  try { const p=await request.json() as {entity?:string,id?:number}; const table=tableFor(p.entity??""); if(!table||!p.id)return Response.json({error:"Invalid record"},{status:400}); const db=await ensureSchema(); await db.prepare(`DELETE FROM ${table} WHERE id=?`).bind(p.id).run(); return Response.json({ok:true}); }
  catch(e){return Response.json({error:e instanceof Error?e.message:"Unable to delete"},{status:500});}
}
