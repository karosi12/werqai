import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Login from "./components/Login";
import Home from "./components/Home";
import Missing from "./components/Missing";
import Jobs from "./components/Jobs";
import Layout from './components/Layout';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected routes */}
       <Route element={<RequireAuth />}> 
        <Route path="jobs" element={<Jobs />} />
       </Route>

        <Route path="/" element={<Home />} />

        <Route path="*" element={<Missing />} />
       </Route>
    </Routes>
  );
}

export default App;
