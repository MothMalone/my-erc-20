const hre = require("hardhat");

async function main() {
    console.log("\n🚀 Deploying TranMinhNam23021646_Token with Buy Feature...\n");

    const MyToken = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");

    const token = await MyToken.deploy();

    await token.waitForDeployment();

    const address = await token.getAddress();
    const [deployer] = await hre.ethers.getSigners();

    console.log("=" .repeat(60));
    console.log("✅ CONTRACT DEPLOYED SUCCESSFULLY");
    console.log("=".repeat(60));
    console.log("\n📄 Contract Address:", address);
    console.log("👤 Owner Address:", deployer.address);
    console.log("\n📊 Token Info:");
    console.log("   Name:", await token.name());
    console.log("   Symbol:", await token.symbol());
    console.log("   Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "TMN");
    console.log("   Decimals:", await token.decimals());
    
    console.log("\n💰 Buy Feature Info:");
    const price = await token.tokenPrice();
    const raised = await token.totalEthRaised();
    console.log("   Token Price: 1 ETH =", price.toString(), "TMN");
    console.log("   Total ETH Raised:", hre.ethers.formatEther(raised), "ETH");
    
    console.log("\n" + "=".repeat(60));
    console.log("📝 NEXT STEPS:");
    console.log("=".repeat(60));
    console.log("1. Update CONTRACT_ADDRESS in public/index.html:");
    console.log(`   const CONTRACT_ADDRESS = "${address}";`);
    console.log("\n2. Update contract address in scripts if needed");
    console.log("\n3. Open http://localhost:8080 and connect MetaMask");
    console.log("\n4. Test buying tokens!");
    console.log("=".repeat(60) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
