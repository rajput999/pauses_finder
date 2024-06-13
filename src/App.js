import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Import CSS file

const recognition = new window.webkitSpeechRecognition(); // Create the recognition object outside of the component

const PauseDetectionApp = () => {
  const [isListening, setIsListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showPauseIndicator, setShowPauseIndicator] = useState(false);

  useEffect(() => {
    console.log('Effect hook called');

    recognition.continuous = true;
    recognition.interimResults = true;

    const handleRecognitionStart = () => {
      console.log('Recognition started');
      setPaused(false);
      setShowPauseIndicator(true);
    };

    const handleRecognitionEnd = () => {
      console.log('Recognition ended');
      setShowPauseIndicator(false);
    };

    const handleRecognitionResult = (event) => {
      console.log('Result received');
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // Do nothing for final results, as we're only interested in pauses
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setPaused(interimTranscript.trim().length === 0);
    };

    recognition.addEventListener('start', handleRecognitionStart);
    recognition.addEventListener('end', handleRecognitionEnd);
    recognition.addEventListener('result', handleRecognitionResult);

    return () => {
      console.log('Cleanup function called');
      recognition.removeEventListener('start', handleRecognitionStart);
      recognition.removeEventListener('end', handleRecognitionEnd);
      recognition.removeEventListener('result', handleRecognitionResult);
      recognition.stop();
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!isListening) {
      console.log('Start listening');
      recognition.start();
      setIsListening(true);
    } else {
      console.log('Stop listening');
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return (
    <div className="app">
      <h1>Pause Detection with Speech Recognition</h1>
      <button onClick={toggleListening} className={isListening ? 'listening' : ''}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="pause-indicator">
        <h2>Pause:</h2>
        <span className={showPauseIndicator ? 'show' : 'hide'}>
          {paused ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};

export default PauseDetectionApp;
