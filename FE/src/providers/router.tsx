import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./private-router";
import { Layout } from "@/components/Layout/Layout";
import { Loader } from "@/components";

const Login = lazy(() => import("@/pages/login"));
const Registration = lazy(() => import("@/pages/registration"));
const Calendar = lazy(() => import("@/pages/calendar"));
const ErrorPage = lazy(() => import("@/pages/404"));

const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Calendar />
          </Suspense>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/registration",
    element: (
      <Suspense fallback={<Loader />}>
        <Registration />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export const RouterApp = () => (
  <Suspense fallback={<div>Loading routes...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);
