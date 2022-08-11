import { readContractAddress } from "../addresses/utils";

const REWARDS_TOKEN_ADDRESS = readContractAddress("rewardsToken");
const STAKE_NFT_ADDRESS = readContractAddress("stakeNFT");

const values = {
  REWARDS_TOKEN_ADDRESS,
  STAKE_NFT_ADDRESS,
} as const;

export default values;
