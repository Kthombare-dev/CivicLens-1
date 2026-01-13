import Hero from '../components/Hero/Hero';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import PublicAccountability from '../components/PublicAccountability/PublicAccountability';
import BuiltForEveryone from '../components/BuiltForEveryone/BuiltForEveryone';
import Impact from '../components/Impact/Impact';
import Footer from '../components/Footer/Footer';

const Home = () => {
    return (
        <div>
            <Hero />
            <HowItWorks />
            <PublicAccountability />
            <BuiltForEveryone />
            <Impact />
            <Footer />
        </div>
    );
};

export default Home;
