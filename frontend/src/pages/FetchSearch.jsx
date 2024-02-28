import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'
import WeatherCard from '../components/WeatherCard.jsx'

const api_key = "a10709164e17f1c60d487330e98d7d27"

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const query = searchParams.get("q");
    const [ inputQuery, setInputQuery ] = useState(query || "")
    const [ repos, setRepos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    // pagination react hook
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerpage = 5;
    const [itemsStartIdx, setitemsStartIdx] = useState(0);
    const [itemsEndIdx, setitemsEndIdx] = useState(5);

    useEffect(() => {
        const newStartIdx = (currentPage - 1) * itemsPerpage;
        const newEndIdx = currentPage * itemsPerpage;
        setitemsStartIdx(newStartIdx);
        setitemsEndIdx(newEndIdx);
        console.log("cur page:", currentPage)
        console.log("start:", newStartIdx)
        console.log("end:", newEndIdx)
        
    }, [currentPage])

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleNextPage = () => {
        //const maxPage = Math.ceil(repos.length / itemsPerpage);
        setCurrentPage(currentPage + 1);   
    }


    // Post to BackEnd port 8080:
    async function sendPost(responsebody, city) {
        console.log("==city", city)
        responsebody.city = city // add 'city' into responsebody object
        const res = await fetch(
            "http://localhost:8080/datafetch",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(responsebody)
            }
        )
        const resBody = await res.json()
        console.log("==resBody", resBody)
    }



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
                //console.log("==responseBody:", responseBody_1);
                // lat = latitude, lon = longitude, fetch out specific city data with using these two infos.
                const lat = responseBody_1[0].lat
                const lon = responseBody_1[0].lon

                const response_2 = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
                    { signal: controller.signal } 
                )

                // save body data into responseBody_2
                const responseBody_2 = await response_2.json();
                //console.log("==responseBody_2:", responseBody_2.list)

                
                setLoading(false)
                setRepos(responseBody_2.list || []);
                sendPost(responseBody_2, inputQuery);

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
            <h2>Search query: {query}</h2>
            {error && <ErrorContainer />}
            {loading && <Spinner />}
            <ul>
                {repos.slice(itemsStartIdx, itemsEndIdx).map((item) => (
                    <WeatherCard key={item.dt} weatherData={item} />
                ))}
                {currentPage != 1 && (
                    <li>
                        <p onClick={handlePreviousPage} className="pagination-link"><img width="50" height="50" src="https://img.icons8.com/ios/50/circled-left-2.png" alt="circled-left-2"/></p>
                    </li>
                )}
                {repos.length > itemsEndIdx && (
                    <li>
                        <p onClick={handleNextPage} className="pagination-link"><img width="50" height="50" src="https://img.icons8.com/ios/50/circled-right-2.png" alt="circled-right-2"/></p>
                    </li>
                )}
            </ul>
        </div>
    )
}
