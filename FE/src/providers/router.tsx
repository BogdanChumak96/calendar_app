import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Login = lazy(() => import("@/pages/login"));
const Registration = lazy(() => import("@/pages/registration"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/registration",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Registration />
      </Suspense>
    ),
  },
]);

export const RouterApp = () => <RouterProvider router={router} />;
