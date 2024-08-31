const CrowdFundingProject = artifacts.require("CrowdFundingProject");

module.exports = function (deployer) {
  deployer.deploy(CrowdFundingProject);
};