import YouTube from "react-youtube";

interface ITrailerProps {
    videoId: string;
    height: string;
    width: string;
    onError: (event: any) => void;
}

function Trailer({ videoId, height, width, onError }: ITrailerProps) {
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
        <YouTube videoId={videoId} opts={opts} onError={onError} />
    );
}

export default Trailer;