import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'
import WeatherCard from '../components/WeatherCard.jsx'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'


export default function DisplayTable() {
    //get json data from /tablelist
    const [ formData, setFormData ] = useState({})
    // Table and DB
    const [ selectedTable, setSelectedTable ] = useState("")

    async function sendGet() {
        const res = await fetch(
            "http://localhost:8080/tablelist",
            {
                method: "GET",
                headers: {"Accept": "application/json"},
            }
        )
        const resBody = await res.json()
        console.log("== GET-Body", resBody)
        setFormData(resBody)
    }

    async function sendPost() {
        const table = {"table_name": selectedTable}
        const res = await fetch(
            "http://localhost:8080/tablelist",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(table)
            }
            
        )
        const resBody = await res.json()
        console.log("==POST-Body:", resBody)
    }

    useEffect(() => {
        sendGet()
        console.log("formData", formData)
    }, [])

    function handleTableSelect(tableName) {
        setSelectedTable(tableName);
        sendPost()
    }

    return (
        <div>
            <h2>Selected Table: {selectedTable}</h2>
                {formData.tables && formData.tables.map((tableName, index) => (
                    <button key={index} onClick={() => handleTableSelect(tableName)}>
                        {tableName}
                    </button>
                ))}
        </div>
    );
}
