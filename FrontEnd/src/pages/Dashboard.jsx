import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AddStudentModal from '../components/AddStudentModal';
import './Dashboard.css';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleStudentAdded = (newStudent) => {
        setStudents(prev => [...prev, newStudent]);
        // Optionally refresh list or just append
        // fetchStudents(); 
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="nav-brand">LLMS Admin</div>
                <div className="nav-actions">
                    <span className="user-welcome">Hi, Teacher</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </nav>

            <main className="dashboard-content">
                <header className="page-header">
                    <h1>My Students</h1>
                    <button className="add-student-btn " onClick={() => setIsModalOpen(true)}>
                        + Add Student
                    </button>
                </header>

                {loading ? (
                    <div className="loading">Loading students...</div>
                ) : (
                    <div className="students-grid">
                        {students.length === 0 ? (
                            <div className="empty-state">No students found. Add one to get started!</div>
                        ) : (
                            <div className="students-table-container">
                                <table className="students-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Added Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student._id}>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))} aljfldjla slajfsldjfa;jadsldfjasikf
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStudentAdded={handleStudentAdded}
            />
        </div>
    );
};

export default Dashboard;
