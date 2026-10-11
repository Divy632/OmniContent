import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

export default function Landing() {
  const { user } = useAuth();
  const { categories } = useCatalog();
  return (
    <div className="landing">
      <header className="topbar">
        <span className="brand brand-dark">Creation Studio</span>
        <nav>
          {user ? <Link className="btn btn-primary" to="/dashboard">Open dashboard</Link> : (
            <>
              <Link className="btn-link" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/register">Create account</Link>
            </>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>Pick what you want to make. Answer a few questions. Get it done.</h1>
          <p>
            Posters, invitations, LinkedIn posts, captions, thumbnails and more. Choose a content type, fill in the details,
            and get text and a visual you can edit, save and download. No prompt writing, and no business account needed.
          </p>
          <div className="row">
            <Link className="btn btn-primary btn-lg" to="/register">Start creating</Link>
            <Link className="btn btn-ghost btn-lg" to="/login">I already have an account</Link>
          </div>
        </div>

        <div className="hero-demo" aria-label="Example: a form turns into a poster">
          <div className="demo-form">
            <div><span>Content type</span><b>Event poster</b></div>
            <div><span>Event</span><b>National Hackathon 2026</b></div>
            <div><span>Date</span><b>20 November 2026</b></div>
            <div><span>Venue</span><b>College Auditorium</b></div>
            <div><span>Audience</span><b>Students and developers</b></div>
            <div><span>Platform</span><b>Instagram</b></div>
          </div>
          <div className="demo-arrow" aria-hidden="true" />
          <div className="demo-poster" role="img" aria-label="Sample poster: National Hackathon 2026, 20 November">
            <small>Tech Club</small>
            <strong>National Hackathon 2026</strong>
            <em>20 NOV</em>
            <span>Register now</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What would you like to create?</h2>
        <div className="cat-grid">
          {categories.map((c) => (
            <div className="cat" key={c.id}><h3>{c.label}</h3><p>{c.blurb}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <ol className="steps">
          <li><h3>Choose a content type</h3><p>Each type asks only for the details it needs, such as date and venue for an event.</p></li>
          <li><h3>Set language, tone and style</h3><p>Pick text, a visual, or both. Saved preferences fill these in for you next time.</p></li>
          <li><h3>Review, edit and save</h3><p>Change any text, regenerate what you do not like, then copy the text or download the image.</p></li>
        </ol>
      </section>

      <section className="section split">
        <div><h2>Your profile is optional</h2><p>Save a logo and brand colors if you make content for a business or organization. They are used only when a content type benefits from them.</p></div>
        <div><h2>You stay in control</h2><p>AI can make mistakes, so every result is shown for review before you use it, and nothing is posted for you.</p></div>
      </section>

      <footer className="foot">Review all generated content for accuracy before you publish it.</footer>
    </div>
  );
}
