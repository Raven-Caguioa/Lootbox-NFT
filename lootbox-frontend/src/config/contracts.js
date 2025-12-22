// Sui Network Configuration
export const NETWORK = 'testnet'; // or 'mainnet', 'devnet'

// Contract Addresses
export const CONTRACTS = {
  // FIRSTV1PACKAGE_ID: '0xfdc209ed0a889cee076867e02daec48de5e2c6bba139e36d829ec0e88b1eb621',
  // OLD_PACKAGE_ID: '0xec3bcba824ee5e5a2418a689b0f9302c0850d3fc489498b5495b834141a9d0f2',
  // PACKAGE_ID: '0x2a20d74d416b82af09cccf5fe9ff0cc102604fc7217016f64374a384dd20db6d',
  // PACKAGE_ID: '0x1e4cee59e2c4a3331446a6ca33d449419dfac6154c5b1aba80e222515172854a',
  PACKAGE_ID: '0xd140864e5d0376d7498250a568a1a91e5b7254d0fe2e801cc3038f88a514b45f',
  POOL_ID: '0x620698320ef929afa70d30d9c1e72f33853d6249e8c2d91ae7cb5a5ea4c85d11',
  MARKETPLACE_ID: '0xa1662af12d02dd79f9def236a0a2811810d19c7bea60fc37c804dbec2ce094dd',
  UPGRADE_CAP: '0xa6646ed92f5378b8a2485d6c143feba0d02e129f9910f2d3fa7e53433a63d91c',
  
  // Lootbox IDs (add more as needed)
  LOOTBOXES: {
    BRONZE_V1: '0x3912ea5dd8f1995d3462f820a456f08639415c5c1120b8c6d9ff1cd779a915be',
    // Add other lootbox IDs here
    // SILVER_V1: '0x...',
    // GOLD_V1: '0x...',
    // RECYCLED: '0x...',
  },
  
  // Random object (standard on Sui)
  RANDOM_OBJECT: '0x8',
};

// Rarity Constants (must match contract)
export const RARITY = {
  COMMON: 0,
  RARE: 1,
  SUPER_RARE: 2,
  SUPER_SUPER_RARE: 3,
  ULTRA_RARE: 4,
  LEGEND_RARE: 5,
};

// Rarity Display Names
export const RARITY_NAMES = {
  0: 'Common',
  1: 'Rare',
  2: 'Super Rare',
  3: 'Super Super Rare',
  4: 'Ultra Rare',
  5: 'Legend Rare',
};

// Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
export const MIST_PER_SUI = 1_000_000_000;

export const convertMistToSui = (mist) => {
  return Number(mist) / MIST_PER_SUI;
};

export const convertSuiToMist = (sui) => {
  return Math.floor(Number(sui) * MIST_PER_SUI);
};