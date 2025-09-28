import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// Set these after you deploy your contract on Mumbai
export const REGISTRY_ADDRESS = process.env.REACT_APP_REGISTRY_ADDRESS || '';
export const REGISTRY_ABI = [
  // Minimal ABI for batch set
  {
    "inputs": [
      { "internalType": "bytes32[]", "name": "hashes", "type": "bytes32[]" },
      { "internalType": "string[]", "name": "ids", "type": "string[]" }
    ],
    "name": "batchSetCertificates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export async function ensureTestnetNetwork(providerObj) {
  // Polygon Amoy (new testnet replacing Mumbai)
  const AMOY_CHAIN_ID_HEX = '0x13882';
  try {
    await providerObj.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: AMOY_CHAIN_ID_HEX }] });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await providerObj.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: AMOY_CHAIN_ID_HEX,
          chainName: 'Polygon Amoy',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://rpc-amoy.polygon.technology'],
          blockExplorerUrls: ['https://www.oklink.com/amoy']
        }]
      });
    } else {
      throw switchError;
    }
  }
}

export async function getRegistryWithSigner() {
  const providerObj = await detectEthereumProvider();
  if (!providerObj) throw new Error('MetaMask not found');
  await providerObj.request({ method: 'eth_requestAccounts' });
  await ensureTestnetNetwork(providerObj);
  const provider = new ethers.BrowserProvider(providerObj);
  const signer = await provider.getSigner();
  if (!REGISTRY_ADDRESS) throw new Error('Registry address not configured');
  const contract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);
  const network = await provider.getNetwork();
  return { contract, signer, provider, network };
}
