import { Link } from 'react-router-dom';

const features = [
  { icon: 'bi-map', title: 'Structured Roadmaps', desc: 'Clear, ordered learning paths for 7+ career tracks with stage-by-stage guidance.' },
  { icon: 'bi-check2-circle', title: 'Track Your Progress', desc: 'Mark tasks complete, watch your progress bar grow and stay motivated.' },
  { icon: 'bi-book', title: 'Curated Resources', desc: 'Every stage links to free, high-quality learning materials handpicked for students.' },
  { icon: 'bi-people', title: 'Beginner Friendly', desc: 'Roadmaps are designed from a student perspective — no prior degree required.' },
];

const howItWorks = [
  { step: '01', title: 'Create an Account', desc: 'Register for free — no credit card needed.' },
  { step: '02', title: 'Choose a Career Path', desc: 'Browse roadmaps and find the one that excites you.' },
  { step: '03', title: 'Follow the Stages', desc: 'Work through ordered stages with tasks and resources.' },
  { step: '04', title: 'Track & Celebrate', desc: 'Mark tasks done and watch your progress grow.' },
];

const careerTracks = [
  { title: 'Software Developer', icon: 'bi-code-slash', color: '#3b82f6', level: 'Beginner' },
  { title: 'Data Scientist', icon: 'bi-graph-up', color: '#10b981', level: 'Intermediate' },
  { title: 'Full-Stack Developer', icon: 'bi-layers', color: '#8b5cf6', level: 'Intermediate' },
  { title: 'Cybersecurity Analyst', icon: 'bi-shield-lock', color: '#ef4444', level: 'Intermediate' },
  { title: 'Cloud Engineer', icon: 'bi-cloud', color: '#f59e0b', level: 'Advanced' },
  { title: 'AI/ML Engineer', icon: 'bi-robot', color: '#06b6d4', level: 'Advanced' },
];

export default function LandingPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section
        style={{ background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6b 60%, #0e4d6e 100%)', minHeight: '88vh' }}
        className="d-flex align-items-center"
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white mb-5 mb-lg-0">
              <span className="badge bg-info text-dark fw-semibold mb-3 px-3 py-2">
                <i className="bi bi-mortarboard me-1"></i> For Engineering Students
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: 1.2 }}>
                Plan Your Career,<br />
                <span style={{ color: '#22d3ee' }}>Step by Step</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                CareerPath gives you structured, expert-curated learning roadmaps for the tech careers that matter — from Software Development to AI/ML Engineering.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-info btn-lg fw-semibold px-4">
                  Start for Free <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {careerTracks.map((track) => (
                  <div key={track.title} className="col-12 col-sm-6">
                    <div
                      className="p-3 rounded-3 d-flex align-items-center gap-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div
                        className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 44, height: 44, backgroundColor: track.color + '22', fontSize: 20, color: track.color }}
                      >
                        <i className={`bi ${track.icon}`}></i>
                      </div>
                      <div>
                        <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{track.title}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{track.level}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#0f2044' }}>Why CareerPath?</h2>
            <p className="text-muted">Everything you need to plan and execute your learning journey.</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-3">
                <div className="text-center p-4">
                  <div
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 64, height: 64, backgroundColor: '#e0f2fe', fontSize: 28, color: '#0284c7' }}
                  >
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#0f2044' }}>{f.title}</h5>
                  <p className="text-muted small">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-5" style={{ backgroundColor: '#f4f7fb' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: '#0f2044' }}>How It Works</h2>
            <p className="text-muted">Four simple steps to get started.</p>
          </div>
          <div className="row g-4">
            {howItWorks.map((step) => (
              <div key={step.step} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 p-4 text-center" style={{ borderRadius: 12 }}>
                  <div className="fw-bold mb-2" style={{ fontSize: 36, color: '#22d3ee' }}>{step.step}</div>
                  <h5 className="fw-bold mb-2" style={{ color: '#0f2044' }}>{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5 text-white text-center" style={{ backgroundColor: '#0f2044' }}>
        <div className="container">
          <h2 className="fw-bold display-6 mb-3">Ready to map your future?</h2>
          <p className="text-white-50 mb-4">Join thousands of students planning their tech careers with CareerPath.</p>
          <Link to="/register" className="btn btn-info btn-lg fw-semibold px-5">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
