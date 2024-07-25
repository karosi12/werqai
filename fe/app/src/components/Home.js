import { Link } from "react-router-dom";

const Home = () => {

    return (
        <section>
            <h1>Home</h1>
            <br />
            <Link to="/jobs">Go to the Job page</Link>
            <br />
            <Link to="/login">Go to the Login page</Link>
            <br />
            <Link to="/register">Go to the SignUp page</Link>
        </section>
    )
}

export default Home
