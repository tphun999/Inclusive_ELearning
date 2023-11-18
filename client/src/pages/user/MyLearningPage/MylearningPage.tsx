import './MylearningPage.css';
import { NavLink, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { firebaseConfig } from '@/components/GetAuth/firebaseConfig';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Spin } from 'antd';

interface ITabs {
    label: string;
    path: string;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const MylearningPageLayout = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const tabs: ITabs[] = [
        { label: 'Progress', path: 'progress' },
        { label: 'Saved', path: 'saved' },
        { label: 'Collections', path: 'collections' },
        { label: 'History', path: 'history' }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); 
        });
        return () => {
            unsubscribe();
        };
    }, [auth]);

    if (loading) {
        return (
            <Spin spinning={loading} tip="Loading...">
                <div className='containerCss' style={{ height: 500 }}>
                </div>
            </Spin>
        );
    }
    if (!user) {
        return (
            <div>Bạn cần đang nhập</div>
        );
    }
    return (
        <div className='containerCss'>
            <div className="welcomeback">
                <div className="welcom-logo">
                    {user.photoURL && <img width={80} style={{ borderRadius: 100 }} src={user.photoURL} alt="Ảnh đại diện" />}
                </div>
                <div className="updateinformation">
                    <h2>Welcome back, {user.displayName}!</h2>
                    <a href="">Add experience</a>
                </div>
            </div>

            <div className="mylearningnav">
                <a href="">My Library</a>
            </div>

            <div className="browsepage">
                <div className="browseleft nav-border">
                    <ul>
                        {tabs.map((tab, index) => (
                            <li key={index} className='mb-5'>
                                <NavLink to={tab.path} >
                                    {tab.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="browseright">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MylearningPageLayout;
