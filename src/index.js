import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecordContextProvider } from './Context/recordContext';
import { AuthContextProvider } from './Context/authContext';
import { BillsContextProvider } from './Context/billContext';
import RegisterPage from './Pages/RegisterPage/registerPage';
import HomePage from './Pages/Home/homePage';
import NewRecordPage from './Pages/NewRecordPage/newRecordPage';
import BillsPage from './Pages/ManageBills/billsPage';
import ForgotPasswordPage from './Pages/ForgotPassword/forgotPasswordScreen';
import ResetPasswordPage from './Pages/ResetPassword/resetPasswordScreen';

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
  {
    path: "bills",
    element: <BillsPage/>,
  },
  {
    path: "forgotpassword",
    element: <ForgotPasswordPage/>,
  },
  {
    path: "reset-password/:token",
    element: <ResetPasswordPage/>,
  }

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecordContextProvider>
        <BillsContextProvider>
          <RouterProvider router={router} />
        </BillsContextProvider>
      </RecordContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
