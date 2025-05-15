import { useState } from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './newRecordPage.css';

function NewRecordPage() {
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState(null)

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
                            <input type="number" onChange={(e)=>setYear(e.target.value)} value={year}></input>
                        </div>
                        <div className="form-group">
                            <label className="input-text">Month:</label>
                            <input type="number" onChange={(e)=>setMonth(e.target.value)} value={month}></input>
                        </div>
                        <div className="form-group">
                            <label className="input-text">Amount:</label>
                            <input type="number" onChange={(e)=>setAmount(e.target.value)} value={amount}></input>
                        </div>
                    </div>
                    <button className="record-button">Add the record</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default NewRecordPage