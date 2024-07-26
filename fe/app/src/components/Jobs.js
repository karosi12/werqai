import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate, useLocation } from "react-router-dom";

const Jobs = () => {
    const [jobs, setJobs] = useState();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('jobs', {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                });
                isMounted && setJobs(response.data?.data);
                setLoading(false)
                setErrorMessage('')
                setSuccessMessage('')
            } catch (err) {
                setLoading(false)
                setErrorMessage('')
                setSuccessMessage('')
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getJobs();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const apply = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('job/apply',
                { jobId },
                {
                headers : {
                    'Authorization': `Bearer ${token}`
                }
            });
            setErrorMessage('')
            setSuccessMessage(response.data.message)
        } catch (error) {
            setSuccessMessage('')
            setErrorMessage(error.response.data.message);
            navigate('/jobs', { state: { from: location }, replace: true });
        }
      };

    if (loading) {
        return <div>Loading...</div>;
      }
    return (
        <article>
            {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
                </div>
            )}
            {successMessage && (
                <div style={{ color: 'green', marginTop: '10px' }}>
                {successMessage}
                </div>
            )}
            <h2>Job List</h2>
            {jobs?.length
                ? (
                    <ul>
                        {jobs.map((job, i) => <li key={i}>{job?.title} - {job?.description} &nbsp;&nbsp;<button onClick={() => apply(job._id)}>apply</button></li>)}
                    </ul>
                ) : <p>No jobs to display</p>
            }

        </article>
        
    );
};

export default Jobs;
