//scripts/transfer.js
const hre = require("hardhat");

async function main() {
  // Thay YOUR_CONTRACT_ADDRESS bằng contract address của bạn
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Lấy các signers (accounts)
  const [owner, account1] = await hre.ethers.getSigners();
  
  // Kết nối với contract
  const TranMinhNam23021646_Token = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
  const token = TranMinhNam23021646_Token.attach(contractAddress);
  
  console.log("=== TRƯỚC KHI CHUYỂN ===");
  console.log("Balance của owner:", (await token.balanceOf(owner.address)).toString());
  console.log("Balance của account1:", (await token.balanceOf(account1.address)).toString());
  
  // Chuyển 1000 token từ owner sang account1
  console.log("\nĐang chuyển 1000 token...");
  const amount = hre.ethers.parseUnits("1000", 18);
  const tx = await token.transfer(account1.address, amount);
  await tx.wait();
  
  console.log("\n=== SAU KHI CHUYỂN ===");
  console.log("Balance của owner:", (await token.balanceOf(owner.address)).toString());
  console.log("Balance của account1:", (await token.balanceOf(account1.address)).toString());
  console.log("\nChuyển token thành công!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });