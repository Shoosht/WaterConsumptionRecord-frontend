import './billsPage.css';
import Navbar from "../../Components/Navbar/navbar";
import Footer from "../../Components/Footer/footer";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useBillsContext } from '../../Hooks/useBillContext';
import { useRecordsContext } from '../../Hooks/useRecordContext'; 
import { useState, useEffect } from "react";
import visaIcon from '../../Components/Icons/visa-electron.svg';
import masterCardIcon from '../../Components/Icons/mastercard.svg';
import americanExpressIcon from '../../Components/Icons/american-express.svg';

function BillsPage() {
    const { user, isGuest, dispatch: authDispatch } = useAuthContext();
    const { bills, dispatch: billDispatch } = useBillsContext()
    const { dispatch: recordDispatch } = useRecordsContext()

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [paymentPopup, setPaymentPopup] = useState(false);
    const [activeCard, setActiveCard] = useState('visa');
    const [billID, setBillID] = useState(null);
    const [filterOption, setFilterOption] = useState('all');

    useEffect(() => {
		const fetchBills = async () => {
            if (isGuest) {
                const guestBills = JSON.parse(localStorage.getItem('guestBills') || '[]');
                billDispatch({ type: 'SET_BILLS', payload: guestBills });
            } else {
                const response = await fetch('/api/bills', {
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				});
				const json = await response.json();

				if (response.ok) {
					billDispatch({ type: 'SET_BILLS', payload: json })
				}
			}
		};
		if (user || isGuest) {
			fetchBills();
		}
	}, [billDispatch, user, isGuest]);

    const [editableFields, setEditableFields] = useState({
        name: false,
        city: false,
        address: false,
        email: false,
        monthlyLimit: false
    });

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        email: '',
        monthlyLimit: ''
    });

    const [originalData, setOriginalData] = useState({
        name: '',
        city: '',
        address: '',
        email: '',
        monthlyLimit: ''
    });

    useEffect(() => {
        if (user) {
            const userData = {
                name: user.name || '',
                city: user.city || '',
                address: user.address || '',
                email: user.email || '',
                monthlyLimit: user.monthlyLimit || ''
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [user]);

    const handleSaveClick = async (field) => {
        if (isGuest) {
            alert('Demo mode: Cannot edit account. Sign up to save changes.');
            setEditableFields(prev => ({
                ...prev,
                [field]: false
            }));
            setFormData(prev => ({
                ...prev,
                [field]: originalData[field]
            }));
            return;
        }

        try {
            const response = await fetch(`/api/user/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ [field]: formData[field] })
            });

            const json = await response.json();

            if (response.ok) {
                setOriginalData(prev => ({
                    ...prev,
                    [field]: formData[field]
                }));
                setEditableFields(prev => ({
                    ...prev,
                    [field]: false
                }));
                const updatedUser = {
                    ...user,
                    [field]: formData[field]
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                authDispatch({ type: 'LOGIN', payload: updatedUser });
            } else {
                console.error('Update failed:', json.error);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleEditClick = (field) => {
        if (editableFields[field]) {
            handleSaveClick(field);
        } else {
            setEditableFields(prev => ({
                ...prev,
                [field]: !prev[field]
            }));
        }
    };

    const handleCancelClick = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: originalData[field]
        }));
        setEditableFields(prev => ({
            ...prev,
            [field]: false
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayNowOption = (id) => {
        setPaymentPopup(true);
        setBillID(id);
    };

    const handlePayNow = async (e) => {
        if (e) e.preventDefault();

        if (!user) {
            return;
        }

        if (isGuest) {
            alert('Demo mode: Payment simulation only. Sign up to make real payments.');
            setPaymentPopup(false);
            return;
        }

        const bill_response = await fetch('/api/bills/' + billID, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ "paid": true, "paid_by": user.email })
        });

        const bill_json = await bill_response.json();

        const record_response = await fetch('/api/records/' + billID, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ "paid": true })
        });

        const record_json = await record_response.json();

        if (bill_response.ok && record_response.ok) {
            billDispatch({ type: 'UPDATE_BILL', payload: bill_json });
            recordDispatch({ type: 'UPDATE_RECORD', payload: record_json });
            setPaymentPopup(false);
            setBillID(null);
        }
    };

    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (isGuest) {
            setPasswordError('Demo mode: Cannot change password. Sign up for a real account.');
            return;
        }
    
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
    
        try {
            const response = await fetch(`/api/user/${user._id}/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
    
            const json = await response.json();
    
            if (response.ok) {
                setPasswordSuccess('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setPasswordError(json.error);
            }
        } catch (error) {
            setPasswordError('Error changing password.');
        }
    }

    const years = bills ? bills.map(bill => bill.year) : [];
	const availableYears = [...new Set(years)].sort((a, b) => b - a);

	const filteredBills = bills ? bills.filter(bill => {
		switch (filterOption) {
			case 'all':
				return true;
			case 'paid':
				return bill.paid;
			case 'unpaid':
				return !bill.paid;
			default:
				return bill.year === parseInt(filterOption);
		}
	}) : [];

    return (
        <div>
            <Navbar />
            <div className="bp-parent">
                <div className="bp-top">
                    <div className="bp-account">
                        <div className="bp-account-title">Account information</div>
                        <div className="bp-account-info">
                            {["name", "city", "address", "email", "monthlyLimit"].map((field) => (
                                <div key={field}>
                                    <div className={"bp-acc-title-under"}>
                                        {field === 'monthlyLimit' ? 'Monthly Limit (m³)' : Capitalize(field)}
                                    </div>

                                    <div className="bp-field-row">
                                        {editableFields[field] ? (
                                            <input
                                                type={field === 'monthlyLimit' ? 'number' : 'text'}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className="bp-input"
                                            />
                                        ) : (
                                            <div className={`bp-acc-${field}`}>
                                                {field === 'monthlyLimit' 
                                                    ? `${formData[field]} m³` 
                                                    : formData[field]
                                                }
                                            </div>
                                        )}
                                        <div className="bp-button-group">
                                            {editableFields[field] && (
                                                <button
                                                    className="bp-cancel-btn"
                                                    onClick={() => handleCancelClick(field)}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            <button
                                                className={`bp-edit-btn ${editableFields[field] ? 'save' : ''}`}
                                                onClick={() => handleEditClick(field)}
                                            >
                                                {editableFields[field] ? "✓" : "Edit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bp-password-section">
                    <div className="bp-acc-title-under">Change Password</div>
                    <form onSubmit={handlePasswordChange} className="bp-password-form">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                            className="bp-input-pass"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                            className="bp-input-pass"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                            className="bp-input-pass"
                        />
                        <button type="submit" className="bp-password-btn">Change Password</button>
                        {passwordError && <div className="bp-error">{passwordError}</div>}
                        {passwordSuccess && <div className="bp-success">{passwordSuccess}</div>}
                    </form>
                </div>
                
                <div className="bp-bottom">
                    <div className="bp-bottom-title">
                        <div>Bills</div>
                    </div>
                    <div className="bp-filter-container">
                        <label className="bp-filter-label">Sort by:</label>
                        <select 
                            value={filterOption} 
                            onChange={(e) => setFilterOption(e.target.value)}
                            className="bp-filter-dropdown"
                        >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="all">All Bills</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="bp-bottom-bills">
                        {filteredBills.map((bill) => (
                            <div key={bill._id} className="bp-bill-box">
                                <div className="bp-bill-content">
                                    <div className="bp-bill-amount-parent">
                                        <div className="bp-bill-amount-left">Amount:</div>
                                        <div className="bp-bill-amount-right">{bill.amount} m³</div>
                                    </div>
                                    <div className="bp-bill-meta">
                                        <div className="bp-bill-date">
                                            {bill.month}/{bill.year}
                                        </div>
                                    </div>
                                    {bill.price && (
                                        <div className="bp-bill-price-parent">
                                            <div className="bp-bill-price-left">Price:</div>
                                            <div className="bp-bill-price-right">€{bill.price.toFixed(2)}</div>
                                        </div>
                                    )}
                                </div>
                                {bill.paid ? (
                                    <div className="bp-paid-status">
                                        <div className="bp-paid-true">Payment done</div>
                                        {bill.paid_by && bill.paid_by !== "This bill hasn't been paid yet." && (
                                            <div className="bp-paid-by">Paid by: {bill.paid_by}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bp-paid-false">
                                        <button
                                            onClick={() => handlePayNowOption(bill.record_id)}
                                            className="bp-pay-button"
                                        >
                                            Pay
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {paymentPopup && (
                <div className="bp-popup-overlay">
                    <div className="bp-popup-window">
                        <h2 className="bp-popup-title">Payment Details</h2>
                        <div className="bp-payment-container">
                            <div className="bp-payment-left">
                                <div className="bp-card-options">
                                    <div
                                        className={`bp-card-option ${activeCard === 'visa' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('visa')}
                                    >
                                        <img src={visaIcon} alt="visa" className="bp-card-icon" />
                                        <div className="bp-round-checkbox">
                                            {activeCard === 'visa' && <div className="bp-round-checkbox-fill"></div>}
                                        </div>
                                    </div>

                                    <div
                                        className={`bp-card-option ${activeCard === 'master' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('master')}
                                    >
                                        <img src={masterCardIcon} alt="master" className="bp-card-icon" />
                                        <div className="bp-round-checkbox">
                                            {activeCard === 'master' && <div className="bp-round-checkbox-fill"></div>}
                                        </div>
                                    </div>

                                    <div
                                        className={`bp-card-option ${activeCard === 'american' ? 'active' : ''}`}
                                        onClick={() => setActiveCard('american')}
                                    >
                                        <img src={americanExpressIcon} alt="american" className="bp-card-icon" />
                                        <div className="bp-round-checkbox">
                                            {activeCard === 'american' && <div className="bp-round-checkbox-fill"></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bp-payment-right">
                                <form className="bp-payment-form">
                                    <input type="text" placeholder="Cardholder Name" className="bp-input-popup" />
                                    <input type="text" placeholder="Card Number" maxLength="19" className="bp-input-popup" />
                                    <div className="bp-input-row">
                                        <input type="text" placeholder="MM/YY" maxLength="5" className="bp-input half" />
                                        <input type="text" placeholder="CRC" maxLength="4" className="bp-input half" />
                                    </div>
                                    <button type="submit" onClick={(e)=>handlePayNow(e)} className="bp-pay-submit">Pay Now</button>
                                </form>
                                <div className="bp-popw-lorem">{Array(12).fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.').join('')}</div>
                            </div>
                        </div>
                        <button onClick={() => setPaymentPopup(false)} className="bp-close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default BillsPage;