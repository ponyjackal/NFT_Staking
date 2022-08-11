import { readContractAddress } from "../addresses/utils";

const GREEN_PASS_CONTRACT = readContractAddress("greenPass");
const GAME_KEY_CONTRACT = readContractAddress("gameKey");

const values = {
  GREEN_PASS_CONTRACT,
  GAME_KEY_CONTRACT,
} as const;

export default values;
