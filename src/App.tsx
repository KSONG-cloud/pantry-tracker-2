import { Header } from './components/header';

function App() {

    const today = new Date();

    return (
        <>
            <Header
              date={today}
            ></Header>
            <p>Hello World</p>
        </>
    );
}

export default App;
