import { useEffect } from 'react';
import '../styles/EndPage.css';

function EndPage() {
  useEffect(() => {
    setTimeout(() => (window.location.href = '/submit'), 1000);
  });
  return (
    <div id='text-wrapper'>
      <h1 id='ending-text'>Complete!</h1>
    </div>
  );
}

export default EndPage;
