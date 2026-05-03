import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGIN_GUEST':
            return { user: action.payload, isGuest: true }
        case 'LOGOUT':
            return { user: null, isGuest: false }
        default:
            return state
    }
} 

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isGuest: false
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const isGuest = localStorage.getItem('isGuest') === 'true'

        if (user || isGuest) {
            if (isGuest) {
                dispatch({ type: 'LOGIN_GUEST', payload: user })
            } else {
                dispatch({type: 'LOGIN', payload: user})
            }
        }
    }, [])

    console.log('auth state: ', state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}