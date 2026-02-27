
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Signup = () => {
    const { user } = useAuth();
    
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
                <SignupForm />
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
