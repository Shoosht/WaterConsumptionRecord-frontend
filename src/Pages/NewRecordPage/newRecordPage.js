import { useState } from 'react'

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
        <form className="add-new-form" onSubmit={handleSubmit}>
            <div className="form-text">
                <label>Year:</label>
                <input type="number" onChange={(e)=>setYear(e.target.value)} value={year}></input>
                <label>Month:</label>
                <input type="number" onChange={(e)=>setMonth(e.target.value)} value={month}></input>
                <label>Amount:</label>
                <input type="number" onChange={(e)=>setAmount(e.target.value)} value={amount}></input>
            </div>
            <button>Add record</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default NewRecordPage