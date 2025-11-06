// Test script for ERC721Enumerable features
const { ethers } = require("hardhat");

async function main() {
    console.log("\n🧪 Testing ERC721Enumerable Features\n");
    console.log("============================================================");
    
    const nftContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [owner, account1, account2] = await ethers.getSigners();
    
    // Get contract instance
    const nftContract = await ethers.getContractAt("TranMinhNam23021646_NFT", nftContractAddress);
    
    console.log("NFT Contract:", nftContractAddress);
    console.log("Owner:", owner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);
    console.log("\n============================================================\n");
    
    // Test 1: Total Supply
    console.log("📊 Test 1: totalSupply()");
    const totalSupply = await nftContract.totalSupply();
    console.log(`✅ Total Supply: ${totalSupply.toString()} NFTs\n`);
    
    // Test 2: tokenByIndex - Get all tokens by global index
    console.log("🔢 Test 2: tokenByIndex() - List all NFTs");
    for (let i = 0; i < totalSupply; i++) {
        const tokenId = await nftContract.tokenByIndex(i);
        const ownerAddr = await nftContract.ownerOf(tokenId);
        const metadata = await nftContract.getMetadata(tokenId);
        console.log(`  Index ${i}: Token #${tokenId} - "${metadata.name}" owned by ${ownerAddr.slice(0, 10)}...`);
    }
    console.log("");
    
    // Test 3: balanceOf - Get balance for each account
    console.log("💰 Test 3: balanceOf() - Check balances");
    const ownerBalance = await nftContract.balanceOf(owner.address);
    const account1Balance = await nftContract.balanceOf(account1.address);
    const account2Balance = await nftContract.balanceOf(account2.address);
    console.log(`  Owner: ${ownerBalance.toString()} NFTs`);
    console.log(`  Account 1: ${account1Balance.toString()} NFTs`);
    console.log(`  Account 2: ${account2Balance.toString()} NFTs\n`);
    
    // Test 4: tokenOfOwnerByIndex - Get tokens by owner index
    console.log("🎯 Test 4: tokenOfOwnerByIndex() - Owner's NFTs by index");
    for (let i = 0; i < ownerBalance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner.address, i);
        const metadata = await nftContract.getMetadata(tokenId);
        console.log(`  Owner Index ${i}: Token #${tokenId} - "${metadata.name}"`);
    }
    console.log("");
    
    console.log("🎯 Test 4b: tokenOfOwnerByIndex() - Account 1's NFTs by index");
    for (let i = 0; i < account1Balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(account1.address, i);
        const metadata = await nftContract.getMetadata(tokenId);
        console.log(`  Account 1 Index ${i}: Token #${tokenId} - "${metadata.name}"`);
    }
    console.log("");
    
    console.log("🎯 Test 4c: tokenOfOwnerByIndex() - Account 2's NFTs by index");
    for (let i = 0; i < account2Balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(account2.address, i);
        const metadata = await nftContract.getMetadata(tokenId);
        console.log(`  Account 2 Index ${i}: Token #${tokenId} - "${metadata.name}"`);
    }
    console.log("");
    
    // Test 5: Custom tokensOfOwner function
    console.log("📋 Test 5: tokensOfOwner() - Custom function (returns array)");
    const ownerTokens = await nftContract.tokensOfOwner(owner.address);
    const account1Tokens = await nftContract.tokensOfOwner(account1.address);
    const account2Tokens = await nftContract.tokensOfOwner(account2.address);
    console.log(`  Owner tokens: [${ownerTokens.map(t => t.toString()).join(", ")}]`);
    console.log(`  Account 1 tokens: [${account1Tokens.map(t => t.toString()).join(", ")}]`);
    console.log(`  Account 2 tokens: [${account2Tokens.map(t => t.toString()).join(", ")}]`);
    console.log("");
    
    // Test 6: supportsInterface - Check ERC721Enumerable support
    console.log("🔍 Test 6: supportsInterface() - Check standards support");
    const ERC721_INTERFACE = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE = "0x5b5e139f";
    const ERC721_ENUMERABLE_INTERFACE = "0x780e9d63";
    
    const supportsERC721 = await nftContract.supportsInterface(ERC721_INTERFACE);
    const supportsMetadata = await nftContract.supportsInterface(ERC721_METADATA_INTERFACE);
    const supportsEnumerable = await nftContract.supportsInterface(ERC721_ENUMERABLE_INTERFACE);
    
    console.log(`  ERC721: ${supportsERC721 ? "✅" : "❌"}`);
    console.log(`  ERC721Metadata: ${supportsMetadata ? "✅" : "❌"}`);
    console.log(`  ERC721Enumerable: ${supportsEnumerable ? "✅" : "❌"}`);
    console.log("");
    
    console.log("============================================================");
    console.log("✅ All ERC721Enumerable tests completed successfully!");
    console.log("============================================================\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
