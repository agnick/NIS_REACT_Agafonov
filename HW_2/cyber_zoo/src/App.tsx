import React from 'react';
import {EventProvider} from './context/EventContext';
import {Dashboard} from './pages/Dashboard';
import './styles/global.scss';

function App() {
    return (
        <EventProvider>
            <div className="app">
                <Dashboard/>
            </div>
        </EventProvider>
    );
}

export default App;
