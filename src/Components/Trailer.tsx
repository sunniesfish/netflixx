import { useEffect, useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

interface ITrailerProps {
    videoId: string;
    height: string;
    width: string;
    onError: (event: any) => void;
}

function Trailer({ videoId, height, width, onError }: ITrailerProps) {
    const playerRef = useRef<YouTubePlayer|null>(null);
    const onReady = (event:{target:YouTubePlayer}) => {
        playerRef.current = event.target;
    }
    useEffect(()=>{
        return () => {
            if(playerRef.current){
                playerRef.current.destroy();
            }
        }
    },[]);
    const opts = {
        height,
        width,
        playerVars: {
            autoplay: 1,
            loop: 1,
            mute: 1,
            modestbranding: 1
        }
    };

    return (
        <YouTube videoId={videoId} opts={opts} onError={onError} onReady={onReady}/>
    );
}

export default Trailer;