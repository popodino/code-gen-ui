import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        value: {}
    },

    reducers: {
        login: (state,action) => {
            state.value = action.payload
        },
        logout: state => {
            state.value = {}
        }
    }
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer