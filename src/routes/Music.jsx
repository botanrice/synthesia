import { useState } from 'react';
import '../StoUniverse.css';

const Music = () => {
  const [count, setCount] = useState(0);
  const [stepOne, setStepOne] = useState(false); 

  function showNext(e) {
    setStepOne(true);
  }

  return (
    <div className="Universe" id="enter">
      <h1>music</h1>
      <h2>stoic da poet</h2>
      <p><i>Soon come...</i></p>
    </div>
  );
};

export default Music;
