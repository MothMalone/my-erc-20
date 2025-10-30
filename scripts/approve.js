const hre = require("hardhat");

async function main() {
    // ========================================
    // CẤU HÌNH - Thay đổi theo nhu cầu của bạn
    // ========================================

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Contract address

    // Index của account trong hardhat (0 = owner, 1 = account1, 2 = account2, ...)
    const ownerIndex = 0;    // Account sẽ approve
    const spenderIndex = 1;  // Account được phép chi tiêu
    
    const approveAmount = "10000"; // Số lượng token cho phép chi tiêu
    
    // ========================================
    
    console.log("\n🔐 BẮT ĐẦU PHÊ DUYỆT TOKEN (APPROVE)\n");
    console.log("=" .repeat(60));
    
    // Lấy các accounts
    const accounts = await hre.ethers.getSigners();
    const owner = accounts[ownerIndex];
    const spender = accounts[spenderIndex];
    
    console.log("\n📋 THÔNG TIN TÀI KHOẢN:");
    console.log(`   Owner (người approve):   ${owner.address}`);
    console.log(`   Spender (người được approve): ${spender.address}`);
    
    // Kết nối với contract
    const TranMinhNam23021646_Token = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
    const token = TranMinhNam23021646_Token.attach(contractAddress);
    
    console.log(`\n📄 Contract: ${contractAddress}`);
    
    try {
        // Kiểm tra số dư của owner
        console.log("\n" + "=".repeat(60));
        console.log("📊 KIỂM TRA SỐ DƯ:");
        console.log("=".repeat(60));
        
        const ownerBalance = await token.balanceOf(owner.address);
        const ownerBalanceFormatted = hre.ethers.formatEther(ownerBalance);
        
        console.log(`   Số dư Owner: ${ownerBalanceFormatted} TMN`);
        
        // Kiểm tra allowance hiện tại
        console.log("\n" + "=".repeat(60));
        console.log("🔍 ALLOWANCE HIỆN TẠI:");
        console.log("=".repeat(60));
        
        const currentAllowance = await token.allowance(owner.address, spender.address);
        const currentAllowanceFormatted = hre.ethers.formatEther(currentAllowance);
        
        console.log(`   Spender hiện được phép chi tiêu: ${currentAllowanceFormatted} TMN`);
        
        // Thực hiện approve
        console.log("\n" + "=".repeat(60));
        console.log("🚀 THỰC HIỆN APPROVE:");
        console.log("=".repeat(60));
        console.log(`   Số lượng approve: ${approveAmount} TMN`);
        console.log(`   Cho phép Spender: ${spender.address}`);
        
        const amount = hre.ethers.parseEther(approveAmount);
        
        console.log("\n⏳ Đang gửi giao dịch approve...");
        const tx = await token.connect(owner).approve(spender.address, amount);
        
        console.log(`   TX Hash: ${tx.hash}`);
        console.log("   Đang chờ xác nhận...");
        
        const receipt = await tx.wait();
        console.log(`   ✅ Giao dịch thành công! (Block: ${receipt.blockNumber})`);
        
        // Kiểm tra allowance mới
        console.log("\n" + "=".repeat(60));
        console.log("🔍 ALLOWANCE MỚI:");
        console.log("=".repeat(60));
        
        const newAllowance = await token.allowance(owner.address, spender.address);
        const newAllowanceFormatted = hre.ethers.formatEther(newAllowance);
        
        console.log(`   Spender giờ được phép chi tiêu: ${newAllowanceFormatted} TMN`);
        
        // Hiển thị thay đổi
        const change = newAllowance - currentAllowance;
        const changeFormatted = hre.ethers.formatEther(change);
        
        console.log(`   Thay đổi: +${changeFormatted} TMN`);
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ PHÊ DUYỆT THÀNH CÔNG!");
        console.log("=".repeat(60));
        

    } catch (error) {
        console.error("\n❌ LỖI XẢY RA:");
        console.error("   ", error.message);
        
        if (error.message.includes("transfer amount exceeds balance")) {
            console.log("\n💡 Nguyên nhân: Owner không có đủ token");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });