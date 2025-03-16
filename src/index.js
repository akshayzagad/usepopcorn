import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating'

function Test(){
  const[movieRating,setMovieRating] = useState(0);
  return(
    <div>
      <StarRating maxRating={5} onSetMovieRating={setMovieRating} color='blue'/>
  <p>Your movie rate is {movieRating}</p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10}/>
    <StarRating size={25} color='red' className='test' message={['Terrible','Bad','Ok','Good','Amazing']}/>
    <Test /> */}
  </React.StrictMode>
);

