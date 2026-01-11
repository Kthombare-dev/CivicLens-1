import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import PublicAccountability from './components/PublicAccountability/PublicAccountability';

import './App.css';

function App() {
  return (
    <>
      <Navbar />

      {/* Spacer removed so Hero bg covers top */}
      <div>

        <Hero />

        {/* Long Content to Test Sticky Header */}
        <HowItWorks />
        <PublicAccountability />
      </div>
    </>
  );
}

export default App;
