import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertTriangle } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';

const VideoCallRoom = ({ session, onLeaveCall }) => {
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const videoRef = useRef(null);

    const otherUser = session?.mentor || session?.student || { name: 'Demo User', headline: 'Demo Headline' };

    useEffect(() => {
        let isMounted = true;

        const startMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('Camera permission denied or device not found.');
                    console.error('Error accessing media devices.', err);
                }
            }
        };

        startMedia();

        const timer = setInterval(() => {
            if (isMounted) setDuration((prev) => prev + 1);
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(timer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const handleLeave = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        onLeaveCall();
    };

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const retryMedia = async () => {
        setError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError('Camera permission denied or device not found.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col h-screen w-full">
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-md flex items-center shadow-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                DEMO Mode — Video preview only
            </div>

            <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg text-lg font-mono tracking-wider backdrop-blur-md shadow-lg border border-white/10">
                {formatDuration(duration)}
            </div>

            <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 pb-24 relative overflow-hidden">
                <div className="flex-1 relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex items-center justify-center">
                    {error ? (
                        <div className="text-center p-6">
                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-white mb-4">{error}</p>
                            <button onClick={retryMedia} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Retry Camera
                            </button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transform -scale-x-100 ${isVideoOff ? 'hidden' : ''}`}
                            />
                            {isVideoOff && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-300">
                                        You
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-white text-sm backdrop-blur-sm">
                                You
                            </div>
                        </>
                    )}
                </div>

                <div className="w-full md:w-1/3 relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex items-center justify-center flex-col p-6">
                    <img
                        src={getAvatarUrl(otherUser)}
                        alt={otherUser.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-600 shadow-2xl mb-4"
                    />
                    <h3 className="text-xl font-medium text-white mb-1">{otherUser.name}</h3>
                    <p className="text-slate-400 text-sm text-center mb-6">Connecting to peer...</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 to-transparent p-6 flex justify-center items-center gap-4">
                <button
                    onClick={toggleMute}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                        isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                    onClick={toggleVideo}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                        isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
                <button
                    onClick={handleLeave}
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-lg ml-4"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default VideoCallRoom;
