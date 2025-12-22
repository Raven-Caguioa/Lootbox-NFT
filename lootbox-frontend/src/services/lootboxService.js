import { CONTRACTS, RARITY, convertMistToSui } from '../config/contracts';

/**
 * Fetch lootbox configuration data (V1)
 */
export const fetchLootboxV1Data = async (suiClient, lootboxId) => {
  try {
    const object = await suiClient.getObject({
      id: lootboxId,
      options: { showContent: true },
    });

    if (!object.data?.content?.fields) {
      throw new Error('Invalid lootbox object');
    }

    const fields = object.data.content.fields;
    
    return {
      id: lootboxId,
      name: fields.lootbox_name,
      price: convertMistToSui(fields.price),
      priceInMist: fields.price,
      admin: fields.admin,
      totalOpened: fields.total_opened,
      stocks: {
        [RARITY.COMMON]: fields.common_config?.fields?.available_ids?.length || 0,
        [RARITY.RARE]: fields.rare_config?.fields?.available_ids?.length || 0,
        [RARITY.SUPER_RARE]: fields.super_rare_config?.fields?.available_ids?.length || 0,
        [RARITY.SUPER_SUPER_RARE]: fields.super_super_rare_config?.fields?.available_ids?.length || 0,
        [RARITY.ULTRA_RARE]: fields.ultra_rare_config?.fields?.available_ids?.length || 0,
        [RARITY.LEGEND_RARE]: fields.legend_rare_config?.fields?.available_ids?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching lootbox data:', error);
    throw error;
  }
};

/**
 * Fetch lootbox configuration data (V2)
 */
export const fetchLootboxV2Data = async (suiClient, lootboxId) => {
  try {
    const object = await suiClient.getObject({
      id: lootboxId,
      options: { showContent: true },
    });

    if (!object.data?.content?.fields) {
      throw new Error('Invalid lootbox object');
    }

    const fields = object.data.content.fields;
    
    // Count total stocks for each rarity
    const countStocks = (configs) => {
      if (!configs) return 0;
      return configs.reduce((total, config) => {
        return total + (config.fields?.available_ids?.length || 0);
      }, 0);
    };
    
    return {
      id: lootboxId,
      name: fields.lootbox_name,
      price: convertMistToSui(fields.price),
      priceInMist: fields.price,
      admin: fields.admin,
      totalOpened: fields.total_opened,
      stocks: {
        [RARITY.COMMON]: countStocks(fields.common_configs),
        [RARITY.RARE]: countStocks(fields.rare_configs),
        [RARITY.SUPER_RARE]: countStocks(fields.super_rare_configs),
        [RARITY.SUPER_SUPER_RARE]: countStocks(fields.super_super_rare_configs),
        [RARITY.ULTRA_RARE]: countStocks(fields.ultra_rare_configs),
        [RARITY.LEGEND_RARE]: countStocks(fields.legend_rare_configs),
      },
    };
  } catch (error) {
    console.error('Error fetching lootbox V2 data:', error);
    throw error;
  }
};

/**
 * Calculate total remaining stock for a lootbox
 */
export const calculateTotalStock = (stocks) => {
  return Object.values(stocks).reduce((sum, stock) => sum + stock, 0);
};

/**
 * Calculate max stock from initial supply (V1 = 500 each, total 3000)
 */
export const calculateMaxStockV1 = () => 3000; // 6 rarities × 500 each

/**
 * Check if lootbox is sold out
 */
export const isLootboxSoldOut = (stocks) => {
  return calculateTotalStock(stocks) === 0;
};