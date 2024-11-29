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
import MoviePage from './pages/moviePage';
import Showtimes from './pages/showtimes';
import MyProfile  from './pages/userProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { CreateGroup } from './pages/createGroup';
import { GroupPage } from './pages/groupPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/moviepage/:movieId",
    element: <MoviePage />,
  },
  {
    path: "/showtimes",
    element: <Showtimes/>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/allgroups",
        element: <AllGroups />,
      },
      {
        path: "/creategroup",
        element: <CreateGroup />,
      },
      {
        path: "/userprofile",
        element: <MyProfile/>,
      },
      {
        path: "/grouppage/:groupId",
        element: <GroupPage />,
      }
    ]
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
