import { createContext, useReducer } from 'react';

export const RecordsContext = createContext()

export const recordsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RECORDS':
            return {
                records: action.payload
            }
            
        case 'CREATE_RECORD':
            return {
                records: [action.payload, ...state.records]
            }
            
        case 'DELETE_RECORD':
            return {
                records: state.records.filter((record) => record._id !== action.payload._id)
            }

        case 'UPDATE_RECORD':
            return {
                records: state.records.map((record) => 
                    record._id === action.payload._id ? action.payload : record
                )
            }
        case 'LOGOUT':
            return { records: [] }

        default:
            return state
    } 
}

export function RecordContextProvider ({ children }) {
    const [state, dispatch] = useReducer(recordsReducer, {
        records: []
    })

    return (
        <RecordsContext.Provider value={{...state, dispatch}}>
            {children}
        </RecordsContext.Provider>
    )
}
