import { useState } from 'react';
import { Header } from './Header';
import { IdentitySubmit } from './IdentitySubmit';
import { IdentityStatus } from './IdentityStatus';
import '../styles/IdentityApp.css';

export function IdentityApp() {
  const [activeTab, setActiveTab] = useState<'submit' | 'status'>('submit');

  return (
    <div className="identity-app">
      <Header />
      <main className="main-content">
        <div>
          <div className="tab-navigation">
            <nav className="tab-nav">
              <button
                onClick={() => setActiveTab('submit')}
                className={`tab-button ${activeTab === 'submit' ? 'active' : 'inactive'}`}
              >
                Submit
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`tab-button ${activeTab === 'status' ? 'active' : 'inactive'}`}
              >
                View
              </button>
            </nav>
          </div>

          {activeTab === 'submit' && <IdentitySubmit />}
          {activeTab === 'status' && <IdentityStatus />}
        </div>
      </main>
    </div>
  );
}

