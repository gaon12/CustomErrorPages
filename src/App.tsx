import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import { normalizeErrorCode } from "./config/errors";
import ErrorPage from "./ErrorPage";

function ErrorCodeRoute() {
  const { errorCode } = useParams<{ errorCode: string }>();

  return <ErrorPage errorCode={normalizeErrorCode(errorCode)} />;
}

export default function App() {
  return (
    <BrowserRouter basename="/error">
      <Routes>
        <Route path="/:errorCode" element={<ErrorCodeRoute />} />
        <Route path="/" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
