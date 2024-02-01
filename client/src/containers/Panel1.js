import React from 'react'
import { useState } from 'react'
import TextBox from '../components/TextBox'
import Microphone from '../components/Microphone'

import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';


const Panel1 = () => {
    const [isRecording, setRecording] = useState(false);
    const [isTranscribing, setTranscribing] = useState(false);
    const [transcriptionText, setTranscription] = useState("");
    let stream = null;
    let modelName = "en-US_BroadbandModel";

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
        if (stream !== null)
            stream.stop();
        console.log("Stopping recording");
    }

    const onStartRecording = async () => {
        setTranscribing(true);
        setTranscription("");

        console.log("Starting recording");

        await fetch('http://localhost:3001/api/token')
            .then((response) => {
                return response.text();
            })
            .then((token) => {
                const { accessToken, url } = JSON.parse(token);
                stream = recognizeMicrophone({
                    accessToken: accessToken, // use accessToken, even if only token is accepted: otherwise it won't work
                    url: url,
                    objectMode: true, // enables formatted text
                    extractResults: true, // simplifies the response
                    format: false, // adds capitals, periods, and a few other things (requires extractResults: true)
                    keywords: undefined,
                    keywordsThreshold: undefined,
                    model: modelName,
                    realtime: true,
                    resultsBySpeaker: false,
                    timestamps: true,
                    keepMicrophone: true,
                });

                stream.on('data', (data) => {
                    setTranscription(data.alternatives[0].transcript);
                });

                stream.on('error', (err) => {
                    console.log(err);
                });

            })
            .catch(error => {
                console.error('Error fetching the token', error);
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