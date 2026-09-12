import type { PlayerAuth } from '@shared/api';
import './StartScreen.scss';

export type StartScreenProps = {
	playerAuth: PlayerAuth | null;
	onStart: () => void;
};

export default function StartScreen({ playerAuth, onStart }: StartScreenProps) {
	return (
		<div className="startscreen">
			{playerAuth && playerAuth.host.host ? (
				<div className="startscreen__inner">
					<button onClick={onStart} className="startscreen__inner__button">
						Start Game
					</button>
				</div>
			) : (
				<div className="startscreen__inner">
					<div className="startscreen__inner__wait-text">
						Waiting for the host to start the game...
					</div>
				</div>
			)}
		</div>
	);
}