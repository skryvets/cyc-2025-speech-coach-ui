import { useCallback, useEffect, useRef, useState } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingState, setRecordingState] = useState('inactive');
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const cleanup = useCallback(async () => {
    // Stop all media tracks to release microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      streamRef.current = null;
    }

    // Clear MediaRecorder reference
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
    setRecordingState('inactive');
  }, []);

  const sendAudioChunk = useCallback(async (audioData: Blob) => {
    try {
      const response = await fetch('/transcribe', {
        method: 'POST',
        body: audioData,
        headers: {
          'Content-Type': 'audio/webm',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Transcription result:", result);

      return result;
    } catch (error) {
      console.error("Error sending audio chunk:", error);
      const e = error as Error;
      setError(`Failed to send audio: ${e.message}`);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      console.log("Stopping recording...");

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        console.log("Recorder state:", mediaRecorderRef.current.state);
      }

      await cleanup();
      console.log("Recording stopped successfully");

    } catch (error) {
      console.error("Error stopping recording:", error);
      const e = error as Error;
      setError(`Failed to stop recording: ${e.message}`);
    }
  }, [cleanup]);

  const setupMediaRecorderHandlers = useCallback((mediaRecorder: MediaRecorder) => {
    mediaRecorder.ondataavailable = async (event: BlobEvent) => {
      if (event.data.size > 0) {
        try {
          await sendAudioChunk(event.data);
        } catch (error) {
          console.error("Error processing audio chunk:", error);
        }
      }
    };

    mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped");
      setIsRecording(false);
      setRecordingState('inactive');
    };

    mediaRecorder.onerror = async (event) => {
      console.error("MediaRecorder error:", event.error);
      setError(`Recording error: ${event.error}`);
      await stopRecording();
    };

    mediaRecorder.onstart = () => {
      console.log("MediaRecorder started");
      setRecordingState('recording');
    };
  }, [sendAudioChunk, stopRecording]);


  const startRecording = useCallback(async () => {
    try {
      if (isRecording) {
        console.log("Recording is already in progress");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia not supported on your browser!");
      }

      setError(null);
      console.log("Starting recording...");

      // Get user media stream
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);

      // Set up event handlers
      setupMediaRecorderHandlers(mediaRecorderRef.current);

      // Start recording with 1.5 second chunks
      mediaRecorderRef.current.start(1500);
      setIsRecording(true);

      console.log("Recorder started successfully");

    } catch (error) {
      const e = error as Error
      console.error("Error starting recording:", e.message);
      setError(`Failed to start recording: ${e.message}`);
      await cleanup();
    }
  }, [isRecording, setupMediaRecorderHandlers, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    recordingState,
    error,
    startRecording,
    stopRecording,
  };
};
