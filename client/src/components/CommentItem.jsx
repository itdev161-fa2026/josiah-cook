import { useState } from 'react';
import CommentForm from './CommentForm';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './CommentItem.css';

const CommentItem = ({ comment, onEdit, onDelete, loading }) => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);

    const isOwner = user && user.id === comment.user._id;


    const handleEdit = async (body) => {
        await onEdit(comment._id, body);
        setIsEditing(false);
    };

    return (
        <div className="comment-item">
            <div className="comment-header">
                <span className="comment-author">{comment.user.name}</span>
                <span className="comment-date">
                    {new Date(comment.createDate).toLocaleString()}
                </span>
            </div>

            {!isEditing ? (
                <p className="comment-body">{comment.body}</p>
            ) : (
                <CommentForm
                    initialData={comment.body}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    loading={loading}
                />
            )}

            {isOwner && !isEditing && (
                <div className="comment-actions">
                    <button
                        className="submit-button edit-btn"
                        type="button"
                        onClick={() => setIsEditing(true)}
                        disabled={loading}
                    >
                        Edit
                    </button>
                    <button 
                        className="cancel-button delete-btn"
                        type="button"
                        onClick={() => {
                            if (window.confirm('Delete this comment?')) {
                                onDelete(comment._id);
                            }
                        }}
                        disabled={loading}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentItem;