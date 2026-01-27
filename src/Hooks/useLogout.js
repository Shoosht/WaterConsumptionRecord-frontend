import { useAuthContext } from "./useAuthContext"
import { useBillsContext } from "./useBillContext"
import { useRecordsContext } from "./useRecordContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: recordsDispatch } = useRecordsContext()
    const { dispatch: billsDispatch } = useBillsContext()

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({type: 'LOGOUT'})

        recordsDispatch({type: 'LOGOUT'})

        billsDispatch({type: 'LOGOUT'})
    }

    return { logout }
}