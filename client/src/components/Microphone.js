import React from "react";

const Microphone = ({setRecording, isRecording}) => {

    return (
        <div>
             <a className="pa3" 
                href="#0">
                    <img className="pa3 mic" 
                         src={isRecording ? 'mic-red.png':'mic.png'}
                         width="40px"
                         alt='Microphone'
                         onClick={setRecording}
                    />
            </a>
        </div>
    );

}
export default Microphone;