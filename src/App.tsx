import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import ErrorPage from "./ErrorPage";

function ErrorCodeRoute() {
  const { errorCode } = useParams<{ errorCode: string }>();
  const numericErrorCode =
    errorCode && /^\d+$/.test(errorCode) ? errorCode : undefined;

  return <ErrorPage errorCode={numericErrorCode} />;
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
