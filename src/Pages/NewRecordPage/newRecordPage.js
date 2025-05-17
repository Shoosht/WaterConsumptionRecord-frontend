import { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './newRecordPage.css';
import { useRecordsContext } from '../../Hooks/useRecordContext';


function NewRecordPage() {
    const {records, dispatch} = useRecordsContext()
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRecords = async () => {
            const response = await fetch('/api/records');
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_RECORDS', payload: json})
            }
        };
        fetchRecords();
    }, [dispatch]);


    const handleSubmit = async (e) => {
        e.preventDefault()

        const record = { year, month, amount }

        const response = await fetch('/api/records', {
            method: 'POST',
            body: JSON.stringify(record),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if(!response.ok){
            setError(json.error)
        }

        if(response.ok){
            setYear('')
            setMonth('')
            setAmount('')
            setError(null)
            console.log('new record added', json)
            dispatch({type: 'CREATE_RECORD', payload: json})
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="submit-form-centered">
                <form className="add-new-form" onSubmit={handleSubmit}>
                    <div className="form-text">
                        <div className="form-group">
                            <label className="input-text">Year:</label>
                            <input className="nrp-input-field" type="number" onChange={(e)=>setYear(e.target.value)} value={year}></input>
                        </div>
                        <div className="form-group">
                            <label className="input-text">Month:</label>
                            <input className="nrp-input-field" type="number" onChange={(e)=>setMonth(e.target.value)} value={month}></input>
                        </div>
                        <div className="form-group">
                            <label className="input-text">Amount:</label>
                            <input className="nrp-input-field" type="number" onChange={(e)=>setAmount(e.target.value)} value={amount}></input>
                        </div>
                    </div>
                    <button className="record-button">Add the record</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>

            <div>
                <div >
                    {records && records.map((record)=>(
                        <div key={record._id}>{record.amount}    {record.month}    {record.year}</div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default NewRecordPage