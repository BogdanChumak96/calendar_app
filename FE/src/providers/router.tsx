import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./private-router";
import { Layout } from "@/components/Layout/Layout";

const Login = lazy(() => import("@/pages/login"));
const Registration = lazy(() => import("@/pages/registration"));

const router = createBrowserRouter([
  {
    path: "/calendar",
    element: (
      <PrivateRoute>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <div>Calendar</div>
          </Suspense>
        </Layout>
      </PrivateRoute>
    ),
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

export const RouterApp = () => (
  <Suspense fallback={<div>Loading routes...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);
