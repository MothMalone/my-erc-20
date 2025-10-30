// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TranMinhNam23021646_Token is ERC20, Ownable {
    // Tỷ giá: 1 ETH = bao nhiêu TMN
    uint256 public tokenPrice = 1000; // 1 ETH = 1000 TMN
    
    // Số ETH đã thu được từ việc bán token
    uint256 public totalEthRaised;
    
    // Sự kiện khi có người mua token
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokenPriceUpdated(uint256 newPrice);
    event EthWithdrawn(address indexed owner, uint256 amount);
    
    constructor() ERC20("TranMinhNam23021646_Token", "TMN") Ownable(msg.sender) {
        // Mint 1 triệu token cho owner (để có thể bán)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    /**
     * @dev Hàm cho phép người dùng mua token bằng ETH
     * Người dùng gửi ETH và nhận TMN theo tỷ giá hiện tại
     */
    function buyTokens() public payable {
        require(msg.value > 0, "Phai gui ETH de mua token");
        
        // Tính số lượng token nhận được
        uint256 tokenAmount = (msg.value * tokenPrice * 10 ** decimals()) / 1 ether;
        
        // Kiểm tra contract có đủ token không
        require(balanceOf(owner()) >= tokenAmount, "Contract khong du token de ban");
        
        // Chuyển token từ owner sang người mua
        _transfer(owner(), msg.sender, tokenAmount);
        
        // Cập nhật tổng ETH đã thu
        totalEthRaised += msg.value;
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }
    
    /**
     * @dev Cho phép owner thay đổi giá token
     * @param newPrice Giá mới (1 ETH = newPrice TMN)
     */
    function setTokenPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "Gia phai lon hon 0");
        tokenPrice = newPrice;
        emit TokenPriceUpdated(newPrice);
    }
    
    /**
     * @dev Cho phép owner rút ETH đã thu về
     */
    function withdrawEth() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Khong co ETH de rut");
        
        payable(owner()).transfer(balance);
        emit EthWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Tính toán số token nhận được khi gửi một lượng ETH
     * @param ethAmount Số lượng ETH (in wei)
     * @return Số lượng TMN nhận được
     */
    function calculateTokenAmount(uint256 ethAmount) public view returns (uint256) {
        return (ethAmount * tokenPrice * 10 ** decimals()) / 1 ether;
    }
    
    /**
     * @dev Tính toán số ETH cần để mua một lượng token
     * @param tokenAmount Số lượng TMN muốn mua
     * @return Số lượng ETH cần (in wei)
     */
    function calculateEthCost(uint256 tokenAmount) public view returns (uint256) {
        return (tokenAmount * 1 ether) / (tokenPrice * 10 ** decimals());
    }
    
    // Fallback function để nhận ETH
    receive() external payable {
        buyTokens();
    }
}