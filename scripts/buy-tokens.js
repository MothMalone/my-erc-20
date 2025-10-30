const hre = require("hardhat");

async function main() {
    // ========================================
    // CẤU HÌNH
    // ========================================
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Thay bằng contract address của bạn
    
    // Account #1 sẽ mua token
    const buyerIndex = 1;
    const ethAmount = "0.01"; // Mua bằng 0.01 ETH
    
    // ========================================
    
    console.log("\n💰 DEMO MUA TOKEN BẰNG ETH\n");
    console.log("=" .repeat(60));
    
    const accounts = await hre.ethers.getSigners();
    const owner = accounts[0];
    const buyer = accounts[buyerIndex];
    
    console.log("\n📋 THÔNG TIN:");
    console.log(`   Owner:  ${owner.address}`);
    console.log(`   Buyer:  ${buyer.address}`);
    console.log(`   Số ETH mua: ${ethAmount} ETH`);
    
    // Kết nối contract
    const TranMinhNam23021646_Token = await hre.ethers.getContractFactory("TranMinhNam23021646_Token");
    const token = TranMinhNam23021646_Token.attach(contractAddress);
    
    console.log(`\n📄 Contract: ${contractAddress}`);
    
    try {
        // Kiểm tra giá token
        console.log("\n" + "=".repeat(60));
        console.log("💲 KIỂM TRA GIÁ:");
        console.log("=".repeat(60));
        
        const price = await token.tokenPrice();
        console.log(`   Tỷ giá: 1 ETH = ${price.toString()} TMN`);
        
        // Tính số token sẽ nhận
        const ethWei = hre.ethers.parseEther(ethAmount);
        const tokenAmount = await token.calculateTokenAmount(ethWei);
        const tokenFormatted = hre.ethers.formatEther(tokenAmount);
        
        console.log(`   Với ${ethAmount} ETH → Nhận ${tokenFormatted} TMN`);
        
        // Kiểm tra số dư trước khi mua
        console.log("\n" + "=".repeat(60));
        console.log("📊 SỐ DƯ TRƯỚC KHI MUA:");
        console.log("=".repeat(60));
        
        const buyerEthBefore = await hre.ethers.provider.getBalance(buyer.address);
        const buyerTokenBefore = await token.balanceOf(buyer.address);
        const ownerTokenBefore = await token.balanceOf(owner.address);
        
        console.log(`   ETH của Buyer:   ${hre.ethers.formatEther(buyerEthBefore)} ETH`);
        console.log(`   TMN của Buyer:   ${hre.ethers.formatEther(buyerTokenBefore)} TMN`);
        console.log(`   TMN của Owner:   ${hre.ethers.formatEther(ownerTokenBefore)} TMN`);
        
        // Thực hiện mua token
        console.log("\n" + "=".repeat(60));
        console.log("🛒 THỰC HIỆN MUA TOKEN:");
        console.log("=".repeat(60));
        console.log(`   Buyer gửi ${ethAmount} ETH...`);
        
        const tx = await token.connect(buyer).buyTokens({ value: ethWei });
        console.log(`   TX Hash: ${tx.hash}`);
        console.log(`   Đang chờ confirm...`);
        
        const receipt = await tx.wait();
        console.log(`   ✅ Confirmed tại block ${receipt.blockNumber}`);
        
        // Kiểm tra event
        const event = receipt.logs.find(log => {
            try {
                const parsed = token.interface.parseLog(log);
                return parsed.name === 'TokensPurchased';
            } catch (e) {
                return false;
            }
        });
        
        if (event) {
            const parsed = token.interface.parseLog(event);
            console.log(`   📝 Event TokensPurchased:`);
            console.log(`      Buyer: ${parsed.args.buyer}`);
            console.log(`      ETH Amount: ${hre.ethers.formatEther(parsed.args.ethAmount)} ETH`);
            console.log(`      Token Amount: ${hre.ethers.formatEther(parsed.args.tokenAmount)} TMN`);
        }
        
        // Kiểm tra số dư sau khi mua
        console.log("\n" + "=".repeat(60));
        console.log("📊 SỐ DƯ SAU KHI MUA:");
        console.log("=".repeat(60));
        
        const buyerEthAfter = await hre.ethers.provider.getBalance(buyer.address);
        const buyerTokenAfter = await token.balanceOf(buyer.address);
        const ownerTokenAfter = await token.balanceOf(owner.address);
        const contractEth = await hre.ethers.provider.getBalance(contractAddress);
        const totalRaised = await token.totalEthRaised();
        
        console.log(`   ETH của Buyer:   ${hre.ethers.formatEther(buyerEthAfter)} ETH (giảm ${hre.ethers.formatEther(buyerEthBefore - buyerEthAfter)} ETH)`);
        console.log(`   TMN của Buyer:   ${hre.ethers.formatEther(buyerTokenAfter)} TMN (tăng ${hre.ethers.formatEther(buyerTokenAfter - buyerTokenBefore)} TMN)`);
        console.log(`   TMN của Owner:   ${hre.ethers.formatEther(ownerTokenAfter)} TMN (giảm ${hre.ethers.formatEther(ownerTokenBefore - ownerTokenAfter)} TMN)`);
        console.log(`   ETH trong Contract: ${hre.ethers.formatEther(contractEth)} ETH`);
        console.log(`   Tổng ETH đã bán: ${hre.ethers.formatEther(totalRaised)} ETH`);
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ MUA TOKEN THÀNH CÔNG!");
        console.log("=".repeat(60));
        
        console.log("\n💡 GỢI Ý TIẾP THEO:");
        console.log("   - Owner có thể rút ETH bằng: withdrawEth()");
        console.log("   - Owner có thể đổi giá bằng: setTokenPrice(newPrice)");
        console.log("   - Buyer có thể transfer TMN cho người khác");
        console.log("   - Xem trên UI: http://localhost:8080");
        console.log("\n");

    } catch (error) {
        console.error("\n❌ LỖI:", error.message);
        if (error.message.includes('Contract khong du token')) {
            console.log("\n💡 Owner không đủ token để bán!");
            console.log("   Giải pháp: Owner cần giữ đủ token trong ví");
        }
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
