export class Exception {
    public readonly type = "Exception";
    public message: string;

    // @ts-expect-error tas this class is general the data might contain any data type
    constructor(message:string, public readonly data?) {
        this.message = message;
    }
}