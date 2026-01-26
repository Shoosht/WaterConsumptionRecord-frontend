import './billsPage.css';
import Navbar from "../../Components/Navbar/navbar";
import Footer from "../../Components/Footer/footer";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useBillsContext } from '../../Hooks/useBillContext';
import { useState, useEffect } from "react";

function BillsPage() {
    const { user, dispatch: authDispatch } = useAuthContext();
    const { bills, dispatch } = useBillsContext()

    useEffect(() => {
		const fetchBills = async () => {
			const response = await fetch('/api/bills', {
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			const json = await response.json();

			if (response.ok) {
				dispatch({ type: 'SET_BILLS', payload: json })
			}
		};
		if (user) {
			fetchBills();
		}
	}, [dispatch, user]);

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

    if (!user) {
        return <div className="bp-loading">Loading user data...</div>;
    }

    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

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
                
                <div className="bp-bottom">
                    <div className="bp-bottom-title">
                        <div>Bills</div>
                    </div>
                    <div className="bp-bottom-bills">
                        {bills && bills.map((bill) => (
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
            <Footer />
        </div>
    );
}

export default BillsPage;