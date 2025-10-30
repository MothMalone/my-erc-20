//scripts/deploy.js
const hre = require("hardhat");

async function main() {
    console.log("Deploying TranMinhNam23021646_Token contract...");

    const MyToken = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");

    const token = await MyToken.deploy();

    await token.waitForDeployment();

    const address = await token.getAddress();

    console.log("MyToken deployed to:", address);
    console.log("\nImportant Info");
    console.log("Contract Address:", address);
    console.log("Token Name:", await token.name());
    console.log("Token Symbol:", await token.symbol());
    console.log("Total Supply:", (await token.totalSupply()).toString());

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });