export const assumptions = {
  leagueK: 0.22117873569365706,
  pitcherPriorBF: 100,
  splitPriorPA: 300,
  last30PriorPA: 300,
  seasonWeight: 0.2,
  splitWeight: 0.5,
  last30Weight: 0.3,
  factorFloor: 0.85,
  factorCap: 1.15,
  minEV: 0.03,
  highEV: 0.08,
  kellyMultiplier: 0.25,
  kellyCap: 0.03,
};

const rows = [
["Arizona Diamondbacks",4698,903,.1922094508301405,1252,217,.1733226837060703,3446,686,.19907138711549624,1122,201,.17914438502673796],["Athletics",4678,1063,.22723386062419837,1602,398,.2484394506866417,3076,665,.21618985695708712,1004,222,.22111553784860558],["Atlanta Braves",4616,990,.21447140381282495,1657,345,.20820760410380204,2959,645,.2179790469753295,1027,225,.21908471275559882],["Baltimore Orioles",4649,1133,.24370832437083242,1406,363,.2581792318634424,3243,770,.23743447425223557,986,253,.2565922920892495],["Boston Red Sox",4647,1008,.21691413815364752,1202,258,.2146422628951747,3445,750,.21770682148040638,1117,233,.20859444941808417],["Chicago Cubs",4888,1064,.2176759410801964,1324,290,.2190332326283988,3564,774,.21717171717171718,1108,256,.23104693140794225],["Chicago White Sox",4652,1112,.23903697334479793,1372,336,.24489795918367346,3280,776,.23658536585365852,1057,259,.24503311258278146],["Cincinnati Reds",4579,1158,.2528936449006333,1044,259,.24808429118773948,3535,899,.2543140028288543,982,260,.26476578411405294],["Cleveland Guardians",4668,1017,.217866323907455,1436,324,.22562674094707522,3232,693,.21441831683168316,1048,207,.19751908396946566],["Colorado Rockies",4670,1060,.22698072805139186,1367,341,.24945135332845647,3303,719,.2176808961550106,934,208,.22269807280513917],["Detroit Tigers",4680,1059,.22628205128205128,1338,304,.22720478325859492,3342,755,.22591262716935967,1072,221,.20615671641791045],["Houston Astros",4704,1002,.21301020408163265,1165,238,.20429184549356222,3539,764,.21588019214467363,1007,205,.2035749751737835],["Kansas City Royals",4633,986,.21282106626376,1484,324,.2183288409703504,3149,662,.2102254684026675,977,203,.20777891504605936],["Los Angeles Angels",4646,1170,.25182953077916487,1279,327,.25566849100860045,3367,843,.25037125037125035,977,253,.25895598771750256],["Los Angeles Dodgers",4726,972,.20567075751163774,1465,296,.20204778156996586,3261,676,.2072983747316774,989,215,.21739130434782608],["Miami Marlins",4652,1009,.21689595872742906,1191,278,.23341729638958858,3461,731,.2112106327650968,992,231,.23286290322580644],["Milwaukee Brewers",4795,1038,.2164754953076121,1355,298,.2199261992619926,3440,740,.21511627906976744,1050,254,.2419047619047619],["Minnesota Twins",4698,1012,.21541081311196253,1416,318,.2245762711864407,3283,694,.2113920194943649,1017,216,.21238938053097345],["New York Mets",4664,1057,.2266295025728988,1317,305,.23158694001518604,3347,752,.22467881685091126,1031,260,.2521823472356935],["New York Yankees",4576,1123,.24541083916083917,1572,390,.2480916030534351,3004,733,.24400798934753662,974,256,.26283367556468173],["Philadelphia Phillies",4655,1062,.22814178302900107,1418,334,.23554301833568406,3237,728,.2248995983935743,1029,211,.20505344995140914],["Pittsburgh Pirates",4866,1177,.24188244965063707,1439,370,.2571230020847811,3427,807,.23548292967610154,1045,270,.2583732057416268],["San Diego Padres",4606,1006,.21841076856274425,1156,253,.21885813148788927,3450,753,.2182608695652174,1077,200,.18570102135561745],["Seattle Mariners",4622,1061,.22955430549545652,1416,339,.23940677966101695,3206,722,.2252027448533999,999,220,.22022022022022023],["San Francisco Giants",4598,960,.20878642888212265,1273,290,.22780832678711704,3325,670,.20150375939849624,999,217,.2172172172172172],["St. Louis Cardinals",4644,943,.20305770887166236,1407,255,.1812366737739872,3237,688,.21254247760271858,1052,208,.19771863117870722],["Tampa Bay Rays",4621,865,.1871889201471543,1430,263,.1839160839160839,3191,602,.18865559385772485,1067,193,.18088097469540768],["Texas Rangers",4627,1054,.22779338664361357,1216,300,.24671052631578946,3410,754,.22111436950146626,1028,249,.24221789883268482],["Toronto Blue Jays",4647,911,.19604045620830643,1338,282,.21076233183856502,3309,629,.19008763977032336,1075,210,.19534883720930232],["Washington Nationals",4830,1042,.21573498964803312,1486,351,.23620457604306863,3344,691,.20663875598086123,1093,243,.222323879231473]
] as const;

export const teams = rows.map(r => r[0]);

function poissonCdf(k: number, lambda: number) {
  let term = Math.exp(-lambda), sum = term;
  for (let i = 1; i <= k; i++) { term *= lambda / i; sum += term; }
  return sum;
}

export type CustomOpponent = {team:string;season_pa:number;season_so:number;vs_l_pa:number;vs_l_so:number;vs_r_pa:number;vs_r_so:number;last_30_pa:number;last_30_so:number};
export function calculateModel(input: { tbf:number; strikeouts:number; bfPerIp:number; projectedIp:number; opponent:string; hand:"L"|"R"; line:number; overOdds:number; underOdds:number; context:number; profile?:CustomOpponent }) {
  const a = assumptions;
  const r = rows.find(row => row[0] === input.opponent) ?? rows[0];
  const rawPitcherK = input.tbf ? input.strikeouts / input.tbf : 0;
  const adjustedPitcherK = (input.tbf * rawPitcherK + a.pitcherPriorBF * a.leagueK) / (input.tbf + a.pitcherPriorBF);
  const seasonK = input.profile ? input.profile.season_so/input.profile.season_pa : r[3];
  const splitPA = input.profile ? (input.hand === "L" ? input.profile.vs_l_pa : input.profile.vs_r_pa) : (input.hand === "L" ? r[4] : r[7]);
  const splitK = input.profile ? (input.hand === "L" ? input.profile.vs_l_so/input.profile.vs_l_pa : input.profile.vs_r_so/input.profile.vs_r_pa) : (input.hand === "L" ? r[6] : r[9]);
  const regressedSplitK = (splitPA * splitK + a.splitPriorPA * seasonK) / (splitPA + a.splitPriorPA);
  const last30PA = input.profile?.last_30_pa ?? r[10], last30K = input.profile ? input.profile.last_30_so/input.profile.last_30_pa : r[12];
  const regressedLast30K = (last30PA * last30K + a.last30PriorPA * seasonK) / (last30PA + a.last30PriorPA);
  const opponentProfileK = a.seasonWeight * seasonK + a.splitWeight * regressedSplitK + a.last30Weight * regressedLast30K;
  const opponentFactor = Math.min(a.factorCap, Math.max(a.factorFloor, opponentProfileK / a.leagueK));
  const matchupK = adjustedPitcherK * opponentFactor;
  const projectedBF = input.projectedIp * input.bfPerIp;
  const expectedKs = matchupK * input.context * projectedBF;
  const overProbability = 1 - poissonCdf(Math.floor(input.line), expectedKs);
  const overEV = overProbability * input.overOdds - 1;
  const underEV = (1 - overProbability) * input.underOdds - 1;
  const recommendation = overEV >= a.minEV && overEV >= underEV ? "Over Lean" : underEV >= a.minEV && underEV > overEV ? "Under Lean" : "No Play";
  const bestEV = recommendation === "Over Lean" ? overEV : recommendation === "Under Lean" ? underEV : Math.max(overEV, underEV);
  const confidence = recommendation === "No Play" ? "—" : bestEV >= a.highEV ? "High" : "Medium";
  const selectedOdds = recommendation === "Over Lean" ? input.overOdds : input.underOdds;
  const kelly = recommendation === "No Play" ? 0 : Math.min(a.kellyCap, Math.max(0, bestEV / (selectedOdds - 1) * a.kellyMultiplier));
  return { rawPitcherK, adjustedPitcherK, seasonK, regressedSplitK, regressedLast30K, opponentProfileK, opponentFactor, matchupK, projectedBF, expectedKs, edge: expectedKs-input.line, overProbability, overEV, underEV, recommendation, confidence, kelly };
}
