// import logo from './logo.svg';
import './App.css';
import { getPassword, searchPassword } from './api/passwords';
import { useState } from 'react';
// import useAsync from "./hooks/useAsync";

function App() {
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [input, setInput] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    // const { data, loading, error, doFetch } = useAsync(() => getPassword("wifi"));

    // useEffect(() => {
    //   doFetch();
    // }, []);

    function handleChange(event) {
        setInput(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            setLoading(true);
            const password = await searchPassword(input);
            setError(null);
            setLoading(false);
            setPassword(password);
        } catch (error) {
            setLoading(false);
            setError(error);
        }
    }
    async function handlePassword(passwordID) {
        try {
            setLoading(true);
            const password = await getPassword(passwordID);
            setError(null);
            setPassword(null);
            setSearchResult(password);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <form onSubmit={handleSubmit}>
                    <input type='text' onChange={handleChange} />
                    <button type='submit'>Search for passwords</button>
                </form>
                {loading && <div>loading ...</div>}
                {error && <div>{error.message}</div>}
                {password && (
                    <>
                        {password.map((document) => {
                            return (
                                <div
                                    key={document._id}
                                    onClick={() => handlePassword(document._id)}
                                >
                                    <h3>{document.name}</h3>
                                    Kategorie: {document.category}
                                </div>
                            );
                        })}
                    </>
                )}
                {searchResult && (
                    <>
                        <h3>{searchResult[0]}</h3>
                        Password: {searchResult[1]}
                    </>
                )}
            </header>
        </div>
    );
}

export default App;
