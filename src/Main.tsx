import {continueRender} from 'remotion';
import {Audio, delayRender} from 'remotion';
import {useCallback, useEffect, useRef, useState} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import randomValues from './randomValues';
import darknoiseBg from '../assets/darknoise.png';

type ImageBlock = {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	width: number;
	height: number;
	data: ImageData;
};

const Main: React.FC<{
	imageSrc: string;
	audioSrc: string;
	preset: 'fromLeft' | 'fromRight' | 'fromTop' | 'fromBottom' | 'random';
}> = ({imageSrc, audioSrc, preset}) => {
	const {width, height} = useVideoConfig();
	const [blocks, setBlocks] = useState<ImageBlock[]>([]);
	const [handle] = useState(() => delayRender());

	const getBlocks = useCallback(() => {
		const image = new Image();
		image.src = imageSrc;

		image.addEventListener('load', () => {
			const canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return;
			}

			ctx.drawImage(image, 0, 0);

			const imageBlocks: ImageBlock[] = [];

			let x = 0;
			let y = 0;

			const BLOCK_WIDTH = image.width / 10;
			const BLOCK_HEIGHT = image.height / 10;
			const BLOCK_NUM = 10 * 10;

			for (let i = 0; i < BLOCK_NUM; i++) {
				const imageBlock = {
					toX: x,
					toY: y,
					fromX: randomValues[i].x,
					fromY: randomValues[i].y,
					width: BLOCK_WIDTH,
					height: BLOCK_HEIGHT,
					data: ctx.getImageData(x, y, BLOCK_WIDTH, BLOCK_HEIGHT),
				};

				if (preset === 'fromLeft') {
					imageBlock.fromX = -BLOCK_WIDTH;
					imageBlock.fromY = y;
				} else if (preset === 'fromRight') {
					imageBlock.fromX = width;
					imageBlock.fromY = y;
				} else if (preset === 'fromTop') {
					imageBlock.fromY = -BLOCK_HEIGHT;
					imageBlock.fromX = x;
				} else if (preset === 'fromBottom') {
					imageBlock.fromY = height;
					imageBlock.fromX = x;
				} else if (preset === 'random') {
					imageBlock.fromX = randomValues[i].x;
					imageBlock.fromY = randomValues[i].y;
				}

				imageBlocks.push(imageBlock);

				x += BLOCK_WIDTH;
				if (x === image.width) {
					x = 0;
					y += BLOCK_HEIGHT;
				}
			}

			setBlocks(imageBlocks);
			continueRender(handle);
		});
	}, [handle, imageSrc, preset, width, height]);

	useEffect(() => {
		getBlocks();
	}, [getBlocks]);

	return (
		<div
			style={{
				backgroundImage: `url(${darknoiseBg})`,
				width: `${width}px`,
				height: `${height}px`,
			}}
		>
			<Audio src={audioSrc} />
			{blocks.map((d, i) => (
				<ImageCanvas key={i} block={d} />
			))}
		</div>
	);
};

const ImageCanvas: React.FC<{
	block: ImageBlock;
}> = ({block}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.width = block.width;
			canvas.height = block.height;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.putImageData(block.data, 0, 0);
			}
		}
	}, [block.data, block.width, block.height]);

	const x = spring({
		from: block.fromX,
		to: block.toX,
		frame,
		fps,
		durationInFrames: 300,
	});

	const y = spring({
		from: block.fromY,
		to: block.toY,
		frame,
		fps,
		durationInFrames: 300,
	});

	const rotate = spring({
		from: 2,
		to: 0,
		frame,
		fps,
		durationInFrames: 300,
	});

	const borderRadius = block.toX - x < 1 || block.toY - y < 1 ? '5px' : '50%';

	return (
		<>
			<canvas
				ref={canvasRef}
				width={block.width}
				height={block.height}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					borderRadius,
					boxShadow: '0 0 10px rgba(0,0,0,0.5)',
					transform: `rotate(${rotate}turn)`,
				}}
			/>
		</>
	);
};

export default Main;
