import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './CommentList.css';

const CommentList = ({ comments, onAdd, onEdit, onDelete, loading }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">
                Comments ({comments.length})
            </h3>

            <div className="comment-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            loading={loading}
                        />
                    ))
                )}
            </div>
            {user ? (
            <CommentForm onSubmit={onAdd} loading={loading} />
            ) : (
                <p className="comment-login-hint">
                    You must be logged in to comment.
                </p>
            )}
        </div>
    );
};

export default CommentList;