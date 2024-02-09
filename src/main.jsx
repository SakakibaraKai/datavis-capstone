import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { People, PersonItem, PersonBasic, Root, ErrorPage } from './App'
import './index.css'

import FetchSearch from './pages/FetchSearch'


const router = createBrowserRouter([
    //configuration
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [    
            {
                path: "people", 
                element: <People />,
                children: [
                    { path: "", element: <PersonBasic /> },
                    { path: ":personItem", element: <PersonItem />}
                ]
            },
            { 
                path: "/fetchapi", 
                element: <FetchSearch />,
                children: [
                ] 
            }        
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router = {router} />
    </React.StrictMode>
)