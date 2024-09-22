const chai = require("chai");
const {ethers} = require("ethers");


function compareGenericElements(value1, value2){
    if (typeof value1 === 'bigint' || typeof value2 === 'bigint') {
        try {
            return BigInt(value1) === BigInt(value2);
        } catch (e) {
            return false; // If conversion to BigInt fails, it's likely because value1 or value2 is not convertible (e.g., floating-point number)
        }
    }

    if (!isNaN(value1) && !isNaN(value2)) {
        return Number(value1) === Number(value2);
    }
    return value1 === value2;
}
chai.use(function (_chai, utils) {
    console.log("Registering custom Chai assertion 'withGenericArgs'");
    const Assertion = _chai.Assertion;

    /**
     * @param {string} customEventName
     * @param {Array<any>} regularArgs
     * @param {Array<string>} types
     * @param {Array<any>} expected
     * @return {Promise<void>}
     */
    async function customValidation(customEventName, regularArgs, types, expected) {
        // Validate input arguments using Chai assertions
        new Assertion(customEventName, "Expected eventName to be provided").to.exist;
        new Assertion(regularArgs, "Expected regularArgs to be an array").to.be.an('array');
        new Assertion(types, "Expected 'types' to be an array").to.be.an('array');
        new Assertion(expected, "Expected 'expected' to be an array").to.be.an('array');
        new Assertion(typeof customEventName === 'string', "Expected eventName to be a string").to.be.true;

        const actual = utils.flag(this, 'object');
        const receipt = await actual.wait();

        let eventHaveBeenEmitted = false;

        for (const event of receipt.logs) {
            if (event?.fragment?.name === customEventName) {
                eventHaveBeenEmitted = true;

                // Assert length of regularArgs
                new Assertion(
                    regularArgs.length === event.args.length - 1,
                    `expected actual regular args count ${regularArgs.length} to be equal ${event.args.length - 1}`
                ).to.be.true;

                // Assert each regular argument
                for (let i = 0; i < regularArgs.length; i++) {
                    new Assertion(
                        regularArgs[i],
                        `expected regular arg ${regularArgs[i]} to equal ${event.args[i]}`
                    ).to.deep.equal(event.args[i]);
                }

                // Decode the data and assert decoded data length
                const decodedData = (new ethers.AbiCoder()).decode(
                    types,
                    event.args[regularArgs.length]
                );

                new Assertion(
                    expected.length === decodedData.length,
                    `expected actual generic args count ${decodedData.length} to be equal ${expected.length}`
                ).to.be.true;

                // Assert each decoded data element
                for (let i = 0; i < decodedData.length; i++) {
                    new Assertion(
                        compareGenericElements(decodedData[i], expected[i]),
                        `expected args ${decodedData[i]} to equal ${expected[i]}`
                    ).to.be.true;
                }
            }
        }

        // If the event wasn't emitted
        new Assertion(
            eventHaveBeenEmitted,
            `expected event '${customEventName}' to be emitted`
        ).to.be.true;

        return this;
    }
    Assertion.addMethod('withGenericArgs', customValidation);
});