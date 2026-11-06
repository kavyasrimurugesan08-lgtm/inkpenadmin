import { useState, useEffect } from 'react';
import Login from './Login';
import defaultLogo from './logo';
import { SEED } from './seed';

const AK = 'inkpen-admin-auth';
const SK = 'inkpen-admin-state';
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'leads', label: 'Leads & Inquiries' },
  { id: 'jobs', label: 'Careers / Jobs' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'team', label: 'Team' },
  { id: 'settings', label: 'Site Settings' }
];

export default function App() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(AK) === '1'; } catch (e) { return false; }
  });
  const [tab, setTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('inkpen-admin-theme') || 'dark'; } catch (e) { return 'dark'; }
  });
  const [toast, setToast] = useState('');
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(SK);
      return saved ? JSON.parse(saved) : SEED;
    } catch (e) {
      return SEED;
    }
  });

  // Form states
  const [jobForm, setJobForm] = useState({ id: null, title: '', division: 'Tech', type: 'Full-time', location: 'Remote', description: '', status: 'Open' });
  const [projForm, setProjForm] = useState({ title: '', category: 'Web Design', description: '', image: '' });
  const [catName, setCatName] = useState('');
  const [srvForm, setSrvForm] = useState({ name: '', price: 'Custom quote', description: '', status: 'Live' });
  const [revForm, setRevForm] = useState({ author: '', company: '', quote: '', status: 'Approved' });
  const [teamForm, setTeamForm] = useState({ name: '', role: '', url: '' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('inkpen-admin-theme', theme); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  // Fetch initial state from backend API
  useEffect(() => {
    fetch(`${API_BASE}/state`)
      .then(r => r.ok ? r.json() : null)
      .then(serverData => {
        if (serverData && serverData.site) {
          setData(serverData);
          try { localStorage.setItem(SK, JSON.stringify(serverData)); } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const syncData = (updater, msg) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(SK, JSON.stringify(next)); } catch (e) {}
      fetch(`${API_BASE}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(() => {});
      return next;
    });
    if (msg) showToast(msg);
  };

  const clearSamples = () => {
    syncData(prev => ({
      ...prev,
      sample: false,
      projects: prev.projects.filter(p => !p.title.startsWith('Sample:')),
      leads: prev.leads.filter(l => !l.name.startsWith('Sample:')),
      reviews: prev.reviews.filter(r => !r.author.startsWith('Sample')),
      team: prev.team.filter(t => !t.name.startsWith('Sample'))
    }), 'Sample data cleared');
  };

  const resetToSeed = () => {
    if (!confirm('Reset all admin data back to initial defaults?')) return;
    syncData(SEED, 'Reset to default sample data');
    fetch(`${API_BASE}/state/reset`, { method: 'POST' }).catch(() => {});
  };

  const logoSrc = data.site?.logo || defaultLogo;

  if (!authed) {
    return <Login logo={logoSrc} onSuccess={() => setAuthed(true)} />;
  }

  const visitsArr = data.visits?.[data.range || 'week'] || data.visits?.week || [];
  const maxVisit = Math.max(1, ...visitsArr);

  return (
    <>
      <button id="burger" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <div id="scrim" onClick={() => setMenuOpen(false)} />
      <div id="app">
        <aside className={`side ${menuOpen ? 'open' : ''}`}>
          <div className="chip">
            <img src={logoSrc} alt="INKPEN" />
          </div>
          <nav className="nav" aria-label="Admin navigation">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? 'page' : undefined}
                onClick={() => { setTab(t.id); setMenuOpen(false); }}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="side-foot">
            <button
              type="button"
              className="btn sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
            </button>
            <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="btn sm" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ↗ View Live Site
            </a>
            <button
              type="button"
              className="btn sm x"
              onClick={() => {
                try { sessionStorage.removeItem(AK); } catch (e) {}
                setAuthed(false);
              }}
            >
              Sign out
            </button>
          </div>
        </aside>

        <main>
          {data.sample && (
            <div className="banner">
              <span>You are viewing starter sample data. Clear it anytime to start fresh.</span>
              <div className="row">
                <button type="button" className="btn sm p" onClick={clearSamples}>Clear sample items</button>
              </div>
            </div>
          )}

          {tab === 'overview' && (
            <section>
              <div className="between">
                <div>
                  <h1>Dashboard Overview</h1>
                  <p className="mute" style={{ margin: 0 }}>Real-time snapshot of INKPEN site activity and content.</p>
                </div>
                <button type="button" className="btn sm" onClick={resetToSeed}>Reset Demo Data</button>
              </div>

              <div className="grid" style={{ marginBottom: '1.5rem' }}>
                <div className="card stat">
                  <b>{data.leads?.length || 0}</b>
                  <span>Total Leads ({data.leads?.filter(l => l.status === 'New').length || 0} new)</span>
                </div>
                <div className="card stat">
                  <b>{data.jobs?.filter(j => j.status === 'Open').length || 0}</b>
                  <span>Open Roles</span>
                </div>
                <div className="card stat">
                  <b>{data.projects?.length || 0}</b>
                  <span>Portfolio Projects</span>
                </div>
                <div className="card stat">
                  <b>{data.services?.filter(s => s.status === 'Live').length || 0}</b>
                  <span>Live Services</span>
                </div>
              </div>

              <div className="card">
                <div className="between">
                  <h2>Traffic & Visits</h2>
                  <div className="seg" role="group" aria-label="Traffic range">
                    {['day', 'week', 'month'].map(r => (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={(data.range || 'week') === r}
                        onClick={() => syncData(d => ({ ...d, range: r }))}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bars">
                  {visitsArr.map((v, i) => (
                    <div className="col" key={i}>
                      <div className="bar">
                        <i style={{ height: `${Math.round((v / maxVisit) * 100)}%` }} title={`${v.toLocaleString()} visits`} />
                      </div>
                      <small>{v.toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {tab === 'leads' && (
            <section>
              <div className="between">
                <h1>Leads & Inquiries</h1>
                <span className="mute">{data.leads?.length || 0} total inquiries</span>
              </div>
              {!data.leads?.length ? (
                <div className="empty">No inquiries received yet.</div>
              ) : (
                <div className="card">
                  <table>
                    <thead>
                      <tr>
                        <th>Name & Contact</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leads.map(lead => (
                        <tr key={lead.id}>
                          <td>
                            <b>{lead.name}</b>
                            <div className="mute" style={{ fontSize: 13 }}>{lead.email} {lead.phone ? `· ${lead.phone}` : ''}</div>
                          </td>
                          <td>{lead.message}</td>
                          <td className="mute">{lead.date}</td>
                          <td>
                            <select
                              value={lead.status}
                              onChange={e => syncData(d => ({
                                ...d,
                                leads: d.leads.map(x => x.id === lead.id ? { ...x, status: e.target.value } : x)
                              }), 'Lead status updated')}
                            >
                              <option>New</option>
                              <option>Replied</option>
                              <option>Archived</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn sm x"
                              onClick={() => syncData(d => ({ ...d, leads: d.leads.filter(x => x.id !== lead.id) }), 'Lead deleted')}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === 'jobs' && (
            <section>
              <div className="between">
                <h1>Careers & Job Openings</h1>
                <span className="mute">Synced live with the Frontend Careers page</span>
              </div>
              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  if (!jobForm.title.trim()) return;
                  if (jobForm.id) {
                    syncData(d => ({
                      ...d,
                      jobs: d.jobs.map(j => j.id === jobForm.id ? { ...j, ...jobForm } : j)
                    }), 'Job opening updated');
                  } else {
                    const nj = { ...jobForm, id: 'j' + Date.now(), created: Date.now() };
                    syncData(d => ({ ...d, jobs: [nj, ...(d.jobs || [])] }), 'Job opening published');
                  }
                  setJobForm({ id: null, title: '', division: 'Tech', type: 'Full-time', location: 'Remote', description: '', status: 'Open' });
                }}
              >
                <label>Role Title
                  <input required value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
                </label>
                <label>Division
                  <select value={jobForm.division} onChange={e => setJobForm({ ...jobForm, division: e.target.value })}>
                    <option>Tech</option>
                    <option>Academy</option>
                    <option>Media</option>
                    <option>Corporate</option>
                  </select>
                </label>
                <label>Location
                  <input required value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Remote / Chennai" />
                </label>
                <label>Employment Type
                  <select value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </label>
                <label>Status
                  <select value={jobForm.status} onChange={e => setJobForm({ ...jobForm, status: e.target.value })}>
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </label>
                <label className="wide">Summary & Requirements
                  <textarea required value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role..." />
                </label>
                <div className="row wide">
                  <button className="btn p" type="submit">{jobForm.id ? 'Update Opening' : 'Publish Opening'}</button>
                  {jobForm.id && (
                    <button type="button" className="btn" onClick={() => setJobForm({ id: null, title: '', division: 'Tech', type: 'Full-time', location: 'Remote', description: '', status: 'Open' })}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Division</th>
                      <th>Location & Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.jobs || []).map(job => (
                      <tr key={job.id}>
                        <td>
                          <b>{job.title}</b>
                          <div className="mute" style={{ fontSize: 13 }}>{job.description}</div>
                        </td>
                        <td>{job.division}</td>
                        <td className="mute">{job.location} · {job.type}</td>
                        <td>{job.status || 'Open'}</td>
                        <td>
                          <div className="row">
                            <button type="button" className="btn sm" onClick={() => setJobForm(job)}>Edit</button>
                            <button type="button" className="btn sm x" onClick={() => syncData(d => ({ ...d, jobs: d.jobs.filter(x => x.id !== job.id) }), 'Job removed')}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'projects' && (
            <section>
              <div className="between">
                <h1>Projects & Categories</h1>
              </div>

              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  if (!projForm.title.trim()) return;
                  const np = { ...projForm, id: 'p' + Date.now() };
                  syncData(d => ({ ...d, projects: [np, ...(d.projects || [])] }), 'Project added');
                  setProjForm({ title: '', category: data.cats?.[0]?.name || 'Web Design', description: '', image: '' });
                }}
              >
                <label>Project Title
                  <input required value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} />
                </label>
                <label>Category
                  <select value={projForm.category} onChange={e => setProjForm({ ...projForm, category: e.target.value })}>
                    {(data.cats || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </label>
                <label className="wide">Description
                  <textarea value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} />
                </label>
                <div className="wide">
                  <button className="btn p" type="submit">Add Project</button>
                </div>
              </form>

              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2>Categories</h2>
                <div className="row" style={{ margin: '0.75rem 0' }}>
                  {(data.cats || []).map(c => (
                    <span key={c.id} className="btn sm" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      {c.name}
                      <button type="button" style={{ border: 0, background: 'none', color: 'var(--bad)' }} onClick={() => syncData(d => ({ ...d, cats: d.cats.filter(x => x.id !== c.id) }), 'Category removed')}>×</button>
                    </span>
                  ))}
                </div>
                <form className="row" onSubmit={e => {
                  e.preventDefault();
                  if (!catName.trim()) return;
                  syncData(d => ({ ...d, cats: [...(d.cats || []), { id: 'c' + Date.now(), name: catName.trim() }] }), 'Category added');
                  setCatName('');
                }}>
                  <input style={{ maxWidth: 240 }} placeholder="New category name" value={catName} onChange={e => setCatName(e.target.value)} />
                  <button className="btn sm p" type="submit">Add Category</button>
                </form>
              </div>

              <div className="grid">
                {(data.projects || []).map(p => (
                  <div key={p.id} className="card">
                    <small className="mute">{p.category}</small>
                    <h2 style={{ margin: '0.3rem 0' }}>{p.title}</h2>
                    <p className="mute">{p.description}</p>
                    <button type="button" className="btn sm x" onClick={() => syncData(d => ({ ...d, projects: d.projects.filter(x => x.id !== p.id) }), 'Project deleted')}>Delete</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'services' && (
            <section>
              <div className="between">
                <h1>Services</h1>
              </div>
              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  if (!srvForm.name.trim()) return;
                  syncData(d => ({ ...d, services: [...(d.services || []), { ...srvForm, id: 's' + Date.now() }] }), 'Service saved');
                  setSrvForm({ name: '', price: 'Custom quote', description: '', status: 'Live' });
                }}
              >
                <label>Service Name
                  <input required value={srvForm.name} onChange={e => setSrvForm({ ...srvForm, name: e.target.value })} />
                </label>
                <label>Pricing Label
                  <input value={srvForm.price} onChange={e => setSrvForm({ ...srvForm, price: e.target.value })} />
                </label>
                <label>Status
                  <select value={srvForm.status} onChange={e => setSrvForm({ ...srvForm, status: e.target.value })}>
                    <option>Live</option>
                    <option>Draft</option>
                  </select>
                </label>
                <label className="wide">Description
                  <textarea value={srvForm.description} onChange={e => setSrvForm({ ...srvForm, description: e.target.value })} />
                </label>
                <div className="wide">
                  <button className="btn p" type="submit">Add Service</button>
                </div>
              </form>

              <div className="card">
                <table>
                  <thead>
                    <tr><th>Service</th><th>Pricing</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {(data.services || []).map(s => (
                      <tr key={s.id}>
                        <td><b>{s.name}</b><div className="mute" style={{ fontSize: 13 }}>{s.description}</div></td>
                        <td>{s.price}</td>
                        <td>{s.status}</td>
                        <td>
                          <button type="button" className="btn sm x" onClick={() => syncData(d => ({ ...d, services: d.services.filter(x => x.id !== s.id) }), 'Service deleted')}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'reviews' && (
            <section>
              <div className="between"><h1>Client Reviews</h1></div>
              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  if (!revForm.author.trim() || !revForm.quote.trim()) return;
                  syncData(d => ({ ...d, reviews: [...(d.reviews || []), { ...revForm, id: 'r' + Date.now() }] }), 'Review added');
                  setRevForm({ author: '', company: '', quote: '', status: 'Approved' });
                }}
              >
                <label>Author Name
                  <input required value={revForm.author} onChange={e => setRevForm({ ...revForm, author: e.target.value })} />
                </label>
                <label>Company
                  <input value={revForm.company} onChange={e => setRevForm({ ...revForm, company: e.target.value })} />
                </label>
                <label>Status
                  <select value={revForm.status} onChange={e => setRevForm({ ...revForm, status: e.target.value })}>
                    <option>Approved</option>
                    <option>Hidden</option>
                  </select>
                </label>
                <label className="wide">Quote
                  <textarea required value={revForm.quote} onChange={e => setRevForm({ ...revForm, quote: e.target.value })} />
                </label>
                <div className="wide"><button className="btn p" type="submit">Add Review</button></div>
              </form>

              <div className="card">
                <table>
                  <thead><tr><th>Client</th><th>Quote</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {(data.reviews || []).map(r => (
                      <tr key={r.id}>
                        <td><b>{r.author}</b><div className="mute">{r.company}</div></td>
                        <td>“{r.quote}”</td>
                        <td>
                          <select
                            value={r.status}
                            onChange={e => syncData(d => ({ ...d, reviews: d.reviews.map(x => x.id === r.id ? { ...x, status: e.target.value } : x) }), 'Review updated')}
                          >
                            <option>Approved</option>
                            <option>Hidden</option>
                          </select>
                        </td>
                        <td>
                          <button type="button" className="btn sm x" onClick={() => syncData(d => ({ ...d, reviews: d.reviews.filter(x => x.id !== r.id) }), 'Review deleted')}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'team' && (
            <section>
              <div className="between"><h1>Team Members</h1></div>
              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  if (!teamForm.name.trim()) return;
                  syncData(d => ({ ...d, team: [...(d.team || []), { ...teamForm, id: 't' + Date.now() }] }), 'Team member added');
                  setTeamForm({ name: '', role: '', url: '' });
                }}
              >
                <label>Name
                  <input required value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} />
                </label>
                <label>Role
                  <input required value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} />
                </label>
                <label>Profile / Photo URL
                  <input value={teamForm.url} onChange={e => setTeamForm({ ...teamForm, url: e.target.value })} />
                </label>
                <div className="wide"><button className="btn p" type="submit">Add Member</button></div>
              </form>

              <div className="grid">
                {(data.team || []).map(t => (
                  <div key={t.id} className="card">
                    <h2>{t.name}</h2>
                    <p className="mute">{t.role}</p>
                    <button type="button" className="btn sm x" onClick={() => syncData(d => ({ ...d, team: d.team.filter(x => x.id !== t.id) }), 'Member removed')}>Remove</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'settings' && (
            <section>
              <div className="between"><h1>Site Settings</h1></div>
              <form
                className="card form"
                onSubmit={e => {
                  e.preventDefault();
                  syncData(d => ({ ...d }), 'Site settings saved');
                }}
              >
                <label>Contact Email
                  <input value={data.site?.email || ''} onChange={e => setData({ ...data, site: { ...data.site, email: e.target.value } })} />
                </label>
                <label>Phone Number
                  <input value={data.site?.phone || ''} onChange={e => setData({ ...data, site: { ...data.site, phone: e.target.value } })} />
                </label>
                <label className="wide">Office Address
                  <input value={data.site?.address || ''} onChange={e => setData({ ...data, site: { ...data.site, address: e.target.value } })} />
                </label>
                <label>Instagram URL
                  <input value={data.site?.social?.instagram || ''} onChange={e => setData({ ...data, site: { ...data.site, social: { ...data.site?.social, instagram: e.target.value } } })} />
                </label>
                <label>LinkedIn URL
                  <input value={data.site?.social?.linkedin || ''} onChange={e => setData({ ...data, site: { ...data.site, social: { ...data.site?.social, linkedin: e.target.value } } })} />
                </label>
                <label>X / Twitter URL
                  <input value={data.site?.social?.x || ''} onChange={e => setData({ ...data, site: { ...data.site, social: { ...data.site?.social, x: e.target.value } } })} />
                </label>
                <label>Facebook URL
                  <input value={data.site?.social?.facebook || ''} onChange={e => setData({ ...data, site: { ...data.site, social: { ...data.site?.social, facebook: e.target.value } } })} />
                </label>
                <div className="wide">
                  <button className="btn p" type="submit">Save Settings</button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
      <div id="toast" className={toast ? 'on' : ''} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

