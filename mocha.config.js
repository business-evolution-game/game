require('hardhat');

const chai = require("chai");
const hre = require("hardhat");
const assert = require("assert");


chai.use(function (_chai, utils) {
    _chai.Assertion.addMethod('withGenericArgs', async function (eventName, genericTypeIndex, types, expected) {
        assert(eventName && genericTypeIndex && types && expected, "Expected 4 arguments for withGenericArgs function");
        assert(typeof eventName=='string', "Expected eventName will be string value");
        assert(typeof genericTypeIndex=='number', "Expected genericTypeIndex will be number value");
        assert(Array.isArray(types), "Expected 'types' will be array value");
        assert(Array.isArray(expected), "Expected 'expected' will be array value");
        const actual = utils.flag(this, 'object');
        const receipt = await actual.wait()
        let decodedData = [];

        console.log(receipt.logs);
        for (const event of receipt.logs) {
            if (event?.fragment?.name === eventName) {
                decodedData = (new hre.ethers.AbiCoder()).decode(
                    types,
                    event.args[genericTypeIndex]
                );

                this.assert(
                    expected.length==decodedData.length,
                    `expected actual args count ${decodedData.length} to be equal ${expected.length}`,
                    `expected actual args count ${decodedData.length} not to be equal ${expected.length}`,
                    expected.length,
                    decodedData.length
                );

                for(let i=0; i<decodedData.length; i++){
                    this.assert(
                        decodedData[i]==expected[i],
                        `expected args ${decodedData} to equal ${expected}`,
                        `expected args ${decodedData} to not equal ${expected}`,
                        expected,
                        decodedData
                    );
                }
            }
        }

        this.assert(
            false,
            `expected event '${eventName}' will be emitted`,
            `expected event '${eventName}' will not be emitted`,
            expected,
            decodedData
        );

    });
});