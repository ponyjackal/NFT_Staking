import { readContractAddress } from "../addresses/utils";

const STAKE_NFT_ADDRESS = readContractAddress("stakeNFT");
const REWARDS_NFT_ADDRESS = readContractAddress("rewardsNFT");
const LOCK_PERIOD = 60 * 10;

const values = {
  STAKE_NFT_ADDRESS,
  REWARDS_NFT_ADDRESS,
  LOCK_PERIOD,
} as const;

export default values;
