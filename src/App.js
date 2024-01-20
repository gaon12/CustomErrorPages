import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import UnknownPage from './UnknownPage';

// ErrorCodeRoute 컴포넌트: errorCode가 숫자인지 확인
const ErrorCodeRoute = () => {
  const { errorCode } = useParams();
  
  // errorCode가 숫자인지 확인
  if (/^\d+$/.test(errorCode)) {
    return <ErrorPage />;
  } else {
    return <UnknownPage />;
  }
};

const App = () => (
  <Router>
    <Routes>
      {/* 숫자 에러 코드에 대한 라우트 */}
      <Route path="/:errorCode" element={<ErrorCodeRoute />} />

      {/* 루트 경로 */}
      <Route path="/" element={<UnknownPage />} />

      {/* 정의되지 않은 모든 경로 */}
      <Route path="*" element={<UnknownPage />} />
    </Routes>
  </Router>
);

export default App;
