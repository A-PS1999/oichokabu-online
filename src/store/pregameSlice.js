import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PregameAPI } from '../services';

export const fetchPlayerInfo = createAsyncThunk(
    "pregame/fetchPlayerInfo",
    async (gameID) => {
        return await PregameAPI.getPlayerInfo(gameID);
    }
)

export const fetchPlayerStatuses = createAsyncThunk(
    "pregame/fetchPlayerStatuses",
    async (gameID) => {
        return await PregameAPI.getPlayerStatuses(gameID);
    }
)

export const handleStartGame = createAsyncThunk(
    "pregame/handleStartGame",
    async (gameID, thunkAPI) => {
        try {
            return await PregameAPI.postGameStart(gameID);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.errorMsg);
        }
    }
)

export const toggleReady = createAsyncThunk(
    "pregame/toggleReady",
    async (gameID) => {
        return await PregameAPI.postReadyStatus(gameID);
    }
)

export const leaveGame = createAsyncThunk(
    "pregame/leaveGame",
    async (gameID, thunkAPI) => {
        try {
            return await PregameAPI.postLeaveGame(gameID);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.errorMsg);
        }
    }
)

const initialPregameState = () => ({
    ready: false,
    playerInfo: [],
    playerStatuses: [],
    gameStatus: null,
    isFetching: false,
    isError: false,
    errorMessage: "",
})

export const pregameSlice = createSlice({
    name: 'pregame',
    initialState: initialPregameState(),
    reducers: {
        pregameStateReset: (state) => {
            const nextState = initialPregameState();
            state.ready = nextState.ready;
            state.playerInfo = nextState.playerInfo;
            state.playerStatuses = nextState.playerStatuses;
            state.gameStatus = nextState.gameStatus;
            state.isFetching = nextState.isFetching;
            state.isError = nextState.isError;
            state.errorMessage = nextState.errorMessage;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPlayerInfo.fulfilled, (state, action) => {
            state.isFetching = false;
            state.playerInfo = action.payload;
        })
        builder.addCase(fetchPlayerInfo.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(fetchPlayerInfo.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
        builder.addCase(fetchPlayerStatuses.fulfilled, (state, action) => {
            state.isFetching = false;
            state.playerStatuses = action.payload;
        })
        builder.addCase(fetchPlayerStatuses.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(fetchPlayerStatuses.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
        builder.addCase(handleStartGame.fulfilled, (state) => {
            state.isFetching = false;
        })
        builder.addCase(handleStartGame.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(handleStartGame.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
        builder.addCase(toggleReady.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(toggleReady.fulfilled, (state) => {
            state.isFetching = false;
        })
        builder.addCase(toggleReady.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
        builder.addCase(leaveGame.pending, (state) => {
            state.isFetching = true;
        })
        builder.addCase(leaveGame.fulfilled, (state) => {
            state.isFetching = false;
        })
        builder.addCase(leaveGame.rejected, (state, action) => {
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = action.payload;
        })
    },
})

export const { pregameStateReset } = pregameSlice.actions;
export const pregameSelector = state => state.pregame;