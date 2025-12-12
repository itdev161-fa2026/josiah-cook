import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, getComments, 
        addComment, updateComment, deleteComment } from '../services/api';
import { AuthContext } from '../context/authContext';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList'
import './PostDetail.css';

  const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState(null);

    // Load post
    useEffect(() => {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const data = await getPostById(id);
          setPost(data);
          setError(null);
        } catch (err) {
          setError('Failed to load post. It may not exist or the server is down.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }, [id]);

    // Load Comments
    useEffect(() => {
      const fetchComments = async () => {
        try {
          setLoadingComments(true);
          const data = await getComments(id);
          setComments(data);
        } catch (err) {
          console.error('Failed to load comments;', err);
        } finally {
          setLoadingComments(false);
        }
      };

      fetchComments();
    }, [id]);

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleEdit = () => {
     navigate(`/posts/${id}/edit`);
   };

   const handleDelete = async () => {
     if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
       try {
         await deletePost(id);
         navigate('/');
       } catch (err) {
         const errorMsg =
           err.response?.data?.msg ||
           'Failed to delete post. Please try again.';
         alert(errorMsg);
       }
     }
   };

   // Check if current user owns the post
   const canModify = user && post && user.id === post.user._id;

   // **Comment handlers**

   // Add new comment
   const handleAddComment = async (text) => {
      try {
        const newComment = await addComment(id, text);
        setComments((prev) => [...prev, newComment]);
      } catch (err) {
        console.error('Error adding comment:', err);
        alert('Failed to add comment. Please try again.');
      }
   };

   // Update a comment
   const handleUpdateComment = async (commentId, newText) => {
      try {
        const updated = await updateComment(commentId, newText);
        setComments((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } catch (err) {
        console.error('Error updating comment:', err);
        alert('Failed to update comment.');
      }
   };

   //Delete a comment
   const handleDeleteComment = async (commentId) => {
      try {
        await deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment.');
      }
   };


    if (loading) {
      return <div className="container loading">Loading post...</div>;
    }

    if (error) {
      return (
        <div className="container error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Home
          </button>
        </div>
      );
    }

    if (!post) {
      return <div className="container error">Post not found.</div>;
    }

    return (
      <div className="container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Posts
        </button>
        <article className="post-detail">
          <h1>{post.title}</h1>
          <div className="post-detail-meta">
            <span className="post-detail-author">By {post.user?.name || 'Unknown'}</span>
            <span className="post-detail-date">{formatDate(post.createDate)}</span>
          </div>
          <div className="post-detail-body">
            {post.body.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
         {canModify && (
           <div className="post-actions">
             <button onClick={handleEdit} className="edit-button">
               Edit Post
             </button>
             <button onClick={handleDelete} className="delete-button">
               Delete Post
             </button>
           </div>
         )}
        </article>

        <section className="comments-section">
          <CommentList
            comments={comments}
            currentUser={user}
            loading={loadingComments}
            onAdd={handleAddComment}
            onEdit={handleUpdateComment}
            onDelete={handleDeleteComment}
            />
        </section>
      </div>
    );
  };

  export default PostDetail;