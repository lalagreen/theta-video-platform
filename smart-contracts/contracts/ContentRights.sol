pragma solidity ^0.8.21;

contract ContentRights {
    struct Video {
        address owner;
        string title;
        string description;
        string url;
        uint256 reward;
    }

    mapping(uint256 => Video) public videos;
    uint256 public videoCount;

    function uploadVideo(string memory title, string memory description, string memory url, uint256 reward) public {
        videoCount++;
        videos[videoCount] = Video(msg.sender, title, description, url, reward);
    }

    function rewardUploader(uint256 videoId) public payable {
        Video memory video = videos[videoId];
        require(video.reward == msg.value, "Incorrect reward amount");

        payable(video.owner).transfer(msg.value);
    }
}