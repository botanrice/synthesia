import { useState } from 'react';

export const UniverseButton = ({showNext}) => (
  <button 
    className="UniverseBtn" 
    onClick={() => showNext()} >
    Next
  </button>
);

export const StepBox = ({msg}) => (
  <div className="StepTransmission">
    <p>{msg}</p>
  </div>
);

export const Navigation = () => (
  <div>
    <NavLink link={"music/"} text={"music"} />
    <NavLink link={"gallery/"} text={"gallery"} />
    <NavLink link={"story/"} text={"story"} />
    <NavLink link={"thoughts/"} text={"thoughts"} />
  </div>
)

export const NavLink = ({link, text, back}) => (
  <p>
    <a href={link}
      className="NavLink"
    >
      { back ? ('← ' + text) : (text + ' →') }
    </a>
  </p>
)