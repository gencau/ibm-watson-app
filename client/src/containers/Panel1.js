import React from 'react'
import { useState } from 'react'
import TextBox from '../components/TextBox'
import Microphone from '../components/Microphone'

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';


const Panel1 = () => {
    const [isRecording, setRecording] = useState(false);
    const [isTranscribing, setTranscribing] = useState(false);
    const [transcriptionText, setTranscription] = useState("");

    function toggleRecording () {
        if (isRecording === false) {
            onStartRecording();
            setRecording(true);
        }
        else {
            onStopRecording();
            setRecording(false);
        }
    }

    const onStopRecording = () => {
        setTranscribing(false);
        console.log("Stopping recording");
    }

    const onStartRecording = () => {
        setTranscribing(true);
        setTranscription("");

        console.log("Starting recording");
        fetch('http://localhost:3001/recognize', {
            method: 'POST',
            headers: {
                'Content-Type': 'audio/wav'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((transcription) => {
                console.log("Transcription: " + transcription);
                setTranscription(transcription);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    return(
        <div className="tc bg-light-blue br3 pa3 ma2 dib bw2 shadow-5">
            <TextBox value={transcriptionText} setValue={setTranscription}/>
            <Microphone setRecording={toggleRecording} isRecording={isRecording}/>
        </div>
    );
}
export default Panel1;