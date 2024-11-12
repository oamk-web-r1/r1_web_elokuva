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
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
