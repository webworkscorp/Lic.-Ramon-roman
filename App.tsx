import React from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Services } from './components/Services.tsx';
import { Booking } from './components/Booking.tsx';
import { Footer } from './components/Footer.tsx';
import { Chatbot } from './components/Chatbot.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-accent-gold selection:text-corp-900">
      <Header />
      <main>
        <Hero />
        <Services />
        <Booking />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;