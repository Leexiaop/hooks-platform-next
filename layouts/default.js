import React, { Fragment } from 'react';
import Head from 'next/head';

const Default = ({ children, title='管理后台系统'}) => {
    return  (
        <Fragment>
            <Head>
                <title>{`管理后台系统--${title}`}</title>
                <meta charSet='utf-8' />
            </Head>
            <style jsx global>
                {`
                    #__next {
                        height: 100%;
                    }
                `}    
            </style>
            { children }
        </Fragment>
    )
}

export default Default;
