import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import HomePage from './home-page/home-page.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    // Main page
    path: '/',
    element: <HomePage></HomePage>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)
