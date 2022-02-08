import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PregameAPI } from '../services';

export const fetchPlayerInfo = createAsyncThunk(
    "pregame/fetchPlayerInfo",
    async (gameID, thunkAPI) => {
        try {
            const response = await PregameAPI.getPlayerInfo(gameID);
            let result = response.data;

            if (response.status === 200) {
                return result;
            } else {
                throw thunkAPI.rejectWithValue(response.status);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchPlayerStatuses = createAsyncThunk(
    "pregame/fetchPlayerStatuses",
    async (gameID, thunkAPI) => {
        try {
            const response = await PregameAPI.getPlayerStatuses(gameID);
            let result = response.data;

            if (response.status === 200) {
                return result;
            } else {
                throw thunkAPI.rejectWithValue(response.status);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
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
    },
})

export const pregameSelector = state => state.pregame;