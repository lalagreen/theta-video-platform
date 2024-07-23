const { Web3 } = require('web3');
require('dotenv').config();
const ContentRights = require('../smart-contracts/build/contracts/ContentRights.json');

let contractInstance = null;

const getContractInstance = async () => {
  if (!contractInstance) {
    const web3 = new Web3(process.env.THETA_RPC_URL);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ContentRights.networks[networkId];
    if (!deployedNetwork) {
      throw new Error(`Smart contract not deployed on the current network ID (${networkId})`);
    }
    contractInstance = new web3.eth.Contract(
      ContentRights.abi,
      deployedNetwork && deployedNetwork.address,
    );
  }
  return contractInstance;
};

module.exports = getContractInstance;

