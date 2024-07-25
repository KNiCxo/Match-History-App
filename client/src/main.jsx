import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css';

// Import pages
import HomePage from './home-page/home-page.jsx';
import ProfilePage from './profile-page/profile-page.jsx';
import ErrorPage from './error-page/error-page.jsx';

const router = createBrowserRouter([
  {
    // Main page
    path: '/',
    element: <HomePage></HomePage>
  },
  {
    // Profile page
    path: '/profile/:regionID/:gameName/:tagLine',
    element: <ProfilePage></ProfilePage>
  },
  {
    // Error Page
    path: '/error',
    element: <ErrorPage></ErrorPage>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}></RouterProvider>
)
