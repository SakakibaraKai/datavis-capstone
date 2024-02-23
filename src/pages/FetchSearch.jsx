import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'

const api_key = "a10709164e17f1c60d487330e98d7d27"

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const query = searchParams.get("q");
    const [ inputQuery, setInputQuery ] = useState(query || "")
    const [ repos, setRepos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchSearchResults() {
            setLoading(true)
            try {
                // fetch weather Open API. api_key is access key for the url
                const response_1 = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${api_key}`,
                    { signal: controller.signal }
                );
                
                //
                const responseBody_1 = await response_1.json(); // access to body
                console.log("==responseBody:", responseBody_1);
                // lat = latitude, lon = longitude, fetch out specific city data with using these two infos.
                const lat = responseBody_1[0].lat
                const lon = responseBody_1[0].lon

                const response_2 = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
                    { signal: controller.signal } 
                )

                // save body data into responseBody_2
                const responseBody_2 = await response_2.json();
                console.log("==responseBody_2:", responseBody_2.list)
                setLoading(false)
                setRepos(responseBody_2.list || []);

            } catch (err) {
                if (err.name == "AbortError"){
                    console.log("HTTP Request was aborted!");
                } else {
                    console.error(err);
                    setError(err);
                }
            }
        }
        if (query) {
            fetchSearchResults()
            // success
            .then()
            // error
            .catch()
        }
        return () => controller.abort()
    }, [ query ]) 

    return (
        <div>
            <div>
                <form className = "search-form" onSubmit={e => {
                    e.preventDefault()
                    setSearchParams({ q: inputQuery })
                }}>
                    <input value={inputQuery} placeholder="Put any city name" onChange={e => setInputQuery(e.target.value)} />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div><p>current using URL: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`</p></div>
            <h2>Search query: {query}</h2>
            {error && <ErrorContainer />}
            {loading && <Spinner />}
            <ul>
                {repos.map(repo => (
                    <li key = {repo.id}>
                        <a href = {repo.html_url}>{repo.full_name}</a>
                    </li>

                ))}

            </ul>
        </div>
    )
}
