const hre = require("hardhat");

async function main() {
    // Thay bằng địa chỉ NFT contract của bạn
    const nftContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
    const [owner, account1, account2] = await hre.ethers.getSigners();
    
    console.log("🎨 Mint NFT Demo\n");
    console.log("NFT Contract:", nftContractAddress);
    console.log("Owner:", owner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);
    console.log("\n" + "=".repeat(60) + "\n");
    
    const NFTContract = await hre.ethers.getContractFactory("TranMinhNam23021646_NFT");
    const nft = NFTContract.attach(nftContractAddress);
    
    // Mint NFT #1 cho Owner
    console.log("🖼️  Mint NFT #1 cho Owner...");
    let tx = await nft.mintSimpleNFT(
        owner.address,
        "TMN Genesis NFT",
        "The first NFT minted in TranMinhNam23021646 collection"
    );
    await tx.wait();
    console.log("✅ Minted NFT #0 to Owner");
    
    // Mint NFT #2 cho Account 1
    console.log("\n🖼️  Mint NFT #2 cho Account 1...");
    tx = await nft.mintSimpleNFT(
        account1.address,
        "TMN Collector NFT",
        "Special NFT for early collectors"
    );
    await tx.wait();
    console.log("✅ Minted NFT #1 to Account 1");
    
    // Mint NFT #3 cho Account 2
    console.log("\n🖼️  Mint NFT #3 cho Account 2...");
    tx = await nft.mintSimpleNFT(
        account2.address,
        "TMN Premium NFT",
        "Premium NFT with exclusive benefits"
    );
    await tx.wait();
    console.log("✅ Minted NFT #2 to Account 2");
    
    // Mint thêm vài NFT nữa cho Owner
    console.log("\n🖼️  Mint NFT #4 cho Owner...");
    tx = await nft.mintSimpleNFT(
        owner.address,
        "TMN Diamond NFT",
        "Rare diamond tier NFT"
    );
    await tx.wait();
    console.log("✅ Minted NFT #3 to Owner");
    
    console.log("\n🖼️  Mint NFT #5 cho Owner...");
    tx = await nft.mintSimpleNFT(
        owner.address,
        "TMN Gold NFT",
        "Gold tier NFT with special privileges"
    );
    await tx.wait();
    console.log("✅ Minted NFT #4 to Owner");
    
    // Hiển thị tổng kết
    console.log("\n" + "=".repeat(60));
    console.log("📊 MINTING SUMMARY");
    console.log("=".repeat(60));
    
    const totalSupply = await nft.totalSupply();
    console.log("Total NFTs Minted:", totalSupply.toString());
    
    const ownerBalance = await nft.balanceOf(owner.address);
    const account1Balance = await nft.balanceOf(account1.address);
    const account2Balance = await nft.balanceOf(account2.address);
    
    console.log("\nOwner Balance:", ownerBalance.toString(), "NFTs");
    console.log("Account 1 Balance:", account1Balance.toString(), "NFTs");
    console.log("Account 2 Balance:", account2Balance.toString(), "NFTs");
    
    // Hiển thị NFTs của Owner
    console.log("\n🎨 Owner's NFTs:");
    const ownerTokens = await nft.tokensOfOwner(owner.address);
    for (let tokenId of ownerTokens) {
        const metadata = await nft.getMetadata(tokenId);
        console.log(`  - NFT #${tokenId}: ${metadata.name}`);
    }
    
    console.log("\n🎨 Account 1's NFTs:");
    const account1Tokens = await nft.tokensOfOwner(account1.address);
    for (let tokenId of account1Tokens) {
        const metadata = await nft.getMetadata(tokenId);
        console.log(`  - NFT #${tokenId}: ${metadata.name}`);
    }
    
    console.log("\n🎨 Account 2's NFTs:");
    const account2Tokens = await nft.tokensOfOwner(account2.address);
    for (let tokenId of account2Tokens) {
        const metadata = await nft.getMetadata(tokenId);
        console.log(`  - NFT #${tokenId}: ${metadata.name}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Mint completed! Refresh your UI to see the NFTs.");
    console.log("=".repeat(60));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
