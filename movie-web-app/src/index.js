import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AllGroups } from './pages/allGroups';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/home';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import UserProvider from './context/UserProvider';
import Showtimes from './pages/showtimes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/allgroups",
    element: <AllGroups />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/showtimes",
    element: <Showtimes/>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
