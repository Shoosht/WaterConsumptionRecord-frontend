import { useContext } from 'react';
import { RecordsContext } from "../Context/recordContext";;

export const useRecordsContext = () => {
    const context = useContext(RecordsContext)

    if (!context) {
        throw Error('useRecordsContext is not available')
    }

    return context
}
