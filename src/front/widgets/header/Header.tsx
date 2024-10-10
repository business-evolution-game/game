import React from 'react';
import {Link} from 'react-router-dom';
import {useAccount} from "wagmi";
import {Connect} from "@features/auth/connect";
import {Disconnect} from "@features/auth/disconnect/";


const Header: React.FC = () => {
    const account = useAccount();

    return (
        <header className="shadow-md">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            Business evolution
                        </Link>
                    </div>


                    <div className="flex md:space-x-8 items-stretch">
                        <Link to="/"
                              className="content-center text-gray-900 hover:text-indigo-600 font-medium">Web2 </Link>
                        {account.status === 'connected' && (
                            <>
                                <Link to="/web3"
                                      className="text-gray-900 hover:text-indigo-600 font-medium content-center">Web3</Link>
                                <Link to="/Board"
                                      className="text-gray-900 hover:text-indigo-600 font-medium content-center">Board</Link>
                            </>
                        )}
                        <div
                            className="text-gray-900 flex items-center gap-2 border-l border-gray-500 border-dashed pl-8">
                            {account.status === 'connected' ? <Disconnect/> :
                                <Connect/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
/**/
export default Header;