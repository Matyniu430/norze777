import React from 'react';
import visaIcon from '../../assets/visa.svg';
import mastercardIcon from '../../assets/mastercard.svg';
import applePayIcon from '../../assets/apple-pay.svg';
import paypalIcon from '../../assets/paypal.svg';
import amexIcon from '../../assets/amex.svg';
import PaymentIcon from './PaymentIcon';

export default function FooterPaymentsContainer() {
    return (
        <div className='flex justify-center'>
            <ul className='flex flex-wrap justify-center pt-4 tablet:pt-12 mx-[-0.5rem]'>
                <PaymentIcon img={amexIcon} alt="american express icon" />
                <PaymentIcon img={applePayIcon} alt="apple pay icon" />
                <PaymentIcon img={mastercardIcon} alt="mastercard icon" />
                <PaymentIcon img={paypalIcon} alt="paypal icon" />
                <PaymentIcon img={visaIcon} alt="visa icon" />
            </ul>
        </div>
    )
}