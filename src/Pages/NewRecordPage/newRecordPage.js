import { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './newRecordPage.css';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import { useAuthContext } from '../../Hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import visaIcon from '../../Components/Icons/visa-electron.svg';
import masterCardIcon from '../../Components/Icons/mastercard.svg';
import americanExpressIcon from '../../Components/Icons/american-express.svg';

function NewRecordPage() {
	const { records, dispatch } = useRecordsContext()
	const [year, setYear] = useState('')
	const [month, setMonth] = useState('')
	const [amount, setAmount] = useState('')
	const [error, setError] = useState(null)
	const [emptyFields, setEmptyFields] = useState([])
	const { user } = useAuthContext()
	const [isPaid, setIsPaid] = useState(false)
	const [paymentPopup, setPaymentPopup] = useState(false)
	const [activeCard, setActiveCard] = useState('visa')
	const [recordID, setRecordID] = useState(null)

	useEffect(() => {
		const fetchRecords = async () => {
			const response = await fetch('/api/records', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			const json = await response.json();

			if (response.ok) {
				dispatch({ type: 'SET_RECORDS', payload: json })
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

		const record = { year, month, amount, paid: isPaid }

		const response = await fetch('/api/records', {
			method: 'POST',
			body: JSON.stringify(record),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.token}`
			}
		})

		const json = await response.json()

		if (!response.ok) {
			setError(json.error)
			setEmptyFields(json.emptyFields)
			return
		}

		if (response.ok) {
			setYear('')
			setMonth('')
			setAmount('')
			setIsPaid(false)
			setError(null)
			setEmptyFields([])
			console.log('new record added', json)
			dispatch({ type: 'CREATE_RECORD', payload: json })
		}


		const bill = {
			year: json.year,
    		month: json.month,
   		 	amount: json.amount,
			record_id: json._id,
    		paid: json.paid,
    		paid_by: null
		}

		const bill_response = await fetch('/api/bills', {
			method: 'POST',
			body: JSON.stringify(bill),
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${user.token}`
			}
		})

		const bill_json = await bill_response.json()

		if(!bill_response.ok){
			console.log(bill_json.error)
		}

		if(bill_response.ok){

		}
	}

	const handlePayNow = async (e) => {
		if (e) e.preventDefault();

		if (!user) {
			return
		}

		console.log("recordID ", recordID)

        const response_1 = await fetch('/api/records/' + recordID, {
            method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${user.token}`
			},
			body: JSON.stringify({ "paid": true })
        })

        const json_1 = await response_1.json()

		console.log("json ", json_1)


		const response_2 = await fetch('/api/bills/' + recordID, {
            method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${user.token}`
			},
			body: JSON.stringify({ "paid": true, "paid_by": user.email })
        })

        const json_2 = await response_2.json()

		console.log("json ", json_2)

        if(response_1.ok && response_2.ok){
            dispatch({type: 'UPDATE_RECORD', payload: json_1});
            setPaymentPopup(false)
			setRecordID(null)
        }
	}

	const handlePayNowOption = (id) => {
		setPaymentPopup(true)
		setRecordID(id)
	}

	return (
		<div>
			<Navbar />
			<div className="nrp-parent">
				<div className="submit-form-centered">
					<form className="add-new-form" onSubmit={handleSubmit}>
						<div className="form-text">
							<div className="nrp-title">Add a new record</div>

							<div className="form-group">
								<label className="input-text">Year:</label>
								<input
									className={`nrp-input-field ${emptyFields.includes('year') ? 'error' : ''}`}
									type="number"
									onChange={(e) => setYear(e.target.value)}
									value={year}
									placeholder="1900-2025"
								/>
							</div>

							<div className="form-group">
								<label className="input-text">Month:</label>
								<input
									className={`nrp-input-field ${emptyFields.includes('month') ? 'error' : ''}`}
									type="number"
									onChange={(e) => setMonth(e.target.value)}
									value={month}
									placeholder="0-12"
								/>
							</div>

							<div className="form-group">
								<label className="input-text">Amount:</label>
								<input
									className={`nrp-input-field ${emptyFields.includes('amount') ? 'error' : ''}`}
									type="number"
									onChange={(e) => setAmount(e.target.value)}
									value={amount}
									placeholder="per cubic meter (m³)"
								/>
							</div>

							<div className="form-group">
								<div className="nrp-check-par">
									<label className="nrp-checkbox-text">Payment done:</label>
									<input
										className="nrp-checkbox"
										type="checkbox"
										checked={isPaid}
										onChange={() => setIsPaid((prev) => !prev)}
									/>
								</div>
							</div>
						</div>

						<button className="record-button">Add the record</button>
						{error && <div className="nrp-error-msg">{error}</div>}
					</form>
				</div>

				<div className="nrp-right-child">
					<div className="nrp-record-title">Your records:</div>
					{records && records.map((record) => (
						<div key={record._id} className="nrp-record-box">
							<div className="nrp-record-content">
								<div className="nrp-record-amount-parent">
									<div className="nrp-record-amount-left">Amount: </div>
									<div className="nrp-record-amount-right">{record.amount} m³</div>
								</div>
								<div className="nrp-record-meta">
									<div className="nrp-record-createdat">
										{formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
									</div>
									<div className="nrp-record-date">
										Date: {record.month}.{record.year}.
									</div>
								</div>
							</div>
							{record.paid ? (
								<div className="nrp-paid-true">Payment done</div>
							) : (
								<div className="nrp-paid-false">
									<button
										onClick={() => handlePayNowOption(record._id)}
										className="nrp-pay-button"
									>
										Pay
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{paymentPopup && (
				<div className="nrp-popup-overlay">
					<div className="nrp-popup-window">
						<h2 className="nrp-popup-title">Payment Details</h2>
						<div className="nrp-payment-container">
							<div className="nrp-payment-left">
								<div className="nrp-card-options">
									<div
										className={`nrp-card-option ${activeCard === 'visa' ? 'active' : ''}`}
										onClick={() => setActiveCard('visa')}
									>
										<img src={visaIcon} alt="visa" className="nrp-card-icon" />
										<div className="nrp-round-checkbox">
											{activeCard === 'visa' && <div className="nrp-round-checkbox-fill"></div>}
										</div>
									</div>

									<div
										className={`nrp-card-option ${activeCard === 'master' ? 'active' : ''}`}
										onClick={() => setActiveCard('master')}
									>
										<img src={masterCardIcon} alt="master" className="nrp-card-icon" />
										<div className="nrp-round-checkbox">
											{activeCard === 'master' && <div className="nrp-round-checkbox-fill"></div>}
										</div>
									</div>

									<div
										className={`nrp-card-option ${activeCard === 'american' ? 'active' : ''}`}
										onClick={() => setActiveCard('american')}
									>
										<img src={americanExpressIcon} alt="american" className="nrp-card-icon" />
										<div className="nrp-round-checkbox">
											{activeCard === 'american' && <div className="nrp-round-checkbox-fill"></div>}
										</div>
									</div>
								</div>
							</div>

							<div className="nrp-payment-right">
								<form className="nrp-payment-form">
									<input type="text" placeholder="Cardholder Name" className="nrp-input" />
									<input type="text" placeholder="Card Number" maxLength="19" className="nrp-input" />
									<div className="nrp-input-row">
										<input type="text" placeholder="MM/YY" maxLength="5" className="nrp-input half" />
										<input type="text" placeholder="CRC" maxLength="4" className="nrp-input half" />
									</div>
									<button type="submit" onClick={(e)=>handlePayNow(e)} className="nrp-pay-submit">Pay Now</button>
								</form>
                                <div className="nrp-popw-lorem">{Array(12).fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.').join('')}</div>
							</div>
						</div>
						<button onClick={() => setPaymentPopup(false)} className="nrp-close-btn">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default NewRecordPage