import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "../pages/NoPage";

export default function Router() {
  const LazyHomeComponent = lazy(() => import("../pages/Home"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyHomeComponent />
              </Suspense>
            }
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
