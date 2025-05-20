import { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './newRecordPage.css';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import { useAuthContext } from '../../Hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function NewRecordPage() {
    const {records, dispatch} = useRecordsContext()
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchRecords = async () => {
            const response = await fetch('/api/records', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_RECORDS', payload: json})
            }
        };
        if (user) {
            fetchRecords();
        }
    }, [dispatch, user]);


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in.')
            return
        }

        const record = { year, month, amount }

        const response = await fetch('/api/records', {
            method: 'POST',
            body: JSON.stringify(record),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if(response.ok){
            setYear('')
            setMonth('')
            setAmount('')
            setError(null)
            setEmptyFields([])
            console.log('new record added', json)
            dispatch({type: 'CREATE_RECORD', payload: json})
        }
    }

    return (
        <div >
            <Navbar></Navbar>
            <div className="nrp-parent">
                <div className="submit-form-centered">
                    <form className="add-new-form" onSubmit={handleSubmit}>
                        <div className="form-text">
                            <div className="nrp-title">Add a new record</div>
                            <div className="form-group">
                                <label className="input-text">Year:</label>
                                <input className={`nrp-input-field ${emptyFields.includes('year') ? 'error' : ''}`} type="number" onChange={(e)=>setYear(e.target.value)} value={year}></input>
                            </div>
                            <div className="form-group">
                                <label className="input-text">Month:</label>
                                <input className={`nrp-input-field ${emptyFields.includes('month') ? 'error' : ''}`} type="number" onChange={(e)=>setMonth(e.target.value)} value={month}></input>
                            </div>
                            <div className="form-group">
                                <label className="input-text">Amount:</label>
                                <input className={`nrp-input-field ${emptyFields.includes('amount') ? 'error' : ''}`} type="number" onChange={(e)=>setAmount(e.target.value)} value={amount}></input>
                            </div>
                        </div>
                        <button className="record-button">Add the record</button>
                        {error && <div className="nrp-error-msg">{error}</div>}
                    </form>
                </div>

                <div className="nrp-right-child">   
                    <div className="nrp-record-title">Your records:</div>
                    {records && records.map((record)=>(
                        <div className="nrp-record-box">
                            <div className="nrp-amount-date">
                                <div className="nrp-record-amount-parent">
                                    <div className="nrp-record-amount-left">Amount: </div>
                                    <div className="nrp-record-amount-right">{record.amount}m³</div>
                                </div>
                                <div className="nrp-record-createdat">{formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}</div>
                            </div>
                            
                            
                            <div className="nrp-record-date"> Date: {record.month}.{record.year}.</div>
                           
                        </div>
                    ))
                    }
                    
                </div>
            </div>
            
        </div>
    )
}

export default NewRecordPage