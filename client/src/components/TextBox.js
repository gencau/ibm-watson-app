import React from "react";

const TextBox = ({value, transriptionReceived}) => {
    return (
        <div>
            <div>
                <label className="f4 b db mb2">Recognized phrase <span className="normal black-60"></span></label>
                <textarea id="phrase" 
                          name="phrase" 
                          className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" 
                          aria-describedby="phrase-desc" 
                          placeholder="Transcription will appear here..."></textarea>
                <small id="phrase-desc" className="f6 black-60">Transcibed text will appear here. To modify the transcription, just edit the text field.</small>
            </div>
        </div>
    );
}
export default TextBox;