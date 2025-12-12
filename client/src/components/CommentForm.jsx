import { useState, useEffect } from "react";
import './CommentForm.css';

const CommentForm = ({ initialData = '', onSubmit, onCancel, loading }) => {
    const [body, setBody] = useState('');
    const [error, setError] = useState('');

    // Pre-populate form when editing
    useEffect(() => {
        if (initialData && body === '') {
            setBody(initialData);
        }
    }, [initialData, body]);

    const onChange = (e) => {
        setBody(e.target.value);
        if (error) setError('');
    };

    // Check for required values
    const validateForm = () => {
        if (!body.trim()) {
            setError('Comment cannot be empty');
            return false;
        } else if (body.trim().length > 500) {
            setError('Comment cannot exceed 500 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        await onSubmit(body.trim());
        setBody('');
    };

    return (
        <div className="comment-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea 
                    id="body"
                    name="body"
                    value={body}
                    onChange={onChange}
                    placeholder="Write a comment..."
                    rows="4"
                    className={error ? 'input-error' : ''}
                    disabled={loading}
                    />
                    {error && <span className="field-error">{error}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Posting...' : initialData ? 'Update Comment' : 'Post Comment'}
                    </button>
                    {initialData && (
                        <button
                        type="button"
                        onClick={onCancel}
                        className="cancel-button"
                        disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CommentForm;