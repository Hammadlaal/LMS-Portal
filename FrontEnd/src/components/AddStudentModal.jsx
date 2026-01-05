import { useState } from 'react';
import './AddStudentModal.css';
import api from '../api/axios';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!name || !email) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Using the api instance which attaches the token automatically
            const { data } = await api.post('/students', { name, email });
            setSuccessMsg('Student added successfully! Email sent to student.');
            setName('');
            setEmail('');
            if (onStudentAdded) onStudentAdded(data);
            setTimeout(() => {
                setSuccessMsg('');
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content slider-animation" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Student</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-alert">{error}</div>}
                {successMsg && <div className="success-alert">{successMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label>Student Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Student Name"
                        />
                    </div>
                    <div className="modal-form-group">
                        <label>Student Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
