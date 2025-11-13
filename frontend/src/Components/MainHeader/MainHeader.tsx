import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./MainHeader.css";

const MainHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAddOfferPage = location.pathname === '/add-offer';

    return (
        <div className='mainHeader'>
            <div className='mainHeader-left'>
                <Link to="/" className='mainHeader-title'>
                    Used Cars Market
                </Link>
            </div>
            <div className='mainHeader-right'>
                {!isAddOfferPage && <button
                    className='mainHeader-addOfferButton'
                    onClick={() => navigate('/add-offer')}
                >
                    Add offer
                </button>}
            </div>
        </div>
    );
};

export default MainHeader;
