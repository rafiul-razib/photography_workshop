import React from 'react';

const Success = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-background px-6'>
            <div className='max-w-2xl text-center'>
                <div className='mb-6'>
                    <div className='w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4'>
                        <svg className='w-10 h-10 text-success' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    <h1 className='text-3xl font-bold text-foreground mb-4'>Thank You!</h1>
                </div>
                <p className='text-lg text-muted-foreground'>
                    You have successfully registered for the programme. A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    );
};

export default Success;
