import { CONTRACTS, convertMistToSui } from '../config/contracts';

/**
 * Fetch treasury pool data
 */
export const fetchPoolData = async (suiClient) => {
  try {
    const object = await suiClient.getObject({
      id: CONTRACTS.POOL_ID,
      options: { showContent: true },
    });

    if (!object.data?.content?.fields) {
      throw new Error('Invalid pool object');
    }

    const fields = object.data.content.fields;
    
    return {
      balance: convertMistToSui(fields.balance),
      balanceInMist: fields.balance,
      admin: fields.admin,
      recycledNFTCount: fields.recycled_nfts?.length || 0,
      totalCollected: convertMistToSui(fields.total_collected),
      totalReturned: convertMistToSui(fields.total_returned),
      marketplaceFees: convertMistToSui(fields.marketplace_fees_collected),
    };
  } catch (error) {
    console.error('Error fetching pool data:', error);
    throw error;
  }
};

/**
 * Fetch recycled NFTs from pool
 */
export const fetchRecycledNFTs = async (suiClient) => {
  try {
    const object = await suiClient.getObject({
      id: CONTRACTS.POOL_ID,
      options: { showContent: true },
    });

    if (!object.data?.content?.fields) {
      throw new Error('Invalid pool object');
    }

    const recycledNFTs = object.data.content.fields.recycled_nfts || [];
    
    return recycledNFTs.map((nft, index) => ({
      index,
      name: nft.fields?.name || 'Unknown',
      rarity: nft.fields?.rarity || 0,
      baseValue: convertMistToSui(nft.fields?.base_value || 0),
      sequentialId: nft.fields?.sequential_id || 0,
      lootboxSource: nft.fields?.lootbox_source || 'Unknown',
      imageUrl: nft.fields?.image_url || '',
    }));
  } catch (error) {
    console.error('Error fetching recycled NFTs:', error);
    throw error;
  }
};

/**
 * Check if recycled pool is empty
 */
export const isRecycledPoolEmpty = (poolData) => {
  return poolData.recycledNFTCount === 0;
};