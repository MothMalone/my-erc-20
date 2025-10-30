const hre = require("hardhat");

async function main() {
    // ========================================
    // CẤU HÌNH - Thay đổi theo nhu cầu của bạn
    // ========================================
    
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Contract address
    
    // Index của account trong hardhat (0 = owner, 1 = account1, 2 = account2, ...)
    const spenderIndex = 1; // Account được phê duyệt (account1)
    const fromIndex = 0;     // Account chủ sở hữu token (owner)
    const toIndex = 2;       // Account người nhận (account2)
    
    const transferAmount = "500"; // Số lượng token muốn chuyển
    
    // ========================================
    
    console.log("\n🔄 BẮT ĐẦU CHUYỂN TOKEN BẰNG transferFrom()\n");
    console.log("=" .repeat(60));
    
    // Lấy các accounts
    const accounts = await hre.ethers.getSigners();
    const owner = accounts[fromIndex];
    const spender = accounts[spenderIndex];
    const recipient = accounts[toIndex];
    
    console.log("\n📋 THÔNG TIN TÀI KHOẢN:");
    console.log(`   Owner (từ):      ${owner.address}`);
    console.log(`   Spender (thực hiện): ${spender.address}`);
    console.log(`   Recipient (đến): ${recipient.address}`);
    
    // Kết nối với contract
    const TranMinhNam23021646_Token = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
    const token = TranMinhNam23021646_Token.attach(contractAddress);
    
    console.log(`\n📄 Contract: ${contractAddress}`);
    
    try {
        // Kiểm tra số dư trước
        console.log("\n" + "=".repeat(60));
        console.log("📊 SỐ DƯ TRƯỚC KHI CHUYỂN:");
        console.log("=".repeat(60));
        
        const ownerBalanceBefore = await token.balanceOf(owner.address);
        const spenderBalanceBefore = await token.balanceOf(spender.address);
        const recipientBalanceBefore = await token.balanceOf(recipient.address);
        
        console.log(`   Owner:     ${hre.ethers.formatEther(ownerBalanceBefore)} TMN`);
        console.log(`   Spender:   ${hre.ethers.formatEther(spenderBalanceBefore)} TMN`);
        console.log(`   Recipient: ${hre.ethers.formatEther(recipientBalanceBefore)} TMN`);
        
        // Kiểm tra allowance
        console.log("\n" + "=".repeat(60));
        console.log("🔍 KIỂM TRA ALLOWANCE:");
        console.log("=".repeat(60));
        
        const allowance = await token.allowance(owner.address, spender.address);
        const allowanceFormatted = hre.ethers.formatEther(allowance);
        
        console.log(`   Số token spender được phép chi tiêu: ${allowanceFormatted} TMN`);
        
        // Kiểm tra xem có đủ allowance không
        const amount = hre.ethers.parseEther(transferAmount);
        
        if (allowance < amount) {
            console.log("\n❌ LỖI: Allowance không đủ!");
            console.log(`   Cần: ${transferAmount} TMN`);
            console.log(`   Có:  ${allowanceFormatted} TMN`);
            console.log("\n💡 HƯỚNG DẪN:");
            console.log("   1. Sử dụng Web UI để approve token cho spender");
            console.log("   2. Hoặc chạy script approve riêng");
            console.log(`   3. Owner phải approve ít nhất ${transferAmount} TMN cho Spender`);
            return;
        }
        
        console.log("   ✅ Allowance đủ để thực hiện giao dịch");
        
        // Thực hiện transferFrom
        console.log("\n" + "=".repeat(60));
        console.log("🚀 THỰC HIỆN CHUYỂN TOKEN:");
        console.log("=".repeat(60));
        console.log(`   Số lượng: ${transferAmount} TMN`);
        console.log(`   Từ:       ${owner.address}`);
        console.log(`   Đến:      ${recipient.address}`);
        console.log(`   Thực hiện bởi: ${spender.address}`);
        
        // Connect contract với spender để gọi transferFrom
        const tokenAsSpender = token.connect(spender);
        
        console.log("\n⏳ Đang gửi giao dịch...");
        const tx = await tokenAsSpender.transferFrom(
            owner.address,
            recipient.address,
            amount
        );
        
        console.log(`   TX Hash: ${tx.hash}`);
        console.log("   Đang chờ xác nhận...");
        
        const receipt = await tx.wait();
        console.log(`   ✅ Giao dịch thành công! (Block: ${receipt.blockNumber})`);
        
        // Kiểm tra số dư sau
        console.log("\n" + "=".repeat(60));
        console.log("📊 SỐ DƯ SAU KHI CHUYỂN:");
        console.log("=".repeat(60));
        
        const ownerBalanceAfter = await token.balanceOf(owner.address);
        const spenderBalanceAfter = await token.balanceOf(spender.address);
        const recipientBalanceAfter = await token.balanceOf(recipient.address);
        
        console.log(`   Owner:     ${hre.ethers.formatEther(ownerBalanceAfter)} TMN`);
        console.log(`   Spender:   ${hre.ethers.formatEther(spenderBalanceAfter)} TMN`);
        console.log(`   Recipient: ${hre.ethers.formatEther(recipientBalanceAfter)} TMN`);
        
        // Hiển thị thay đổi
        console.log("\n" + "=".repeat(60));
        console.log("📈 THAY ĐỔI:");
        console.log("=".repeat(60));
        
        const ownerChange = ownerBalanceAfter - ownerBalanceBefore;
        const recipientChange = recipientBalanceAfter - recipientBalanceBefore;
        
        console.log(`   Owner:     ${hre.ethers.formatEther(ownerChange)} TMN`);
        console.log(`   Recipient: +${hre.ethers.formatEther(recipientChange)} TMN`);
        
        // Kiểm tra allowance mới
        const newAllowance = await token.allowance(owner.address, spender.address);
        const newAllowanceFormatted = hre.ethers.formatEther(newAllowance);
        
        console.log("\n" + "=".repeat(60));
        console.log("🔍 ALLOWANCE MỚI:");
        console.log("=".repeat(60));
        console.log(`   Còn lại: ${newAllowanceFormatted} TMN`);
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ HOÀN TẤT!");
        console.log("=".repeat(60) + "\n");
        
    } catch (error) {
        console.error("\n❌ LỖI XẢY RA:");
        console.error("   ", error.message);
        
        if (error.message.includes("insufficient allowance")) {
            console.log("\n💡 Nguyên nhân: Allowance không đủ");
            console.log("   Giải pháp: Owner cần approve thêm token cho Spender");
        } else if (error.message.includes("transfer amount exceeds balance")) {
            console.log("\n💡 Nguyên nhân: Owner không có đủ token");
            console.log("   Giải pháp: Owner cần có đủ số dư token");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });