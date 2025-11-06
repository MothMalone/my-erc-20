// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TranMinhNam23021646_NFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    
    // Mapping từ token ID đến metadata
    mapping(uint256 => NFTMetadata) public nftMetadata;
    
    struct NFTMetadata {
        string name;
        string description;
        uint256 mintedAt;
        address minter;
    }
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event NFTTransferred(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor() ERC721("TranMinhNam23021646_NFT", "TMN-NFT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    /**
     * @dev Mint NFT mới với metadata tùy chỉnh
     * @param to Địa chỉ nhận NFT
     * @param name Tên của NFT
     * @param description Mô tả NFT
     * @param imageURI URI của ảnh NFT (có thể là IPFS, HTTP, hoặc data URI)
     */
    function mintNFT(
        address to,
        string memory name,
        string memory description,
        string memory imageURI
    ) public returns (uint256) {
        require(to != address(0), "Khong the mint cho dia chi 0");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        // Tạo metadata JSON
        string memory json = string(abi.encodePacked(
            '{"name":"', name,
            '","description":"', description,
            '","image":"', imageURI,
            '","attributes":[',
                '{"trait_type":"Token ID","value":"', tokenId.toString(), '"},',
                '{"trait_type":"Minted At","value":"', block.timestamp.toString(), '"},',
                '{"trait_type":"Minter","value":"', addressToString(msg.sender), '"}',
            ']}'
        ));
        
        // Encode to base64 data URI
        string memory finalTokenURI = string(abi.encodePacked(
            "data:application/json;base64,",
            base64Encode(bytes(json))
        ));
        
        _setTokenURI(tokenId, finalTokenURI);
        
        // Lưu metadata
        nftMetadata[tokenId] = NFTMetadata({
            name: name,
            description: description,
            mintedAt: block.timestamp,
            minter: msg.sender
        });
        
        emit NFTMinted(to, tokenId, finalTokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Mint NFT đơn giản với tên và mô tả, không cần ảnh
     */
    function mintSimpleNFT(address to, string memory name, string memory description) 
        public 
        returns (uint256) 
    {
        // Tạo một SVG đơn giản làm ảnh mặc định
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">',
            '<rect width="400" height="400" fill="url(#grad)"/>',
            '<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />',
            '</linearGradient></defs>',
            '<text x="50%" y="40%" text-anchor="middle" font-size="32" fill="white" font-family="Arial">',
            name,
            '</text>',
            '<text x="50%" y="60%" text-anchor="middle" font-size="48" fill="white" font-family="monospace">',
            '#', _tokenIdCounter.toString(),
            '</text>',
            '</svg>'
        ));
        
        string memory imageURI = string(abi.encodePacked(
            "data:image/svg+xml;base64,",
            base64Encode(bytes(svg))
        ));
        
        return mintNFT(to, name, description, imageURI);
    }
    
    /**
     * @dev Transfer NFT (override để emit custom event)
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override(ERC721, IERC721) {
        super.safeTransferFrom(from, to, tokenId, data);
        emit NFTTransferred(from, to, tokenId);
    }
    
    /**
     * @dev Override required for ERC721Enumerable - returns total supply from parent
     */
    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }
    
    /**
     * @dev Override required for ERC721Enumerable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Lấy danh sách NFT của một địa chỉ
     */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Lấy thông tin metadata của NFT
     */
    function getMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token khong ton tai");
        return nftMetadata[tokenId];
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Helper functions
    function addressToString(address addr) internal pure returns (string memory) {
        bytes memory data = abi.encodePacked(addr);
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
    
    function base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen);
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            let dataPtr := add(data, 32)
            let endPtr := add(dataPtr, mload(data))
            
            for {} lt(dataPtr, endPtr) {}
            {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        
        return result;
    }
}
