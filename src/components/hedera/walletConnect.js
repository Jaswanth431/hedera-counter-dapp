import { ethers } from "ethers";
const network = "testnet";

async function walletConnectFcn() {
	console.log(`\n=======================================`);

	// ETHERS PROVIDER
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

	// SWITCH TO HEDERA TEST NETWORK
	console.log(`- Switching network to the Hedera ${network}...🟠`);
	let chainId;
	if (network === "testnet") {
		chainId = "0x128";
	} else if (network === "previewnet") {
		chainId = "0x129";
	} else {
		chainId = "0x127";
	}

	try {
		await window.ethereum.request({
		   method: "wallet_switchEthereumChain",
		   params: [{ chainId: chainId }],
		});
	 } catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask
		if (switchError.code === 4902) {
		   try {
			  await window.ethereum.request({
				 method: "wallet_addEthereumChain",
				 params: [
					{
					   chainName: `Hedera ${network}`,
					   chainId: chainId,
					   nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
					   rpcUrls: [`https://${network}.hashio.io/api`],
					   blockExplorerUrls: [`https://hashscan.io/${network}/`],
					},
				 ],
			  });
		   } catch (addError) {
			  console.error("Failed to add the network:", addError.message);
		   }
		} else {
		   console.error("Failed to switch the network:", switchError.message);
		}
	 }
	 
	console.log("- Switched ✅");

	// CONNECT TO ACCOUNT
	console.log("- Connecting wallet...🟠");
	let selectedAccount;
	await provider
		.send("eth_requestAccounts", [])
		.then((accounts) => {
			selectedAccount = accounts[0];
			console.log(`- Selected account: ${selectedAccount} ✅`);
		})
		.catch((connectError) => {
			console.log(`- ${connectError.message.toString()}`);
			return;
		});

		getAccount();

	return [selectedAccount, provider, network];
}

async function getAccount() {
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
	const signer = provider.getSigner();
	const account = await signer.getAddress();
	console.log('Account:', account);
  }
  
export default walletConnectFcn;
