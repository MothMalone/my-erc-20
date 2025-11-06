const hre = require("hardhat");

async function main() {
    try {
        console.log("\n🔍 CHECKING NETWORK CONNECTION\n");
        console.log("=".repeat(60));
        
        const provider = hre.ethers.provider;
        const network = await provider.getNetwork();
        
        console.log("✅ Connected to network:");
        console.log("  - Name:", network.name);
        console.log("  - Chain ID:", network.chainId);
        
        const blockNumber = await provider.getBlockNumber();
        console.log("  - Current Block:", blockNumber);
        
        const [signer] = await hre.ethers.getSigners();
        console.log("\n✅ First account:");
        console.log("  - Address:", signer.address);
        console.log("  - Balance:", hre.ethers.formatEther(await provider.getBalance(signer.address)), "ETH");
        
        // Check if contracts are deployed
        console.log("\n🔍 Checking deployed contracts:");
        
        const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        
        const tokenCode = await provider.getCode(tokenAddress);
        const nftCode = await provider.getCode(nftAddress);
        
        if (tokenCode !== "0x") {
            console.log("  ✅ ERC20 Token contract found at:", tokenAddress);
        } else {
            console.log("  ❌ ERC20 Token contract NOT found at:", tokenAddress);
            console.log("     → Need to redeploy!");
        }
        
        if (nftCode !== "0x") {
            console.log("  ✅ NFT contract found at:", nftAddress);
        } else {
            console.log("  ❌ NFT contract NOT found at:", nftAddress);
            console.log("     → Need to redeploy!");
        }
        
        console.log("\n" + "=".repeat(60));
        
        if (tokenCode === "0x" || nftCode === "0x") {
            console.log("\n⚠️  CONTRACTS NOT DEPLOYED!");
            console.log("\nRun this to redeploy:");
            console.log("  npx hardhat run scripts/deploy-all.js --network localhost");
            console.log("\nThen update addresses in public/index.html");
        } else {
            console.log("\n✅ Everything looks good!");
            console.log("\nIf MetaMask still shows wrong network:");
            console.log("  1. Open MetaMask");
            console.log("  2. Settings → Advanced → Reset Account");
            console.log("  3. Hard refresh browser (Cmd+Shift+R)");
        }
        
        console.log("\n");
        
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        console.log("\nMake sure Hardhat node is running:");
        console.log("  npx hardhat node");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
