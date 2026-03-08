import { useState } from "react";

const mono = "'IBM Plex Mono', monospace";
const sans = "'IBM Plex Sans', sans-serif";
const serif = "'Lora', Georgia, serif";

// ─── shared components ────────────────────────────────────
function CopyBtn({ text, label = "Copy" }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false),2000); }}
      style={{ display:"flex", alignItems:"center", gap:"4px",
        background: ok?"#052e16":"#111", border:`1px solid ${ok?"#16a34a":"#2a2a2a"}`,
        color: ok?"#4ade80":"#555", borderRadius:"5px", padding:"4px 10px",
        fontSize:"11px", cursor:"pointer", transition:"all .15s", fontFamily:sans, whiteSpace:"nowrap" }}>
      {ok?"✓ Copied":label}
    </button>
  );
}

function Label({ children }) {
  return <span style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.13em",
    textTransform:"uppercase", color:"#3a3a3a", fontFamily:mono }}>{children}</span>;
}

function Tag({ children, color="#1a1a1a", fg="#555" }) {
  return <span style={{ background:color, color:fg, borderRadius:"4px",
    padding:"2px 7px", fontSize:"10px", fontWeight:"700", fontFamily:mono, flexShrink:0 }}>{children}</span>;
}

function Field({ name, value, onChange, placeholder, label, required, half }) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 1" }}>
      <label style={{ display:"block", fontSize:"10px", fontWeight:"700", letterSpacing:"0.12em",
        textTransform:"uppercase", color:"#3a3a3a", marginBottom:"5px", fontFamily:mono }}>
        {label} {required && <span style={{color:"#16a34a"}}>*</span>}
      </label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:"6px",
          padding:"9px 12px", color:"#ccc", fontSize:"13px", fontFamily:mono,
          transition:"border-color .15s", outline:"none" }} />
    </div>
  );
}

