import { useState } from 'react';
import '../StoUniverse.css';

const Gallery = () => {
  const [count, setCount] = useState(0);
  const [stepOne, setStepOne] = useState(false); 

  function showNext(e) {
    setStepOne(true);
  }

  return (
    <div className="Universe" id="enter">
      <h1>gallery</h1>
      <p><i>Soon come...</i></p>
    </div>
  );
};

export default Gallery;
