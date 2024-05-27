import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';

// ErrorCodeRoute 컴포넌트: errorCode가 숫자인지 확인
const ErrorCodeRoute = () => {
  const { errorCode } = useParams();
  
  return <ErrorPage errorCode={/^\d+$/.test(errorCode) ? errorCode : null} />;
};

const App = () => (
  <Router basename="/error">
    <Routes>
      {/* 숫자 에러 코드에 대한 라우트 */}
      <Route path="/:errorCode" element={<ErrorCodeRoute />} />

      {/* 루트 경로 */}
      <Route path="/" element={<ErrorPage />} />

      {/* 정의되지 않은 모든 경로 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </Router>
);

export default App;
