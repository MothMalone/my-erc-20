const hre = require("hardhat");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const [owner, account1] = await hre.ethers.getSigners();
    
    const Token = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
    const token = Token.attach(contractAddress);
    
    console.log("\n📤 Gửi 10,000 TMN từ Owner → Account 1\n");
    console.log("Owner:", owner.address);
    console.log("Account 1:", account1.address);
    
    const amount = hre.ethers.parseEther("10000");
    const tx = await token.connect(owner).transfer(account1.address, amount);
    await tx.wait();
    
    console.log("✅ Thành công!");
    
    const balance = await token.balanceOf(account1.address);
    console.log("\nSố dư Account 1:", hre.ethers.formatEther(balance), "TMN");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