function Block({ label, content, isCode }) {
  if (!content) return null;
  return (
    <div style={{ marginBottom:"18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"7px" }}>
        <Label>{label}</Label>
        <CopyBtn text={content} />
      </div>
      <div style={{ background:"#0a0a0a", border:"1px solid #1c1c1c", borderRadius:"7px",
        padding:"13px 15px", fontSize: isCode?"12px":"13.5px", color:"#bbb", lineHeight:"1.75",
        fontFamily: isCode?mono:serif, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{content}</div>
    </div>
  );
}

// ─── score ring ───────────────────────────────────────────
function ScoreRing({ score, label, color }) {
  const r = 28, c = 2*Math.PI*r;
  const pct = Math.max(0,Math.min(100,score||0));
  const dash = (pct/100)*c;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1a1a1a" strokeWidth="5"/>
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{transition:"stroke-dasharray .6s ease"}}/>
        <text x="36" y="40" textAnchor="middle" fill={color}
          style={{fontSize:"15px", fontWeight:"700", fontFamily:mono}}>{pct}</text>
      </svg>
      <span style={{ fontSize:"10px", color:"#555", fontFamily:mono, textAlign:"center", lineHeight:1.3 }}>{label}</span>
    </div>
  );
}

// ─── issue card ───────────────────────────────────────────
const SEV_COLOR = { critical:"#ef4444", high:"#f97316", medium:"#facc15", low:"#4ade80" };
const CAT_COLOR = { SEO:"#3b82f6", UX:"#a855f7", Trust:"#f97316" };

function IssueCard({ issue }) {
  const [open, setOpen] = useState(false);
  const sev = (issue.severity||"medium").toLowerCase();
  const cat = issue.category||"SEO";
  return (
    <div style={{ background:"#0a0a0a", border:"1px solid #1c1c1c", borderRadius:"7px",
      marginBottom:"8px", overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none",
        padding:"11px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"9px", textAlign:"left" }}>
        <span style={{ width:"8px", height:"8px", borderRadius:"50%", flexShrink:0,
          background: SEV_COLOR[sev]||"#666", boxShadow:`0 0 6px ${SEV_COLOR[sev]||"#666"}` }}/>
        <span style={{ fontSize:"12px", color:"#ccc", fontWeight:"500", flex:1, fontFamily:sans }}>{issue.title}</span>
        <Tag color={`${CAT_COLOR[cat]}22`} fg={CAT_COLOR[cat]||"#888"}>{cat}</Tag>
        <span style={{ fontSize:"10px", color:SEV_COLOR[sev]||"#888", fontFamily:mono,
          textTransform:"uppercase", letterSpacing:"0.1em" }}>{sev}</span>
        <span style={{ color:"#333", fontSize:"14px", fontFamily:mono }}>{open?"−":"+"}</span>
      </button>
      {open && (
        <div style={{ padding:"0 14px 14px", borderTop:"1px solid #111" }}>
          {issue.whyItMatters && <div style={{marginTop:"10px"}}>
            <Label>Why it matters</Label>
            <p style={{margin:"5px 0 0",fontSize:"12px",color:"#777",lineHeight:"1.6",fontFamily:serif}}>{issue.whyItMatters}</p>
          </div>}
          {issue.impact && <div style={{marginTop:"10px"}}>
            <Label>Impact</Label>
            <p style={{margin:"5px 0 0",fontSize:"12px",color:"#777",lineHeight:"1.6",fontFamily:serif}}>{issue.impact}</p>
          </div>}
          {issue.howToFix && <div style={{marginTop:"10px"}}>
            <Label>How to fix</Label>
            <p style={{margin:"5px 0 0",fontSize:"12px",color:"#4ade80",lineHeight:"1.6",fontFamily:mono}}>{issue.howToFix}</p>
          </div>}
        </div>
      )}
    </div>
  );
}

// ─── GENERATOR ────────────────────────────────────────────
function Generator() {
  const [form, setForm] = useState({
    businessName:"", city:"", state:"", phone:"",
    industry:"", services:"", neighborhoods:"", nearbyAreas:"", localLandmarks:""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [subTab, setSubTab] = useState("sections");

  const onChange = (e) => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const generate = async () => {
    if (!form.city || !form.businessName || !form.industry) return;
    setLoading(true); setError(null); setResult(null);

    const prompt = `You are an expert local SEO copywriter. Write professional, direct, trustworthy copy for local service businesses.

Generate a complete Squarespace city landing page for:
Business: ${form.businessName}
Industry / Service Type: ${form.industry}
City: ${form.city}${form.state ? ", " + form.state : ""}
Phone: ${form.phone || "not provided"}
Services offered: ${form.services || "general services for this industry"}
Neighborhoods/Areas: ${form.neighborhoods || "not specified"}
Nearby Cities: ${form.nearbyAreas || "not specified"}
Local Roads/Landmarks: ${form.localLandmarks || "not specified"}

Follow this exact page structure:
- Page Title: "[Primary Service] in [City], [State] | [Business Name]" — under 60 characters, include city and main service keyword
- Meta Description: under 155 characters, mention city, primary service, and a call to action
- H1: matches page title intent but written as a headline
- Hero paragraph: 2-3 sentences, addresses locals by city name, mentions key neighborhoods if provided, establishes 24/7 or key availability
- Services intro line: "We offer [X] services throughout [City] and the surrounding area, including:"
- For each service: 3-5 sentences, mention the city, reference local roads/landmarks where relevant, be concrete and specific
- Location H2: "Serving [City] and [Surrounding Areas]" — body paragraph proudly serving the city, list nearby communities
- CTA H2: "Need [Service] in [City]?" — body paragraph with direct call to action and phone number if provided
- FAQ H2: "Frequently Asked Questions About [Service] in [City]" — 3 city-specific questions referencing local context

Return ONLY valid JSON, no markdown:
{
  "pageTitle": "...",
  "metaDescription": "...",
  "slug": "city-service-keyword",
  "h1": "...",
  "heroParagraph": "...",
  "servicesIntro": "...",
  "services": [{"h2": "...", "body": "..."}],
  "locationH2": "...",
  "locationBody": "...",
  "ctaH2": "...",
  "ctaBody": "...",
  "faqH2": "...",
  "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
}`;

    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
      setSubTab("sections");
    } catch { setError("Generation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const canGenerate = form.businessName && form.city && form.industry;

  const fullText = result ? [
    `PAGE TITLE:\n${result.pageTitle}`,
    `\nMETA DESCRIPTION:\n${result.metaDescription}`,
    `\nURL SLUG: /${result.slug}`,
    `\nH1: ${result.h1}`, `\n${result.heroParagraph}`,
    `\nH2: ${result.servicesIntro}`,
    ...(result.services||[]).map(s=>`\nH2: ${s.h2}\nP: ${s.body}`),
    `\nH2: ${result.locationH2}\n${result.locationBody}`,
    `\nH2: ${result.ctaH2}\n${result.ctaBody}`,
    `\nH2: ${result.faqH2}`,
    ...(result.faq||[]).map(f=>`\nH3: ${f.q}\nP: ${f.a}`)
  ].join("\n") : "";

  return (
    <div>
      <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"22px",marginBottom:"18px"}}>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"12px",marginBottom:"12px"}}>
          <Field name="businessName" value={form.businessName} onChange={onChange}
            label="Business Name" placeholder="e.g. Sunrise Plumbing Co." required />
          <Field name="phone" value={form.phone} onChange={onChange}
            label="Phone" placeholder="(555) 000-0000" />
        </div>

        <div style={{marginBottom:"12px"}}>
          <Field name="industry" value={form.industry} onChange={onChange}
            label="Industry / Primary Service" placeholder="e.g. Plumbing, HVAC, Landscaping, Towing, Cleaning..." required />
        </div>

        <div style={{marginBottom:"12px"}}>
          <Field name="services" value={form.services} onChange={onChange}
            label="Services to Include" placeholder="e.g. Drain repair, water heater install, emergency leaks, pipe inspection..." />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"12px",marginBottom:"12px"}}>
          <Field name="city" value={form.city} onChange={onChange}
            label="City" placeholder="e.g. Austin" required />
          <Field name="state" value={form.state} onChange={onChange}
            label="State" placeholder="TX" />
        </div>

        <div style={{marginBottom:"12px"}}>
          <Field name="neighborhoods" value={form.neighborhoods} onChange={onChange}
            label="Neighborhoods / Local Areas" placeholder="e.g. East Austin, South Congress, Downtown" />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"20px"}}>
          <Field name="nearbyAreas" value={form.nearbyAreas} onChange={onChange}
            label="Nearby Cities" placeholder="e.g. Round Rock, Cedar Park, Pflugerville" />
          <Field name="localLandmarks" value={form.localLandmarks} onChange={onChange}
            label="Local Roads / Landmarks" placeholder="e.g. I-35, Barton Creek, 6th Street" />
        </div>

        <button onClick={generate} disabled={!canGenerate||loading} style={{
          width:"100%", padding:"11px",
          background: canGenerate&&!loading?"#16a34a":"#0f0f0f",
          color: canGenerate&&!loading?"#000":"#2a2a2a",
          border:"none", borderRadius:"7px", fontSize:"13px", fontWeight:"600",
          cursor: canGenerate&&!loading?"pointer":"not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", fontFamily:sans }}>
          {loading
            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{animation:"spin .7s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>Generating...</>
            : "Generate SEO Page"}
        </button>

        {!canGenerate && <p style={{margin:"8px 0 0",fontSize:"11px",color:"#2a2a2a",fontFamily:mono,textAlign:"center"}}>
          Business name, city, and industry are required
        </p>}
      </div>

      {error && <div style={{background:"#130505",border:"1px solid #3f1515",borderRadius:"6px",
        padding:"11px 14px",color:"#f87171",fontSize:"12px",marginBottom:"14px",fontFamily:mono}}>{error}</div>}

      {result && (
        <div style={{animation:"slidein .3s ease"}}>
          <div style={{display:"flex",alignItems:"center",borderBottom:"1px solid #171717",marginBottom:"20px"}}>
            {[["sections","Sections"],["raw","Full Copy"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setSubTab(id)} style={{background:"none",border:"none",
                borderBottom:subTab===id?"2px solid #16a34a":"2px solid transparent",
                color:subTab===id?"#e0e0e0":"#3a3a3a",padding:"8px 14px",fontSize:"12px",
                fontWeight:"600",cursor:"pointer",fontFamily:sans,marginBottom:"-1px"}}>{lbl}</button>
            ))}
            <div style={{marginLeft:"auto",paddingBottom:"6px"}}>
              <CopyBtn text={fullText} label="Copy Everything" />
            </div>
          </div>

          {subTab==="sections" && (
            <>
              {/* SEO meta */}
              <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"8px",padding:"16px",marginBottom:"18px"}}>
                <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.14em",color:"#3a3a3a",
                  textTransform:"uppercase",fontFamily:mono,marginBottom:"12px"}}>Squarespace → Page Settings → SEO</div>
                {[{key:"pageTitle",label:"Page Title",max:60},{key:"metaDescription",label:"Meta Description",max:155}].map(({key,label,max})=>(
                  <div key={key} style={{marginBottom:"10px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                      <Label>{label}</Label>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <span style={{fontSize:"10px",color:result[key]?.length>max?"#ef4444":"#3a3a3a",fontFamily:mono}}>
                          {result[key]?.length}/{max}</span>
                        <CopyBtn text={result[key]} />
                      </div>
                    </div>
                    <div style={{fontSize:"12px",color:"#999",fontFamily:mono,background:"#0a0a0a",
                      border:"1px solid #1a1a1a",borderRadius:"5px",padding:"9px 12px",lineHeight:"1.5"}}>{result[key]}</div>
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
                  <Label>URL Slug:</Label>
                  <span style={{fontSize:"12px",color:"#4ade80",fontFamily:mono}}>/{result.slug}</span>
                  <CopyBtn text={result.slug} />
                </div>
              </div>

              {/* H1 + Hero */}
              <div style={{marginBottom:"16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                  <Tag>H1</Tag>
                  <span style={{fontSize:"14px",color:"#ccc",fontWeight:"500"}}>{result.h1}</span>
                  <CopyBtn text={result.h1} />
                </div>
                <Block label="Hero Paragraph" content={result.heroParagraph} />
              </div>

              {/* Services */}
              <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"8px",padding:"16px",marginBottom:"18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
                  <Label>Service Blocks ({result.services?.length})</Label>
                  <CopyBtn text={(result.services||[]).map(s=>`H2: ${s.h2}\nP: ${s.body}`).join("\n\n")} label="Copy All" />
                </div>
                {(result.services||[]).map((s,i)=>(
                  <div key={i} style={{borderTop:i>0?"1px solid #111":"none",paddingTop:i>0?"14px":0,marginTop:i>0?"14px":0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"7px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                        <Tag>H2</Tag>
                        <span style={{fontSize:"13px",color:"#999",fontWeight:"500"}}>{s.h2}</span>
                      </div>
                      <CopyBtn text={s.body} />
                    </div>
                    <p style={{margin:0,fontSize:"13px",color:"#555",lineHeight:"1.7",fontFamily:serif}}>{s.body}</p>
                  </div>
                ))}
              </div>

              {/* Location */}
              <div style={{marginBottom:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"8px"}}>
                  <Tag>H2</Tag><span style={{fontSize:"13px",color:"#666"}}>{result.locationH2}</span>
                </div>
                <Block label="Location Body" content={result.locationBody} />
              </div>

              {/* CTA */}
              <div style={{marginBottom:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"8px"}}>
                  <Tag>H2</Tag><span style={{fontSize:"13px",color:"#666"}}>{result.ctaH2}</span>
                </div>
                <Block label="CTA Body" content={result.ctaBody} />
              </div>

              {/* FAQ */}
              <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"8px",overflow:"hidden",marginBottom:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 15px",borderBottom:"1px solid #111"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                    <Tag>H2</Tag>
                    <span style={{fontSize:"12px",color:"#555",fontFamily:mono}}>{result.faqH2}</span>
                  </div>
                  <CopyBtn text={(result.faq||[]).map(f=>`H3: ${f.q}\nP: ${f.a}`).join("\n\n")} label="Copy FAQs" />
                </div>
                {(result.faq||[]).map((f,i)=>(
                  <div key={i} style={{padding:"13px 15px",borderBottom:i<result.faq.length-1?"1px solid #0f0f0f":"none"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:"7px",marginBottom:"6px"}}>
                      <Tag>H3</Tag>
                      <span style={{fontSize:"13px",color:"#bbb",fontWeight:"500"}}>{f.q}</span>
                    </div>
                    <p style={{margin:0,fontSize:"13px",color:"#555",lineHeight:"1.7",fontFamily:serif,paddingLeft:"36px"}}>{f.a}</p>
                  </div>
                ))}
              </div>

              <div style={{background:"#071a0f",border:"1px solid #0f3320",borderRadius:"6px",padding:"11px 14px",
                fontSize:"11px",color:"#4ade80",fontFamily:mono,lineHeight:"1.8"}}>
                Page Settings → SEO: paste title, meta, slug. Body: Text blocks with H2 formatting. FAQ: Accordion blocks.
              </div>
            </>
          )}

          {subTab==="raw" && <Block label="Full Page — Paste into Doc or Notion" content={fullText} isCode />}
        </div>
      )}
    </div>
  );
}

// ─── AUDITOR ──────────────────────────────────────────────
function Auditor() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const audit = async () => {
    if (!url) return;
    setLoading(true); setError(null); setResult(null);

    const prompt = `You are a senior SEO and web trust auditor. Analyze this local business city landing page:

URL: ${url}

Perform a trust-aware audit across three dimensions:

1. SEO Health (0-100): title tags, meta description, H1/H2 structure, keyword density, internal links, alt text, schema markup, page structure
2. UX Clarity (0-100): content readability, CTA placement, mobile considerations, JS-heavy patterns, navigation clarity, page structure for humans vs bots
3. Trust Exposure (0-100, higher = more exposed): predictable URL patterns, open forms without friction, bot-scrapable contact info, lack of rate limiting signals, patterns that favor crawlers over real users

Identify 3 Quick Wins — high impact, low effort fixes specific to Squarespace.
List all issues found, classified by category and severity.

Return ONLY valid JSON (no markdown):
{
  "scores": { "seo": 0-100, "ux": 0-100, "trust": 0-100 },
  "summary": "2-3 sentence overall assessment",
  "quickWins": [
    { "title": "...", "impact": "...", "effort": "low|medium" }
  ],
  "issues": [
    {
      "category": "SEO|UX|Trust",
      "severity": "critical|high|medium|low",
      "title": "short issue name",
      "whyItMatters": "...",
      "impact": "affects humans, bots, or both",
      "howToFix": "specific actionable fix for Squarespace"
    }
  ]
}`;

    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setError("Audit failed. Please try again."); }
    finally { setLoading(false); }
  };

  const cats = ["All","SEO","UX","Trust"];
  const filtered = result?.issues?.filter(i=> filter==="All"||i.category===filter)||[];

  return (
    <div>
      <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"22px",marginBottom:"18px"}}>
        <div style={{fontSize:"10px",fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",
          color:"#3a3a3a",marginBottom:"7px",fontFamily:mono}}>Page URL to Audit</div>
        <div style={{display:"flex",gap:"10px"}}>
          <input value={url} onChange={e=>setUrl(e.target.value)}
            placeholder="https://yourbusiness.com/city-service-page"
            onKeyDown={e=>e.key==="Enter"&&audit()}
            style={{flex:1,background:"#0a0a0a",border:"1px solid #1e1e1e",borderRadius:"6px",
              padding:"9px 12px",color:"#ccc",fontSize:"13px",fontFamily:mono,outline:"none"}} />
          <button onClick={audit} disabled={!url||loading} style={{
            padding:"9px 20px", background:url&&!loading?"#16a34a":"#0f0f0f",
            color:url&&!loading?"#000":"#2a2a2a", border:"none", borderRadius:"7px",
            fontSize:"13px", fontWeight:"600", cursor:url&&!loading?"pointer":"not-allowed",
            display:"flex", alignItems:"center", gap:"8px", fontFamily:sans, whiteSpace:"nowrap"}}>
            {loading
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{animation:"spin .7s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>Auditing...</>
              : "Run Audit"}
          </button>
        </div>
        <p style={{margin:"8px 0 0",fontSize:"11px",color:"#2a2a2a",fontFamily:mono}}>
          Scores SEO health, UX clarity, and trust/bot exposure for any local business city page
        </p>
      </div>

      {error && <div style={{background:"#130505",border:"1px solid #3f1515",borderRadius:"6px",
        padding:"11px 14px",color:"#f87171",fontSize:"12px",marginBottom:"14px",fontFamily:mono}}>{error}</div>}

      {result && (
        <div style={{animation:"slidein .3s ease"}}>
          {/* Scores */}
          <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"24px",marginBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:"20px"}}>
              <ScoreRing score={result.scores?.seo} label="SEO Health" color="#3b82f6" />
              <ScoreRing score={result.scores?.ux} label="UX Clarity" color="#a855f7" />
              <ScoreRing score={100-(result.scores?.trust||0)} label="Trust Safety" color="#f97316" />
            </div>
            <div style={{background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:"7px",
              padding:"13px 15px",fontSize:"13px",color:"#888",lineHeight:"1.7",fontFamily:serif}}>
              {result.summary}
            </div>
            <p style={{margin:"8px 0 0",fontSize:"10px",color:"#2a2a2a",fontFamily:mono,textAlign:"right"}}>
              Trust Safety = 100 − Trust Exposure. Lower exposure = higher safety.
            </p>
          </div>

          {/* Quick wins */}
          {result.quickWins?.length > 0 && (
            <div style={{background:"#071a0f",border:"1px solid #0f3320",borderRadius:"10px",padding:"16px",marginBottom:"20px"}}>
              <Label>⚡ Quick Wins</Label>
              <div style={{marginTop:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
                {result.quickWins.map((w,i)=>(
                  <div key={i} style={{background:"#0a1a0f",border:"1px solid #14301a",borderRadius:"7px",padding:"11px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                      <span style={{fontSize:"13px",color:"#4ade80",fontWeight:"600",fontFamily:sans}}>{w.title}</span>
                      <Tag color="#0f2a18" fg="#4ade80">effort: {w.effort}</Tag>
                    </div>
                    <p style={{margin:0,fontSize:"12px",color:"#4a7a5a",lineHeight:"1.6",fontFamily:serif}}>{w.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          <div style={{marginBottom:"16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
              <Label>Issues ({result.issues?.length||0})</Label>
              <div style={{display:"flex",gap:"6px"}}>
                {cats.map(c=>(
                  <button key={c} onClick={()=>setFilter(c)} style={{
                    background: filter===c?(CAT_COLOR[c]+"22"||"#1a1a1a"):"#0a0a0a",
                    border:`1px solid ${filter===c?(CAT_COLOR[c]||"#16a34a"):"#1e1e1e"}`,
                    color: filter===c?(CAT_COLOR[c]||"#4ade80"):"#3a3a3a",
                    borderRadius:"5px",padding:"4px 10px",fontSize:"11px",
                    cursor:"pointer",fontFamily:mono,transition:"all .15s"}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {filtered.map((issue,i)=><IssueCard key={i} issue={issue} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────
function About() {
  const Card = ({ title, desc, items, accent }) => (
    <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"20px",marginBottom:"14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`,flexShrink:0}}/>
        <span style={{fontSize:"13px",fontWeight:"600",color:"#e0e0e0",fontFamily:sans}}>{title}</span>
      </div>
      <p style={{margin:"0 0 12px",fontSize:"13px",color:"#666",lineHeight:"1.7",fontFamily:serif}}>{desc}</p>
      <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
        {items.map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
            <span style={{color:accent,fontSize:"11px",fontFamily:mono,marginTop:"2px",flexShrink:0}}>→</span>
            <span style={{fontSize:"12px",color:"#777",lineHeight:"1.6",fontFamily:serif}}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{animation:"slidein .3s ease"}}>

      {/* Hero */}
      <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"24px",marginBottom:"20px"}}>
        <h2 style={{fontSize:"20px",fontWeight:"600",color:"#f0f0f0",margin:"0 0 12px",lineHeight:1.3}}>
          SEO City Suite
        </h2>
        <p style={{margin:"0 0 12px",fontSize:"13px",color:"#666",lineHeight:"1.8",fontFamily:serif}}>
          A two-part tool for any local service business with a Squarespace website. Generate city-specific
          SEO landing pages from scratch, or audit existing pages for SEO quality, UX clarity, and bot/trust exposure —
          the layer most SEO tools ignore entirely.
        </p>
        <p style={{margin:0,fontSize:"13px",color:"#666",lineHeight:"1.8",fontFamily:serif}}>
          Works for any industry: plumbing, HVAC, landscaping, towing, cleaning, legal, dental, auto repair —
          any business that serves customers in specific cities and wants to rank locally.
        </p>
      </div>

      <Card
        title="Generate Page — How It Works"
        desc="Enter your business name, industry, city, and services. The generator writes a complete, structured Squarespace city page ready to paste — no editing required."
        items={[
          "Produces an SEO-optimized page title (60 char limit), meta description (155 char limit), and URL slug with live character counters",
          "Writes a hero paragraph that addresses locals by city name and neighborhood, service sections with local road and landmark references, and a location + CTA section",
          "Generates 3 city-specific FAQ entries using local context — the kind that actually rank for conversational search queries",
          "Copy individual sections or the entire page at once — output maps directly to Squarespace Text blocks, with FAQ formatted for Accordion blocks"
        ]}
        accent="#16a34a"
      />

      <Card
        title="Audit Page — How It Works"
        desc="Paste any local business city page URL and get a scored audit across three dimensions, with prioritized fixes."
        items={[
          "SEO Health (0–100): title tags, meta description, H1/H2 structure, keyword density, internal links, alt text, schema markup",
          "UX Clarity (0–100): content readability, CTA placement, mobile patterns, load-heavy elements that hurt real users more than crawlers",
          "Trust Exposure (0–100): patterns that make pages easy for bots to exploit — predictable URLs, unprotected forms, scrapable contact info, human vs. bot UX gaps",
          "Quick Wins surface the 3 highest-impact, lowest-effort fixes first",
          "All issues are filterable by SEO / UX / Trust, each with a Squarespace-specific how-to-fix"
        ]}
        accent="#f97316"
      />

      {/* Trust explanation */}
      <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"20px",marginBottom:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#a855f7",boxShadow:"0 0 8px #a855f7",flexShrink:0}}/>
          <span style={{fontSize:"13px",fontWeight:"600",color:"#e0e0e0",fontFamily:sans}}>What Is Trust Exposure?</span>
        </div>
        <p style={{margin:"0 0 12px",fontSize:"13px",color:"#666",lineHeight:"1.7",fontFamily:serif}}>
          Most SEO tools check keywords and meta tags. Trust Exposure checks a different question:
          does this page make life easier for bots than for real customers? Local business pages are
          particularly vulnerable to this because they're designed for discoverability — which also makes them easy to scrape.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
          {[
            "Predictable URL patterns like /city-service across every city page make it trivial for scrapers to enumerate and harvest contact info at scale",
            "Phone numbers and contact forms without rate limiting or friction are prime targets for spam bots and automated lead theft",
            "JS-heavy or slow-loading pages hurt mobile users far more than search crawlers — you lose the conversion while keeping the ranking",
            "Open query parameters and filter endpoints invite automated abuse that distorts your analytics and wastes server resources"
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
              <span style={{color:"#a855f7",fontSize:"11px",fontFamily:mono,marginTop:"2px",flexShrink:0}}>→</span>
              <span style={{fontSize:"12px",color:"#777",lineHeight:"1.6",fontFamily:serif}}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example */}
      <div style={{background:"#0d0d0d",border:"1px solid #171717",borderRadius:"10px",padding:"20px",marginBottom:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#3b82f6",boxShadow:"0 0 8px #3b82f6",flexShrink:0}}/>
          <span style={{fontSize:"13px",fontWeight:"600",color:"#e0e0e0",fontFamily:sans}}>Example: River's Edge Towing</span>
        </div>
        <p style={{margin:"0 0 12px",fontSize:"13px",color:"#666",lineHeight:"1.7",fontFamily:serif}}>
          This tool was originally built for River's Edge Towing, a Nebraska/Iowa towing company with a Squarespace site
          serving 15+ cities across the Omaha metro. Their workflow involved manually duplicating a city page template
          and rewriting every section by hand — hero, 9 service blocks, location copy, CTA, and FAQ — for each new city.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
          {[
            "Cities covered: Boys Town, Elkhorn, Bellevue, Papillion, La Vista, Council Bluffs, Silver City, Glenwood, and more",
            "Each page follows the same structure: H1 with city + service keyword, local neighborhood references in the hero, service sections with street name callouts, and city-specific FAQs",
            "The audit dimension was added to surface trust exposure patterns specific to towing — predictable /city-towing URLs, unprotected phone number pages, and scrapable contact info",
            "The same approach applies to any service business with multiple city pages: HVAC, plumbing, pest control, landscaping, legal, dental, and more"
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
              <span style={{color:"#3b82f6",fontSize:"11px",fontFamily:mono,marginTop:"2px",flexShrink:0}}>→</span>
              <span style={{fontSize:"12px",color:"#777",lineHeight:"1.6",fontFamily:serif}}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{background:"#071a0f",border:"1px solid #0f3320",borderRadius:"8px",
        padding:"14px 16px",fontSize:"11px",color:"#4ade80",fontFamily:mono,lineHeight:"1.9"}}>
        Audit framework: Trust-Aware-SEO — github.com/shruthisenthilarasu/Trust-Aware-SEO<br/>
        Scores SEO health, UX clarity, and trust/bot exposure for any Squarespace local business page.
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("about");

  return (
    <div style={{minHeight:"100vh",background:"#070707",color:"#ddd",fontFamily:sans,padding:"32px 20px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes slidein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input:focus { border-color:#16a34a !important; }
        ::placeholder { color:#222 !important; }
        * { box-sizing:border-box; }
      `}</style>

      <div style={{maxWidth:"700px",margin:"0 auto"}}>
        <div style={{marginBottom:"28px"}}>
          <h1 style={{fontSize:"22px",fontWeight:"600",margin:"0 0 4px",color:"#f0f0f0"}}>
            SEO City Suite
          </h1>
          <p style={{fontSize:"12px",color:"#3a3a3a",margin:0,fontFamily:mono}}>
            Generate local SEO pages · Audit trust & SEO health · Any business, any city
          </p>
        </div>

        <div style={{display:"flex",borderBottom:"1px solid #171717",marginBottom:"24px"}}>
          {[["about","About"],["generate","Generate Page"],["audit","Audit Page"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              background:"none", border:"none",
              borderBottom:tab===id?"2px solid #16a34a":"2px solid transparent",
              color:tab===id?"#e0e0e0":"#3a3a3a",
              padding:"10px 18px", fontSize:"13px", fontWeight:"600",
              cursor:"pointer", fontFamily:sans, marginBottom:"-1px", transition:"color .15s"}}>
              {lbl}
            </button>
          ))}
        </div>

        {tab==="about" && <About />}
        {tab==="generate" && <Generator />}
        {tab==="audit" && <Auditor />}
      </div>
    </div>
  );
}
