import { useAuthContext } from "./useAuthContext"
import { useRecordsContext } from "./useRecordContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: recordsDispatch } = useRecordsContext()

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({type: 'LOGOUT'})

        recordsDispatch({type: 'SET_RECORDS', payload: null})
    }

    return { logout }
}