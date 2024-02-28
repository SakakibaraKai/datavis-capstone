import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { People, PersonItem, PersonBasic, Root, ErrorPage } from './App'
import Login from './pages/Login'
import './index.css'

import FetchSearch from './pages/FetchSearch'

const queryClient = new QueryClient();

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
            },
            { 
                path: "/login", 
                element: <Login />,
                children: [
                ] 
            }
                
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client = {queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)