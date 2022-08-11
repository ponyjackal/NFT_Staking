import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { NFTStaking2 } from "../../src/types/contracts/NFTStaking2";
import { NFTStaking2__factory } from "../../src/types/factories/contracts/NFTStaking2__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/nftStaking2";

task("deploy:NFTStaking2").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: NFTStaking2__factory = <NFTStaking2__factory>(
    await ethers.getContractFactory("NFTStaking2", accounts[0])
  );

  const contract: NFTStaking2 = <NFTStaking2>(
    await factory.deploy(cArguments.STAKE_NFT_ADDRESS, cArguments.REWARDS_NFT_ADDRESS)
  );
  await contract.deployed();

  writeContractAddress("nftStaking2", contract.address);
  console.log("NFTStaking2 deployed to: ", contract.address);
});

task("verify:NFTStaking2").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("nftStaking2");

  await run("verify:verify", {
    address,
    constructorArguments: [cArguments.STAKE_NFT_ADDRESS, cArguments.REWARDS_NFT_ADDRESS],
  });
});
