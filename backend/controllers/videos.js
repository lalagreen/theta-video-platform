const { Web3 } = require('web3');
require('dotenv').config();
const getContractInstance = require('../contract');

const web3 = new Web3(process.env.THETA_RPC_URL);

const uploadVideo = async (req, res) => {
  const { title, description, url, reward, account } = req.body;

  try {
    const contract = await getContractInstance();
    const result = await contract.methods.uploadVideo(title, description, url, reward).send({ from: account });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error uploading video:', error);
    if (error.message.includes('User denied transaction signature')) {
      res.status(400).json({ error: 'Transaction was denied by the user' });
    } else if (error.message.includes('insufficient funds')) {
      res.status(400).json({ error: 'Insufficient TFUEL to complete the transaction' });
    } else {
      res.status(500).json({ error: 'Error uploading video to the network' });
    }
  }
};

const fetchVideo = async (req, res) => {
  try {
    const contract = await getContractInstance();
    const videoCount = await contract.methods.videoCount().call();
    let videos = [];

    for (let i = 1; i <= videoCount; i++) {
      const video = await contract.methods.videos(i).call();
      videos.push(video);
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    if (error.message.includes('network error')) {
      res.status(503).json({ success: false, error: 'Unable to connect to Theta network' });
    } else {
      res.status(500).json({ success: false, error: 'Error fetching videos from the network' });
    }
  }
};

const rewardUploader = async (req, res) => {
  const { videoId, amount, sender } = req.body;

  if (!sender) {
    return res.status(400).json({ error: 'Sender address is required' });
  }

  try {
    const contract = await getContractInstance();
    
    // Convert amount to wei (Theta uses 18 decimal places like Ethereum)
    const amountInWei = web3.utils.toWei(amount, 'ether');

    // Get the gas price
    const gasPrice = await web3.eth.getGasPrice();

    // Estimate the gas required for the transaction
    const gasEstimate = await contract.methods.rewardUploader(videoId).estimateGas({
      from: sender,
      value: amountInWei
    });

    const result = await contract.methods.rewardUploader(videoId).send({
      from: sender,
      value: amountInWei,
      gas: gasEstimate,
      gasPrice: gasPrice
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error rewarding uploader:', error);
    if (error.message.includes('User denied transaction signature')) {
      res.status(400).json({ error: 'Transaction was denied by the user' });
    } else if (error.message.includes('insufficient funds')) {
      res.status(400).json({ error: 'Insufficient TFUEL to complete the transaction' });
    } else {
      res.status(500).json({ error: 'Error processing reward transaction' });
    }
  }
};

module.exports = { uploadVideo, rewardUploader, fetchVideo };