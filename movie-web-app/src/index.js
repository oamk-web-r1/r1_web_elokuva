import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AllGroups } from './pages/allGroups';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AllReviews } from './pages/allReviews';
import { Home } from './pages/home';
import { SignIn } from './pages/signIn';
import { SignUp } from './pages/signUp';
import { showTimes } from './pages/showtimes';
import { UserProvider } from '.components/UserProvider'; // Import UserProvider

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/allreviews",
    element: <AllReviews />,
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
    element: <showTimes/>,
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
