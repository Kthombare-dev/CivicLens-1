import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import PublicAccountability from './components/PublicAccountability/PublicAccountability';
import BuiltForEveryone from './components/BuiltForEveryone/BuiltForEveryone';

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
        <BuiltForEveryone />
      </div>
    </>
  );
}

export default App;
