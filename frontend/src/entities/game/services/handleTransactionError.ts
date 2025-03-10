const handleTransactionError = (error: any): string => {
    let errorMessage = 'Transaction failed';

    const metaMessages = error.metaMessages ?? error.cause?.metaMessages;
    if (metaMessages && metaMessages.length > 0) {
        const errorLine = metaMessages.find((msg: string) => msg.startsWith('Error:'));
        if (errorLine) {
            errorMessage = errorLine.replace('Error: ', '').trim();
        }
    } else if (error.message) {
        errorMessage = error.message;
    }

    return errorMessage;
};

export default handleTransactionError;