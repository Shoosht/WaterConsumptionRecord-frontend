import { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './newRecordPage.css';
import { useRecordsContext } from '../../Hooks/useRecordContext';
import { useAuthContext } from '../../Hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import visaIcon from '../../Components/Icons/visa-electron.svg';
import masterCardIcon from '../../Components/Icons/mastercard.svg';
import americanExpressIcon from '../../Components/Icons/american-express.svg';
import deleteIcon from '../../Components/Icons/delete.svg';
import editIcon from '../../Components/Icons/edit.svg';

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
	const [editPopup, setEditPopup] = useState(false)
	const [deletePopup, setDeletePopup] = useState(false)
	const [editYear, setEditYear] = useState('')
	const [editMonth, setEditMonth] = useState('')
	const [editAmount, setEditAmount] = useState('')
	const [editPaid, setEditPaid] = useState(false)
	const [deleteRecord, setDeleteRecord] = useState(null)
	const [sortOption, setSortOption] = useState('All')

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

	const years = records ? records.map(record => record.year) : [];
	const availableYears = [...new Set(years)].sort((a, b) => b - a);

	const filteredRecords = records ? records.filter(record => {
		if (sortOption === 'All') {
			return true
		}
		if (sortOption === 'Paid') {
			return record.paid === true
		}
		if (sortOption === 'Unpaid') {
			return record.paid === false
		}
		return record.year === parseInt(sortOption)
	}).sort((a, b) => {
		if (b.year !== a.year) {
			return b.year - a.year
		}
		return b.month - a.month
	}) : []

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!user) {
			setError('You must be logged in.')
			return
		}

		const duplicateRecord = records.find(
			record => record.year === parseInt(year) && record.month === parseInt(month)
		)

		if (duplicateRecord) {
			setError('A record with that date already exists.')
			setEmptyFields(['year', 'month'])
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
	}

	const handlePayNow = async (e) => {
		if (e) e.preventDefault();

		if (!user) {
			return
		}

		const record_response = await fetch('/api/records/' + recordID, {
			method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${user.token}`
			},
			body: JSON.stringify({ "paid": true })
		})

		const record_json = await record_response.json()

		const bill_response = await fetch('/api/bills/' + recordID, {
			method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${user.token}`
			},
			body: JSON.stringify({ "paid": true, "paid_by": user.email })
		})

		await bill_response.json()

		if(record_response.ok && bill_response.ok){
			dispatch({type: 'UPDATE_RECORD', payload: record_json});
			setPaymentPopup(false)
			setRecordID(null)
		}
	}

	const handlePayNowOption = (id) => {
		setPaymentPopup(true)
		setRecordID(id)
	}

	const handleEditOption = (record) => {
		setEditPopup(true)
		setRecordID(record._id)
		setEditYear(record.year)
		setEditMonth(record.month)
		setEditAmount(record.amount)
		setEditPaid(record.paid)
	}

	const handleEditSubmit = async (e) => {
		e.preventDefault()

		const originalRecord = records.find(r => r._id === recordID)
		const paymentStatusChanged = originalRecord && originalRecord.paid !== editPaid

		const response = await fetch('/api/records/' + recordID, {
			method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${user.token}`
			},
			body: JSON.stringify({ 
				year: editYear, 
				month: editMonth, 
				amount: editAmount, 
				paid: editPaid 
			})
		})

		const json = await response.json()

		if(response.ok){
			if(paymentStatusChanged && editPaid){
				await fetch('/api/bills/' + recordID, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				})

				const bill = {
					year: json.year,
					month: json.month,
					amount: json.amount,
					record_id: json._id,
					paid: true,
					paid_by: user.email
				}

				await fetch('/api/bills', {
					method: 'POST',
					body: JSON.stringify(bill),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${user.token}`
					}
				})
			} else {
				await fetch('/api/bills/' + recordID, {
					method: 'PATCH',
					headers: {
						"Content-Type": "application/json",
						'Authorization': `Bearer ${user.token}`
					},
					body: JSON.stringify({ 
						year: editYear,
						month: editMonth,
						amount: editAmount,
						paid: editPaid,
						price: editAmount * 1.73
					})
				})
			}

			dispatch({type: 'UPDATE_RECORD', payload: json});
			setEditPopup(false)
			setRecordID(null)
		}
	}

	const handleDeleteOption = (record) => {
		setDeletePopup(true)
		setDeleteRecord(record)
	}

	const handleDeleteConfirm = async () => {
		if (!user) {
			return
		}

		const response = await fetch('/api/records/' + deleteRecord._id, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${user.token}`
			}
		})

		const json = await response.json()

		const bill_response = await fetch('/api/bills/' + deleteRecord._id, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${user.token}`
			}
		})

		if(response.ok && bill_response.ok){
			dispatch({type: 'DELETE_RECORD', payload: json});
			setDeletePopup(false)
			setDeleteRecord(null)
		}
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
									className={`nrp-input-field ${emptyFields?.includes('year') ? 'error' : ''}`}
									type="number"
									onChange={(e) => setYear(e.target.value)}
									value={year}
									placeholder="1900-2026"
								/>
							</div>

							<div className="form-group">
								<label className="input-text">Month:</label>
								<input
									className={`nrp-input-field ${emptyFields?.includes('month') ? 'error' : ''}`}
									type="number"
									onChange={(e) => setMonth(e.target.value)}
									value={month}
									placeholder="0-12"
								/>
							</div>

							<div className="form-group">
								<label className="input-text">Amount:</label>
								<input
									className={`nrp-input-field ${emptyFields?.includes('amount') ? 'error' : ''}`}
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
					<div className="nrp-record-header">
						<div className="nrp-record-title">Your records:</div>
						<div className="nrp-sort-container">
							<span className="nrp-sort-text">Filter by:</span>
							<select 
								className="nrp-sort-select" 
								value={sortOption} 
								onChange={(e) => setSortOption(e.target.value)}
							>
								<option value="All">All</option>
								<option value="Unpaid">Unpaid</option>
								<option value="Paid">Paid</option>
								{availableYears.map(year => (
									<option key={year} value={year}>{year}</option>
								))}
							</select>
						</div>
					</div>
					{filteredRecords && filteredRecords.map((record) => (
						<div key={record._id} className="nrp-record-box">
							<div className="nrp-record-actions">
								<button onClick={() => handleEditOption(record)} className="nrp-action-btn edit">
									<img src={editIcon} alt="Edit" className="nrp-action-icon" />
								</button>
								<button onClick={() => handleDeleteOption(record)} className="nrp-action-btn delete">
									<img src={deleteIcon} alt="Delete" className="nrp-action-icon" />
								</button>
							</div>
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
									<div className="nrp-paid-false">
										<button
											onClick={() => handlePayNowOption(record._id)}
											className="nrp-pay-button"
										>
											Pay
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{editPopup && (
				<div className="nrp-popup-overlay">
					<div className="nrp-popup-window">
						<h2 className="nrp-popup-title">Edit Record</h2>
						<form onSubmit={handleEditSubmit} className="nrp-edit-form">
							<div className="nrp-edit-field">
								<label className="input-text">Year:</label>
								<input
									type="number"
									value={editYear}
									onChange={(e) => setEditYear(e.target.value)}
									className="nrp-input"
								/>
							</div>
							<div className="nrp-edit-field">
								<label className="input-text">Month:</label>
								<input
									type="number"
									value={editMonth}
									onChange={(e) => setEditMonth(e.target.value)}
									className="nrp-input"
								/>
							</div>
							<div className="nrp-edit-field">
								<label className="input-text">Amount:</label>
								<input
									type="number"
									value={editAmount}
									onChange={(e) => setEditAmount(e.target.value)}
									className="nrp-input"
								/>
							</div>
	
							<div className="nrp-edit-field-payment">
								<label className="nrp-checkbox-text">
									Payment done:
									<input
										type="checkbox"
										checked={editPaid}
										onChange={() => setEditPaid(!editPaid)}
										className="nrp-checkbox-small"
									/>
								</label>
							</div>
							
							<div className="nrp-popup-buttons">
								<button type="submit" className="nrp-confirm-btn">Save Changes</button>
								<button type="button" onClick={() => setEditPopup(false)} className="nrp-cancel-popup-btn">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{deletePopup && deleteRecord && (
				<div className="nrp-popup-overlay">
					<div className="nrp-popup-window">
						<h2 className="nrp-popup-title">Delete Record</h2>
						<div className="nrp-delete-content">
							<p>Are you sure you want to delete this record?</p>
							<div className="nrp-delete-info">
								<strong>Date:</strong> {deleteRecord.month}/{deleteRecord.year}
								<br />
								<strong>Amount:</strong> {deleteRecord.amount} m³
							</div>
						</div>
						<div className="nrp-popup-buttons">
							<button onClick={handleDeleteConfirm} className="nrp-delete-confirm-btn">
								Delete
							</button>
							<button onClick={() => setDeletePopup(false)} className="nrp-cancel-popup-btn">
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

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