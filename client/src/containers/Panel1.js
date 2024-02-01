import React from 'react'
import { useState, useRef } from 'react'
import TextBox from '../components/TextBox'
import Microphone from '../components/Microphone'

import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';


const Panel1 = () => {
    const [isRecording, setRecording] = useState(false);
    const [transcriptionText, setTranscription] = useState("");
    const [partialTranscription, setPartialTranscription] =  useState("");
    const streamRef = useRef(null);
    let modelName = "en-US_BroadbandModel";

    function toggleRecording () {
        if (!isRecording) {
            onStartRecording();
        }
        else {
            onStopRecording();
        }
        setRecording(!isRecording);
    }

    const onStopRecording = () => {
        setRecording(false);
        if (streamRef.current)
            streamRef.current.stop();
            streamRef.current = null;
        console.log("Stopping recording");
    }

    const onStartRecording = async () => {
        setTranscription("");
        setPartialTranscription("");

        console.log("Starting recording");

        await fetch('http://localhost:3001/api/token')
            .then((response) => {
                return response.text();
            })
            .then((token) => {
                const { accessToken, url } = JSON.parse(token);
                streamRef.current = recognizeMicrophone({
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

                streamRef.current.on('data', (data) => {
                    if (data.final) {
                        setTranscription((prevTranscription) => `${prevTranscription}${data.alternatives[0].transcript}`);
                        setPartialTranscription("");
                    }
                    else {
                        setPartialTranscription(data.alternatives[0].transcript);
                    }

                });

                streamRef.current.on('error', (err) => {
                    console.log(err);
                    onStopRecording();
                });

            })
            .catch(error => {
                console.error('Error fetching the token', error);
            });
    }

    return(
        <div className="tc bg-light-blue br3 pa3 ma2 dib bw2 shadow-5">
            <TextBox value={`${transcriptionText}${partialTranscription}`} setValue={setTranscription} isEditable={!isRecording}/>
            <Microphone setRecording={toggleRecording} isRecording={isRecording}/>
        </div>
    );
}
export default Panel1;