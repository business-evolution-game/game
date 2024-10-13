module.exports = {
    istanbulFolder: './coverage',  // Output folder for coverage reports
    mocha: {
        require: ['ts-node/register'],
        timeout: 20000,
    },
};