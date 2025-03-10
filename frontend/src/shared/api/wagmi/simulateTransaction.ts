import { Abi } from 'abitype';
import { decodeErrorResult } from 'viem';
import {publicClient} from './wagmi.config';


function decodeTransactionError(error: any, abi: Abi): string{
    let errorMessage = 'Transaction failed';

    if (error?.data) {
        try {
            const decodedError = decodeErrorResult({
                abi,
                data: error.data,
            });
            errorMessage = decodedError.errorName;

            if (decodedError.args && decodedError.args.length > 0) {
                errorMessage += `: ${decodedError.args.join(', ')}`;
            }
        } catch (decodeError) {
            console.error('Error decoding with viem:', decodeError);
        }
    } else if (error?.message) {
        errorMessage = error.message;
    }

    return errorMessage;
}

type SimulateTransactionArgsType = {
    address: `0x${string}`;
    abi: Abi | any;
    functionName: string;
    args?: any[];
}
export const simulateTransaction = async ({address, abi, functionName, args=[]}: SimulateTransactionArgsType) => {
    try {
        await publicClient.simulateContract({address, abi, functionName, args});
        return {success: true};
    } catch (error) {
        const errorMessage = decodeTransactionError(error, abi);
        return {success: false, errorMessage};
    }
};