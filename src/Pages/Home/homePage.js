import Navbar from '../../Components/Navbar/navbar'
import { useEffect, useState } from 'react'

function HomePage() {
    const [records, setRecords] = useState(null)

    useEffect(()=>{
        const fetchRecords = async () => {
            const response = await fetch('/api/records');
            const json = await response.json()

            if(response.ok){
                setRecords(json)
            }
        }   

        fetchRecords()
    }, [])

    return (
        <div>
            <Navbar></Navbar>
            <div>
                <div className="records">
                    {records && records.map((record)=>(
                        <div key={record._id}>{record.amount}</div>
                    ))
                    }

                </div>
            </div>
            
        </div>
    )
}

export default HomePage