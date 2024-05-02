import { useState, useEffect, useRef } from 'react';
import { Colorful } from '@uiw/react-color';
import { hsvaToHex } from '@uiw/color-convert';
import { useNavigate } from 'react-router-dom';
import { UniverseButton } from '../Components';
import { GetColorName } from 'hex-color-to-color-name';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../Navbar';
import '../StoUniverse.css';
import '../Color.css';
// import '@wcj/dark-mode';

const S3_URL = "https://s3.amazonaws.com/dropcolumn.com/flexonem/";

const TrackAudio = ({track}) => {
  return (
    <div className="TrackAudio">
      <audio controls src={track.link}></audio>
      <p>{track.title}</p>
    </div>
  );
}

const Color = () => {
  const [hsva, setHsva] = useState({ h: 226, s: 29, v: 68, a: 1 });
  const [textColor, setTextColor] = useState({ h: 226, s: 29, v: 100, a: 1 });
  const [trackID, setTrackID] = useState(1);
  const [thisTrack, setThisTrack] = useState({});
  const [trackDB, setTrackDB] = useState({});
  const navigate = useNavigate();

  let colorText = {"color": textColor};

  useEffect(() => {
    let ignore = false;
    initialPopulate();
    setTrackDB({});
    setThisTrack({});
    getData().then(result => {
      if (!ignore) {
        setTrackDB(result);
        setThisTrack(result[1]);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  /** onSubmit:
   * - save new hex to current trackID
   * - change trackID to next trackID
   */
  async function submitColor(hex) {
    console.log("submiting: ",hex);
    // Fetch data
    let tracks = await getData();
    // Get color array for current track
    let trackColors = tracks[trackID]["colors"];
    // Add new hex to color array
    trackColors.push(hex);
    // Update track object with new array
    tracks[trackID]["colors"] = trackColors;
    // Save data
    await storeData(tracks);
    // Check that we're not at the end of the tracklist
    if(trackID < Object.keys(tracks).length) {
      // If so, change to next trackID
      nextTrack(trackID + 1);
    } else {
      // Otherwise, go to final review page
      console.log('redir');
      navigate("/palettes");
    }
  }

  /** Prepare next track question:
   * - Set next track id
   * - Fetch next track data
   * - Reset color
   */
  function nextTrack(nextID) {
    setTrackID(nextID);
    setThisTrack(trackDB[nextID]);
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
  }

  function selectTrack(trackID) {
    console.log(trackID);
    setTrackID(trackID);
    setThisTrack(trackDB[trackID]);
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
  }

  async function getData() {
    try {
      const jsonValue = await AsyncStorage.getItem('tracks');
      console.log(JSON.parse(jsonValue));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log("ERROR: ");
    }
  }

  async function getOneData(id) {
    try {
      const rawJson = await AsyncStorage.getItem('tracks');
      const jsonValue = JSON.parse(rawJson);
      const oneValue = jsonValue[id];
      return oneValue != null ? oneValue : null;
    } catch (e) {
      // error reading value
      console.log("ERROR: ")
      console.log(e);
    }
  }

  async function storeData(value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('tracks', jsonValue);
    } catch (e) {
      // saving error
    }
  }

  async function initialPopulate() {
    try {
      const tracksInit = {
        1: {"title": "waxxx", "colors": ["#ffffff"], "link": S3_URL.concat("waxxx.mp3")}, 
        2: {"title": "pecans", "colors": ["#ffffff"], "link": S3_URL.concat("pecans.mp3")},
        3: {"title": "thunda", "colors": ["#ffffff"], "link": S3_URL.concat("thunda.mp3")}
      }
      await AsyncStorage.setItem('tracks', JSON.stringify(tracksInit));
      console.log('added');
      return tracksInit;
    } catch (e) {
      // saving error
    }
  }

  async function clearDB() {
    storeData({});
  }

  return (
    <div className="Universe" id="enter" style={{ background: hsvaToHex(hsva) }}>
      <Navbar />
      {/* <dark-mode permanent light="Light" dark="Dark"></dark-mode> */}
      <div className="ColorHolder">
        <h1>synthesia</h1>
        <h4><i>What does this sound look like?</i></h4>
        <div className="ColorBox">
          <div className="TextShiftLeft">
            <p className="TextBubble TBLeft">listen to this song...</p>
          </div>
          <TrackAudio track={thisTrack} />
        </div>
        <div className="ColorBox">
          <div className="TextShiftRight">
            <p className="TextBubble TBRight">...then pick the color it makes you feel</p>
          </div>
          <div className="ColorPickBox">
            <Colorful
              color={hsva}
              disableAlpha={true}
              onChange={(color) => {
                setHsva(color.hsva);
                setTextColor({});
              }}
              style={{ width: '300px' }}
            />
            <div className="ColorCard" style={{ background: hsvaToHex(hsva)}}>
              <p>{GetColorName(hsvaToHex(hsva))}</p>
              <p style={{color: hsvaToHex(textColor), mixBlendMode: "difference"}}>{JSON.stringify(hsvaToHex(hsva)).substring(1,8)}</p>
            </div>
          </div>
        </div>
        <button className="ColorSubmit" onClick={() => submitColor(hsvaToHex(hsva))}>SUBMIT</button>
        {(process.env.NODE_ENV == 'development') ? 
          (<>
            <button onClick={getData}>show</button>
            <button onClick={clearDB}>clear</button>
            <button onClick={initialPopulate}>populate</button>
          </>) : null }
        <div className="FormProgress">
          {Object.keys(trackDB).map(keyID => {
            return (
              <span 
                className={trackID == keyID ? "BoldID TrackNav" : "TrackNav"}
                key={keyID} 
                onClick={() => selectTrack(keyID)}>
                  {keyID}
              </span>
            );
          })}
          <button className="TrackNav" onClick={() => navigate("color")}>restart</button>
        </div>
      </div>
    </div>
  );
};

export default Color;
