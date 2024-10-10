export class Exception {
    public readonly type = "Exception";
    public message: string;

    constructor(message:string, public readonly data?: any) {
        this.message = message;
    }
}