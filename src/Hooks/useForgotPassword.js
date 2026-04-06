import { useState } from 'react';

export const useForgotPassword = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('/api/user/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const json = await response.json();

            if (response.ok) {
                setMessage(json.message);
                return json;
            } else {
                setError(json.message || 'Failed to send reset link.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }

        return {};
    };

    return { message, error, isLoading, forgotPassword };
};