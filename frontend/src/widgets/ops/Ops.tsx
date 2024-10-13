import React from "react";
import {Exception} from "@shared/exception/Exception";

type OpsComponentType = {
    error: Exception
}

const OopsSVG = () => {
    return (
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            {/* Background for visibility (optional) */}

            {/* Letter O */}
            <text x="10" y="60" fontSize="60" fontWeight="bold" fill="#FF5733" transform="rotate(-10 30,60)">
                O
            </text>

            {/* Letter o */}
            <text x="50" y="60" fontSize="60" fontWeight="bold" fill="#FFC300" transform="rotate(10 70,60)">
                o
            </text>

            {/* Letter p */}
            <text x="90" y="60" fontSize="60" fontWeight="bold" fill="#28A745" transform="rotate(-10 110,60)">
                p
            </text>

            {/* Letter s */}
            <text x="130" y="60" fontSize="60" fontWeight="bold" fill="#007BFF" transform="rotate(10 150,60)">
                s
            </text>
        </svg>
    );
};


const Ops: React.FC<OpsComponentType> = ({error}) => {
    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Something went wrong</h2>
            <p className="text-gray-500 mb-6">Try later please.</p>
            <OopsSVG/>
            {error ? <p className="text-black"><b>Error: </b>{error.message}</p> : ""}
        </div>
    );
};

export default Ops;