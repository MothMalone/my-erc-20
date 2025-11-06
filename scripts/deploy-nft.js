const hre = require("hardhat");

async function main() {
    console.log("🚀 Đang deploy NFT contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts với địa chỉ:", deployer.address);
    console.log("Số dư tài khoản:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

    // Deploy NFT Contract
    const NFTContract = await hre.ethers.getContractFactory("TranMinhNam23021646_NFT");
    const nft = await NFTContract.deploy();
    await nft.deployed();

    console.log("✅ NFT Contract deployed to:", nft.address);
    console.log("📝 Contract Name:", await nft.name());
    console.log("🏷️  Contract Symbol:", await nft.symbol());
    console.log("👤 Owner:", await nft.owner());
    console.log("📊 Total Supply:", (await nft.totalSupply()).toString(), "NFTs");
    
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("NFT Contract Address:", nft.address);
    console.log("Network:", hre.network.name);
    console.log("Deployer:", deployer.address);
    console.log("=".repeat(60));
    
    console.log("\n💡 Để mint NFT, chạy:");
    console.log(`npx hardhat run scripts/mint-nft.js --network ${hre.network.name}`);
    
    console.log("\n📝 Cập nhật NFT_CONTRACT_ADDRESS trong index.html:");
    console.log(`const NFT_CONTRACT_ADDRESS = "${nft.address}";`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
