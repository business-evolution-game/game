import {abi} from '@contracts/src/MainGame.sol/MainGame.json';
import {useWriteContract} from "wagmi";
import {config} from "@shared/api/wagmi/wagmi.config";
import {simulateTransaction} from "@shared/api/wagmi/simulateTransaction";
import {useCallback} from "react";
import {getAccount, getTransactionCount} from "@wagmi/core";
import handleTransactionError from "@entities/game/services/handleTransactionError";

const GAME_CONTRACT_ADDRESS:`0x${string}` = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';


async function createTransaction(contractAddress:`0x${string}`, name:string, ...args:any[]){
    const account = getAccount(config)
    const transactionCount = await getTransactionCount(config, {address: account.address as `0x${string}`});

    const transaction = {
        abi,
        address: contractAddress,
        functionName: name,
        value: BigInt(0),
        nonce: BigInt(transactionCount)
    };
    const simResult = await simulateTransaction(transaction);
    if (!simResult.success) {
        return;
    }
    return transaction;
}

export const useGameContractService = () => {

    const { writeContractAsync, writeContract, error, isError } = useWriteContract();
    const joinGame = useCallback(async () => {
        try {
            const transaction = await createTransaction(GAME_CONTRACT_ADDRESS, 'join');
            await writeContractAsync(transaction);
        } catch (error) {
            const errorMessage = handleTransactionError(error);
            console.error('Transaction failed:', errorMessage);
            //todo: handle error

            // You might want to set this error message in your component state to display to the user
        }
    }, []);

    return { joinGame, error, isError };
};