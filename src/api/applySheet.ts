const pz = n => String(n).padStart(2, "0");

const toISO = v => {
    const s = String(v || "").trim();
    let m = s.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/);
    if (m) return m[3] + "-" + pz(m[2]) + "-" + pz(m[1]);
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
    const d = new Date(s);
    return isNaN(d.getTime()) ? "" : d.getFullYear() + "-" + pz(d.getMonth() + 1) + "-" + pz(d.getDate());
  };
  function stToken(v) {
    const s = String(v || "")
      .trim()
      .toLowerCase();
    if (/в срок|в графике|принят|^ok$|зелён|зелен/.test(s)) return "ok";
    if (/риск|угроз|^warn$|жёлт|желт/.test(s)) return "warn";
    if (/наруш|просроч|блокер|^bad$|красн/.test(s)) return "bad";
    return "plan";
  }
  const trimRows = rows => (rows || [])
    .filter(r => r
      .some(c => String(c).trim() !== "")
    );

  export function applySheet(res, DATA) {
    const [projects, events, tasks, potential] = res;
    const P = trimRows(projects);
    if (P.length > 1) {
      const idx = P[0].map((v, i) => i).filter(i => i >= 2 && String(P[0][i]).trim() !== "");
      DATA.stages = idx.map(i => String(P[0][i]).trim());
      DATA.projects = P.slice(1).map(r => ({
        name: String(r[0] || "").trim(), owner: String(r[1] || "").trim(),
        st: idx.map(i => stToken(r[i]))
      })).filter(p => p.name);
    }
    const E = trimRows(events);
    if (E.length > 1) {
      DATA.events = E.slice(1).map(r => ({
        date: toISO(r[0]), time: String(r[1] || "").trim(), title: String(r[2] || "").trim(),
        owner: String(r[3] || "").trim(), link: String(r[4] || "").trim()
      })).filter(e => e.date && e.title)
        .map(e => { e.meta = [e.owner, e.link ? "ВКС" : ""].filter(Boolean).join(" · "); return e; });
    }
    const T = trimRows(tasks);
    if (T.length > 1) {
      DATA.tasks = T.slice(1).map(r => ({
        title: String(r[0] || "").trim(), project: String(r[1] || "").trim(),
        owner: String(r[2] || "").trim(), due: toISO(r[3])
      })).filter(t => t.title && t.due);
    }
    const N = trimRows(potential);
    if (N.length > 1) {
      DATA.potential = N.slice(1).map(r => ({
        name: String(r[0] || "").trim(), source: String(r[1] || "").trim(), stage: String(r[2] || "").trim(),
        prospect: Math.max(1, Math.min(3, parseInt(r[3], 10) || 1)),
        next: String(r[4] || "").trim(), nextDate: toISO(r[5])
      })).filter(p => p.name);
    }
    const n = new Date();
    DATA.snapshot = n.getFullYear() + "-" + pz(n.getMonth() + 1) + "-" + pz(n.getDate());
    DATA.demo = false;
    DATA.source = "Google Таблица";
    DATA.stages = ["Подготовка", "Запуск", "Спринты", "Защита и приёмка", "Посттрек"];
    return DATA
  }