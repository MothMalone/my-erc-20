const hre = require("hardhat");

async function main() {
    console.log("\n🚀 DEPLOYING BOTH ERC20 AND ERC721 CONTRACTS\n");
    console.log("=".repeat(60));

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

    // Deploy ERC20 Token
    console.log("📊 Deploying ERC20 Token Contract...");
    const TokenContract = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
    const token = await TokenContract.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("✅ ERC20 Token deployed to:", tokenAddress);

    // Deploy ERC721 NFT
    console.log("\n🎨 Deploying ERC721 NFT Contract...");
    const NFTContract = await hre.ethers.getContractFactory("TranMinhNam23021646_NFT");
    const nft = await NFTContract.deploy();
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("✅ ERC721 NFT deployed to:", nftAddress);

    // Display info
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("Network:", hre.network.name);
    console.log("Deployer:", deployer.address);
    console.log("\nERC20 Token:");
    console.log("  - Address:", tokenAddress);
    console.log("  - Name:", await token.name());
    console.log("  - Symbol:", await token.symbol());
    console.log("  - Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "TMN");
    
    console.log("\nERC721 NFT:");
    console.log("  - Address:", nftAddress);
    console.log("  - Name:", await nft.name());
    console.log("  - Symbol:", await nft.symbol());
    console.log("  - Total Supply:", (await nft.totalSupply()).toString(), "NFTs");
    console.log("=".repeat(60));

    console.log("\n📝 NEXT STEPS:");
    console.log("=".repeat(60));
    console.log("1. Update public/index.html with these addresses:");
    console.log(`   const CONTRACT_ADDRESS = "${tokenAddress}";`);
    console.log(`   const NFT_CONTRACT_ADDRESS = "${nftAddress}";`);
    console.log("\n2. Update scripts/mint-nft.js with NFT contract address:");
    console.log(`   const nftContractAddress = "${nftAddress}";`);
    console.log("\n3. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)");
    console.log("\n4. (Optional) Mint demo NFTs:");
    console.log("   npx hardhat run scripts/mint-nft.js --network localhost");
    console.log("=".repeat(60));
    console.log("\n✅ Deployment complete! Happy building! 🎉\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
