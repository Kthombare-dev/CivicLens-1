import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import './App.css';

function App() {
  return (
    <>
      <Navbar />

      {/* Spacer removed so Hero bg covers top */}
      <div>

        <Hero />

        {/* Long Content to Test Sticky Header */}
        <section id="how-it-works" style={{ padding: '4rem 2rem', background: 'white' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3].map((step) => (
                <div key={step} style={{
                  padding: '2rem',
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ marginBottom: '1rem' }}>Step {step}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              ))}
            </div>
            {/* Adding more content to force scroll */}
            <div style={{ height: '100vh', marginTop: '4rem' }}></div>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
