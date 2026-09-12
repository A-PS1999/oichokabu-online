import type { UserState } from './userSlice';
import type { ToastState } from './toastSlice';
import type { ModalState } from './modalSlice';
import type { LobbyState } from './lobbySlice';
import type { PregameState } from './pregameSlice';
import type { GameSliceState } from './gameSlice';

export type RootState = {
	user: UserState;
	toasts: ToastState;
	modal: ModalState;
	lobby: LobbyState;
	pregame: PregameState;
	game: GameSliceState;
};

