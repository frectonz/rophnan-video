import {Composition} from 'remotion';
import Main from './Main';
import rophnanAudio from '../assets/rophnan.mp3';
import rophnanImage from '../assets/rophnan.jpg';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1080;
const DURATION_IN_FRAMES = 600;

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Random"
				component={() => (
					<Main
						imageSrc={rophnanImage}
						audioSrc={rophnanAudio}
						preset="random"
					/>
				)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				durationInFrames={DURATION_IN_FRAMES}
			/>

			<Composition
				id="FromLeft"
				component={() => (
					<Main
						imageSrc={rophnanImage}
						audioSrc={rophnanAudio}
						preset="fromLeft"
					/>
				)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				durationInFrames={DURATION_IN_FRAMES}
			/>

			<Composition
				id="FromRight"
				component={() => (
					<Main
						imageSrc={rophnanImage}
						audioSrc={rophnanAudio}
						preset="fromRight"
					/>
				)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				durationInFrames={DURATION_IN_FRAMES}
			/>

			<Composition
				id="FromTop"
				component={() => (
					<Main
						imageSrc={rophnanImage}
						audioSrc={rophnanAudio}
						preset="fromTop"
					/>
				)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				durationInFrames={DURATION_IN_FRAMES}
			/>

			<Composition
				id="FromBottom"
				component={() => (
					<Main
						imageSrc={rophnanImage}
						audioSrc={rophnanAudio}
						preset="fromBottom"
					/>
				)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				durationInFrames={600}
			/>
		</>
	);
};
