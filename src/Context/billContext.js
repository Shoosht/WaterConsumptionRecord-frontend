import { createContext, useReducer } from 'react';

export const BillsContext = createContext()

export const billsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BILLS':
            return {
                bills: action.payload
            }
            
        case 'CREATE_BILL':
            return {
                bills: [action.payload, ...state.bills]
            }

        case 'UPDATE_BILL':
            return {
                bills: state.bills.map((bill) => 
                    bill._id === action.payload._id ? action.payload : bill
                )
            }
        case 'LOGOUT':
            return { bills: [] }

        default:
            return state
    } 
}

export function BillsContextProvider ({ children }) {
    const [state, dispatch] = useReducer(billsReducer, {
        bills: []
    })

    return (
        <BillsContext.Provider value={{...state, dispatch}}>
            {children}
        </BillsContext.Provider>
    )
}
