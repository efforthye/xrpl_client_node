// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFundingProject {
    struct Project {
        string name;
        string category;
        string description;
        string imageUrl;
        address payable owner;
        uint256 goal;
        uint256 amountRaised;
        uint256 deadline;
        bool isFunded;
        bool isClosed;
    }

    Project[] public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event ProjectCreated(
        uint256 projectId,
        string name,
        string category,
        string description,
        string imageUrl,
        address owner,
        uint256 goal,
        uint256 deadline
    );

    event Funded(uint256 projectId, address contributor, uint256 amount);
    event ProjectClosed(uint256 projectId, bool isFunded);

    modifier onlyOwner(uint256 _projectId) {
        require(msg.sender == projects[_projectId].owner, "Only project owner can call this function");
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId < projects.length, "Project does not exist");
        _;
    }

    modifier notClosed(uint256 _projectId) {
        require(!projects[_projectId].isClosed, "Project is already closed");
        _;
    }

    function createProject(
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _imageUrl,
        uint256 _goal,
        uint256 _durationInDays
    ) public {
        require(_goal > 0, "Goal must be greater than zero");
        require(_durationInDays > 0, "Duration must be greater than zero");

        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        
        projects.push(Project({
            name: _name,
            category: _category,
            description: _description,
            imageUrl: _imageUrl,
            owner: payable(msg.sender),
            goal: _goal,
            amountRaised: 0,
            deadline: deadline,
            isFunded: false,
            isClosed: false
        }));

        emit ProjectCreated(projects.length - 1, _name, _category, _description, _imageUrl, msg.sender, _goal, deadline);
    }

    function fundProject(uint256 _projectId) public payable projectExists(_projectId) notClosed(_projectId) {
        Project storage project = projects[_projectId];

        require(msg.value > 0, "Contribution must be greater than zero");
        require(block.timestamp < project.deadline, "The deadline for funding this project has passed");

        project.amountRaised += msg.value;
        contributions[_projectId][msg.sender] += msg.value;

        emit Funded(_projectId, msg.sender, msg.value);

        if (project.amountRaised >= project.goal) {
            project.isFunded = true;
            closeProject(_projectId);
        }
    }

    function closeProject(uint256 _projectId) internal projectExists(_projectId) {
        Project storage project = projects[_projectId];
        project.isClosed = true;
        emit ProjectClosed(_projectId, project.isFunded);
    }

    function withdrawFunds(uint256 _projectId) public onlyOwner(_projectId) projectExists(_projectId) {
        Project storage project = projects[_projectId];
        require(project.isFunded, "Project is not funded yet");
        require(project.isClosed, "Project must be closed to withdraw funds");

        uint256 amount = project.amountRaised;
        project.amountRaised = 0;
        project.owner.transfer(amount);
    }

    function getProjectDetails(uint256 _projectId) public view projectExists(_projectId) returns (
        string memory, string memory, string memory, string memory, address, uint256, uint256, uint256, bool, bool
    ) {
        Project storage project = projects[_projectId];
        return (
            project.name,
            project.category,
            project.description,
            project.imageUrl,
            project.owner,
            project.goal,
            project.amountRaised,
            project.deadline,
            project.isFunded,
            project.isClosed
        );
    }

    function getContribution(uint256 _projectId, address _contributor) public view projectExists(_projectId) returns (uint256) {
        return contributions[_projectId][_contributor];
    }
}
