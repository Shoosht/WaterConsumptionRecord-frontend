import { useContext } from 'react';
import { BillsContext } from "../Context/billContext";

export const useBillsContext = () => {
    const context = useContext(BillsContext)

    if (!context) {
        throw Error('useBillContext is not available')
    }

    return context
}
