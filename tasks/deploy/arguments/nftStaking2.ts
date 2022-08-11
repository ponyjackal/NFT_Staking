import { readContractAddress } from "../addresses/utils";

const STAKE_NFT_ADDRESS = readContractAddress("stakeNFT");
const REWARDS_NFT_ADDRESS = readContractAddress("rewardsNFT");

const values = {
  STAKE_NFT_ADDRESS,
  REWARDS_NFT_ADDRESS,
} as const;

export default values;
