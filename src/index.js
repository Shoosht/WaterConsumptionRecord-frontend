import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RegisterPage from './Pages/RegisterPage/registerPage';
import HomePage from './Pages/Home/homePage';
import NewRecordPage from './Pages/NewRecordPage/newRecordPage';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "register",
    element: <RegisterPage/>,
  },
  {
    path: "home",
    element: <HomePage/>,
  },
  {
    path: "newrecord",
    element: <NewRecordPage/>,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
