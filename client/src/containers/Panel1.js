import React from 'react'
import { useState } from 'react'
import TextBox from '../components/TextBox'
import Microphone from '../components/Microphone'

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';


const Panel1 = () => {
    const [isRecording, setRecording] = useState(false);
    const [isTranscribing, setTranscribing] = useState(false);
    const [transcriptionText, setTranscription] = useState("");

    function setTranscriptionText(text) {
        setTranscription(text);
    }

    function toggleRecording () {
        setRecording(!isRecording);

        if (isRecording)
            onStartRecording();

        if (!isRecording)
            onStopRecording();
    }

    const onStopRecording = () => {
        setTranscription("");
    }

    const onStartRecording = () => {
        fetch('api/token')
            .then((response) => {
                return response.text();
            })
            .then((token) => {
                console.log(token);
                let stream = recognizeMic({
                    token:token,
                    objectMode: true,
                    extractResults: true,
                    format: false
                });

                stream.on('data', (data) => {
                    this.setState({
                        text: data.alternatives[0].transcript
                    })
                    
                    console.log(data.alternatives[0].transcript)
                });
                stream.on('error', function(err) {
                    console.log(err);
                });
            })
            .catch(function(err) {
                console.log(err);
            })
    }

    return(
        <div className="tc bg-light-blue br3 pa3 ma2 dib bw2 shadow-5">
            <TextBox value={transcriptionText}/>
            <Microphone setRecording={toggleRecording} isRecording={isRecording}/>
        </div>
    );
}
export default Panel1;