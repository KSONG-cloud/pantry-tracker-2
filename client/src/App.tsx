// React

// Components
import { Header } from './components/header';
import { TrackPantry } from './components/track_pantry/track_pantry';

// Types


function App() {
    const today: Date = new Date();


    return (
        <>
            <Header date={today}></Header>
            <TrackPantry />
        </>
    );
}

export default App;
