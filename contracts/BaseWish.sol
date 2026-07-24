// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BaseWish {
    struct Wish {
        address author;
        string text;
        string tag;
        uint256 timestamp;
        uint256 supportCount;
        bool fulfilled;
        bool archived;
    }

    address public owner;
    uint256 public wishCount;
    uint256 public createPoints = 10;
    uint256 public supportPoints = 2;
    uint256 public referrerBonus = 15;
    uint256 public userBonus = 10;
    uint256 public constant MAX_TEXT = 280;
    uint256 public constant MAX_TAG = 24;

    mapping(uint256 => Wish) private wishes;
    mapping(address => uint256) public walletWishCount;
    mapping(address => uint256) public walletSupportCount;
    mapping(address => uint256) public rewardPoints;
    mapping(address => address) public referralOf;

    event WishCreated(uint256 indexed wishId, address indexed author, string text, string tag, address indexed referrer);
    event WishSupported(uint256 indexed wishId, address indexed supporter, uint256 supportCount);
    event WishFulfilled(uint256 indexed wishId, bool fulfilled);
    event WishArchived(uint256 indexed wishId, bool archived);
    event PointsUpdated(uint256 createPoints, uint256 supportPoints, uint256 referrerBonus, uint256 userBonus);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createWish(string calldata text, string calldata tag, address referrer) external {
        bytes calldata t = bytes(text);
        bytes calldata g = bytes(tag);
        require(t.length > 0 && t.length <= MAX_TEXT, "bad text");
        require(g.length <= MAX_TAG, "bad tag");

        wishCount++;
        wishes[wishCount] = Wish(msg.sender, text, tag, block.timestamp, 0, false, false);
        walletWishCount[msg.sender]++;
        rewardPoints[msg.sender] += createPoints;

        if (referralOf[msg.sender] == address(0) && walletWishCount[msg.sender] == 1 && referrer != address(0)) {
            referralOf[msg.sender] = referrer;
            if (referrer != msg.sender) {
                rewardPoints[referrer] += referrerBonus;
                rewardPoints[msg.sender] += userBonus;
            }
        }

        emit WishCreated(wishCount, msg.sender, text, tag, referrer);
    }

    function supportWish(uint256 wishId) external {
        require(wishId > 0 && wishId <= wishCount, "bad wish");
        Wish storage w = wishes[wishId];
        w.supportCount++;
        walletSupportCount[msg.sender]++;
        rewardPoints[msg.sender] += supportPoints;
        emit WishSupported(wishId, msg.sender, w.supportCount);
    }

    function markFulfilled(uint256 wishId, bool fulfilled) external {
        require(wishId > 0 && wishId <= wishCount, "bad wish");
        require(wishes[wishId].author == msg.sender, "not author");
        wishes[wishId].fulfilled = fulfilled;
        emit WishFulfilled(wishId, fulfilled);
    }

    function archiveWish(uint256 wishId, bool archived) external {
        require(wishId > 0 && wishId <= wishCount, "bad wish");
        require(wishes[wishId].author == msg.sender, "not author");
        wishes[wishId].archived = archived;
        emit WishArchived(wishId, archived);
    }

    function setPoints(uint256 _createPoints, uint256 _supportPoints, uint256 _referrerBonus, uint256 _userBonus) external onlyOwner {
        createPoints = _createPoints;
        supportPoints = _supportPoints;
        referrerBonus = _referrerBonus;
        userBonus = _userBonus;
        emit PointsUpdated(_createPoints, _supportPoints, _referrerBonus, _userBonus);
    }

    function getWish(uint256 wishId) external view returns (Wish memory) {
        require(wishId > 0 && wishId <= wishCount, "bad wish");
        return wishes[wishId];
    }
}
