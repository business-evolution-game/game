
/// <reference types="@nomicfoundation/hardhat-chai-matchers" />

declare namespace Chai {
    interface Assertion extends HardhatChaiMatchers.Assertion {
        withGenericArgs(
            eventName: string,
            regularArgs: any[],
            types: string[],
            expected: any[]
        ): Promise<void>;
    }
}