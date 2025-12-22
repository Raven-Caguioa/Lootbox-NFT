import { CONTRACTS, convertMistToSui, RARITY_NAMES as RARITY_NAMES_MAP } from '../config/contracts';

// Export RARITY_NAMES for use in components
export const RARITY_NAMES = RARITY_NAMES_MAP;

/**
 * Fetch all NFTs owned by an address
 */
export const fetchUserNFTs = async (suiClient, ownerAddress) => {
  try {
    // Query all objects owned by the user
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      options: {
        showContent: true,
        showType: true,
      },
    });

    // Filter for LootboxNFT objects
    const nfts = ownedObjects.data
      .filter((obj) => 
        obj.data?.type?.includes('::nft::LootboxNFT')
      )
      .map((obj) => {
        const fields = obj.data?.content?.fields;
        if (!fields) return null;

        return {
          id: obj.data.objectId,
          name: fields.name,
          rarity: fields.rarity,
          rarityName: RARITY_NAMES[fields.rarity],
          baseValue: convertMistToSui(fields.base_value),
          baseValueInMist: fields.base_value,
          sequentialId: fields.sequential_id,
          lootboxSource: fields.lootbox_source,
          imageUrl: fields.image_url,
        };
      })
      .filter(Boolean);

    return nfts;
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw error;
  }
};

/**
 * Fetch a single NFT by ID
 */
export const fetchNFTById = async (suiClient, nftId) => {
  try {
    const object = await suiClient.getObject({
      id: nftId,
      options: { showContent: true },
    });

    if (!object.data?.content?.fields) {
      throw new Error('Invalid NFT object');
    }

    const fields = object.data.content.fields;
    
    return {
      id: nftId,
      name: fields.name,
      rarity: fields.rarity,
      rarityName: RARITY_NAMES[fields.rarity],
      baseValue: convertMistToSui(fields.base_value),
      baseValueInMist: fields.base_value,
      sequentialId: fields.sequential_id,
      lootboxSource: fields.lootbox_source,
      imageUrl: fields.image_url,
    };
  } catch (error) {
    console.error('Error fetching NFT by ID:', error);
    throw error;
  }
};

/**
 * Get rarity color class for UI
 */
export const getRarityColorClass = (rarity) => {
  const colors = {
    0: 'from-gray-400 to-gray-600', // Common
    1: 'from-blue-400 to-blue-600', // Rare
    2: 'from-purple-400 to-purple-600', // Super Rare
    3: 'from-pink-400 to-pink-600', // Super Super Rare
    4: 'from-yellow-400 to-orange-600', // Ultra Rare
    5: 'from-red-400 via-pink-500 to-purple-600', // Legend Rare
  };
  return colors[rarity] || colors[0];
};

/**
 * Sort NFTs by rarity (highest to lowest)
 */
export const sortNFTsByRarity = (nfts) => {
  return [...nfts].sort((a, b) => b.rarity - a.rarity);
};

/**
 * Filter NFTs by rarity
 */
export const filterNFTsByRarity = (nfts, minRarity) => {
  return nfts.filter((nft) => nft.rarity >= minRarity);
};