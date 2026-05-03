import { useAuthContext } from './useAuthContext';
import { useRecordsContext } from './useRecordContext';
import { useBillsContext } from './useBillContext';

export const useGuestLogin = () => {
    const { dispatch: authDispatch } = useAuthContext();
    const { dispatch: recordsDispatch } = useRecordsContext();
    const { dispatch: billsDispatch } = useBillsContext();

    const loginAsGuest = () => {
        const guestUser = {
            _id: 'guest-user-id',
            email: 'guest@demo.com',
            name: 'Demo User',
            city: 'Demo Town',
            address: 'Demo Street 123',
            monthlyLimit: 15,
            token: 'guest-token'
        };

        const currentYear = new Date().getFullYear();
        const mockRecords = [
            { _id: 'r1', year: currentYear - 1, month: 1, amount: 12.5, paid: true, createdAt: '2024-01-15T10:00:00.000Z' },
            { _id: 'r2', year: currentYear - 1, month: 2, amount: 11.8, paid: true, createdAt: '2024-02-15T10:00:00.000Z' },
            { _id: 'r3', year: currentYear - 1, month: 3, amount: 13.2, paid: true, createdAt: '2024-03-15T10:00:00.000Z' },
            { _id: 'r4', year: currentYear - 1, month: 4, amount: 14.1, paid: true, createdAt: '2024-04-15T10:00:00.000Z' },
            { _id: 'r5', year: currentYear - 1, month: 5, amount: 15.7, paid: true, createdAt: '2024-05-15T10:00:00.000Z' },
            { _id: 'r6', year: currentYear - 1, month: 6, amount: 16.2, paid: true, createdAt: '2024-06-15T10:00:00.000Z' },
            { _id: 'r7', year: currentYear - 1, month: 7, amount: 17.8, paid: true, createdAt: '2024-07-15T10:00:00.000Z' },
            { _id: 'r8', year: currentYear - 1, month: 8, amount: 16.5, paid: true, createdAt: '2024-08-15T10:00:00.000Z' },
            { _id: 'r9', year: currentYear - 1, month: 9, amount: 14.3, paid: true, createdAt: '2024-09-15T10:00:00.000Z' },
            { _id: 'r10', year: currentYear - 1, month: 10, amount: 13.1, paid: true, createdAt: '2024-10-15T10:00:00.000Z' },
            { _id: 'r11', year: currentYear - 1, month: 11, amount: 12.9, paid: true, createdAt: '2024-11-15T10:00:00.000Z' },
            { _id: 'r12', year: currentYear - 1, month: 12, amount: 13.4, paid: true, createdAt: '2024-12-15T10:00:00.000Z' },
            
            { _id: 'r13', year: currentYear, month: 1, amount: 14.2, paid: true, createdAt: '2025-01-15T10:00:00.000Z' },
            { _id: 'r14', year: currentYear, month: 2, amount: 13.5, paid: true, createdAt: '2025-02-15T10:00:00.000Z' },
            { _id: 'r15', year: currentYear, month: 3, amount: 15.1, paid: true, createdAt: '2025-03-15T10:00:00.000Z' },
            { _id: 'r16', year: currentYear, month: 4, amount: 12.8, paid: false, createdAt: '2025-04-15T10:00:00.000Z' }
        ];

        const mockBills = [
            { _id: 'b1', year: currentYear - 1, month: 1, amount: 12.5, price: 21.63, paid: true, paid_by: 'guest@demo.com', record_id: 'r1' },
            { _id: 'b2', year: currentYear - 1, month: 2, amount: 11.8, price: 20.41, paid: true, paid_by: 'guest@demo.com', record_id: 'r2' },
            { _id: 'b3', year: currentYear - 1, month: 3, amount: 13.2, price: 22.84, paid: true, paid_by: 'guest@demo.com', record_id: 'r3' },
            { _id: 'b4', year: currentYear - 1, month: 4, amount: 14.1, price: 24.39, paid: true, paid_by: 'guest@demo.com', record_id: 'r4' },
            { _id: 'b5', year: currentYear - 1, month: 5, amount: 15.7, price: 27.16, paid: true, paid_by: 'guest@demo.com', record_id: 'r5' },
            { _id: 'b6', year: currentYear - 1, month: 6, amount: 16.2, price: 28.03, paid: true, paid_by: 'guest@demo.com', record_id: 'r6' },
            { _id: 'b7', year: currentYear - 1, month: 7, amount: 17.8, price: 30.79, paid: true, paid_by: 'guest@demo.com', record_id: 'r7' },
            { _id: 'b8', year: currentYear - 1, month: 8, amount: 16.5, price: 28.55, paid: true, paid_by: 'guest@demo.com', record_id: 'r8' },
            { _id: 'b9', year: currentYear - 1, month: 9, amount: 14.3, price: 24.74, paid: true, paid_by: 'guest@demo.com', record_id: 'r9' },
            { _id: 'b10', year: currentYear - 1, month: 10, amount: 13.1, price: 22.66, paid: true, paid_by: 'guest@demo.com', record_id: 'r10' },
            { _id: 'b11', year: currentYear - 1, month: 11, amount: 12.9, price: 22.32, paid: true, paid_by: 'guest@demo.com', record_id: 'r11' },
            { _id: 'b12', year: currentYear - 1, month: 12, amount: 13.4, price: 23.18, paid: true, paid_by: 'guest@demo.com', record_id: 'r12' },
            { _id: 'b13', year: currentYear, month: 1, amount: 14.2, price: 24.57, paid: true, paid_by: 'guest@demo.com', record_id: 'r13' },
            { _id: 'b14', year: currentYear, month: 2, amount: 13.5, price: 23.36, paid: true, paid_by: 'guest@demo.com', record_id: 'r14' },
            { _id: 'b15', year: currentYear, month: 3, amount: 15.1, price: 26.12, paid: true, paid_by: 'guest@demo.com', record_id: 'r15' },
            { _id: 'b16', year: currentYear, month: 4, amount: 12.8, price: 22.14, paid: false, paid_by: null, record_id: 'r16' }
        ];

        localStorage.setItem('user', JSON.stringify(guestUser));
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('guestRecords', JSON.stringify(mockRecords));
        localStorage.setItem('guestBills', JSON.stringify(mockBills));

        authDispatch({ type: 'LOGIN_GUEST', payload: guestUser });
        recordsDispatch({ type: 'SET_RECORDS', payload: mockRecords });
        billsDispatch({ type: 'SET_BILLS', payload: mockBills });
    };

    return { loginAsGuest };
};