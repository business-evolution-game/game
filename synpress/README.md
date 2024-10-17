
## Testing
To run the tests locally you have to start the hardhat node and the frontend site by following this steps 
```bash
cd ./frontend 
npm start
# Wait until the server start (do not close it while testing)

cd ../hardhat
npm run dev
# Wait until the node start (do not close it while testing)

cd ../synpress 
npm run test

```

## Troubleshooting
If you can not connect to the browser and see the 
*"Still waiting to connect to Chrome..."* message probably it meant that you have launched the tests 
and the process wasn't finished (the debug port is in use) so try to find the process and kill it

```bash
lsof -i :9222  
kill -9 <process id> 
```