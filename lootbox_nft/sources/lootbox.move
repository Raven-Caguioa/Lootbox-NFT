module lootbox_nft::lootbox {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::random::{Self, Random};
    use std::string::{String};
    use lootbox_nft::nft::{Self, LootboxNFT};
    use lootbox_nft::pool::{Self, TreasuryPool};

    /// Errors
    const E_INVALID_PAYMENT: u64 = 0;
    const E_LOOTBOX_SOLD_OUT: u64 = 1;
    const E_NOT_ADMIN: u64 = 2;
    const E_RECYCLED_POOL_EMPTY: u64 = 3;
    const E_MISMATCHED_VECTOR_LENGTHS: u64 = 4;
    const E_INVALID_SUPPLY: u64 = 5;
    const E_EMPTY_LOOTBOX: u64 = 6;

    /// Rarity constants
    const RARITY_COMMON: u8 = 0;
    const RARITY_RARE: u8 = 1;
    const RARITY_SUPER_RARE: u8 = 2;
    const RARITY_SUPER_SUPER_RARE: u8 = 3;
    const RARITY_ULTRA_RARE: u8 = 4;
    const RARITY_LEGEND_RARE: u8 = 5;

    /// NFT Type configuration for a specific rarity
    public struct NFTTypeConfig has store, drop {
        name: String,
        base_value: u64,
        image_url: String,
        available_ids: vector<u64>,
    }

    /// OLD Lootbox configuration (v1 - single NFT per rarity)
    public struct LootboxConfig has key {
        id: UID,
        lootbox_name: String,
        price: u64,
        admin: address,
        
        common_config: NFTTypeConfig,
        rare_config: NFTTypeConfig,
        super_rare_config: NFTTypeConfig,
        super_super_rare_config: NFTTypeConfig,
        ultra_rare_config: NFTTypeConfig,
        legend_rare_config: NFTTypeConfig,
        
        total_opened: u64,
    }

    /// NEW Lootbox configuration (v2 - multiple NFTs per rarity)
    public struct LootboxConfigV2 has key {
        id: UID,
        lootbox_name: String,
        price: u64,
        admin: address,
        
        common_configs: vector<NFTTypeConfig>,
        rare_configs: vector<NFTTypeConfig>,
        super_rare_configs: vector<NFTTypeConfig>,
        super_super_rare_configs: vector<NFTTypeConfig>,
        ultra_rare_configs: vector<NFTTypeConfig>,
        legend_rare_configs: vector<NFTTypeConfig>,
        
        total_opened: u64,
    }

    /// Recycled Lootbox Config
    public struct RecycledLootboxConfig has key {
        id: UID,
        price: u64,
        admin: address,
        total_opened: u64,
    }

    // ==================== OLD FUNCTIONS (V1) ====================

    /// Create OLD style lootbox (single NFT per rarity, 500 copies each)
    public entry fun create_lootbox(
        lootbox_name: String,
        price: u64,
        common_name: String,
        common_value: u64,
        common_image: String,
        rare_name: String,
        rare_value: u64,
        rare_image: String,
        sr_name: String,
        sr_value: u64,
        sr_image: String,
        ssr_name: String,
        ssr_value: u64,
        ssr_image: String,
        ur_name: String,
        ur_value: u64,
        ur_image: String,
        lr_name: String,
        lr_value: u64,
        lr_image: String,
        ctx: &mut TxContext
    ) {
        let lootbox = LootboxConfig {
            id: object::new(ctx),
            lootbox_name,
            price,
            admin: tx_context::sender(ctx),
            common_config: create_nft_type_config(common_name, common_value, common_image, 500),
            rare_config: create_nft_type_config(rare_name, rare_value, rare_image, 500),
            super_rare_config: create_nft_type_config(sr_name, sr_value, sr_image, 500),
            super_super_rare_config: create_nft_type_config(ssr_name, ssr_value, ssr_image, 500),
            ultra_rare_config: create_nft_type_config(ur_name, ur_value, ur_image, 500),
            legend_rare_config: create_nft_type_config(lr_name, lr_value, lr_image, 500),
            total_opened: 0,
        };
        transfer::share_object(lootbox);
    }

    /// Open OLD style lootbox
    public entry fun open_lootbox(
        lootbox: &mut LootboxConfig,
        pool: &mut TreasuryPool,
        payment: Coin<SUI>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == lootbox.price, E_INVALID_PAYMENT);
        assert!(!is_sold_out_v1(lootbox), E_LOOTBOX_SOLD_OUT);

        pool::add_to_pool(pool, payment);

        let mut generator = random::new_generator(r, ctx);
        let rarity = roll_rarity_with_stock_check_v1(lootbox, &mut generator);

        let lootbox_name = lootbox.lootbox_name;
        let nft_config = get_config_by_rarity_mut_v1(lootbox, rarity);

        let id_index = random::generate_u64_in_range(&mut generator, 0, vector::length(&nft_config.available_ids) - 1);
        let sequential_id = vector::swap_remove(&mut nft_config.available_ids, id_index);

        let name = nft_config.name;
        let base_value = nft_config.base_value;
        let image_url = nft_config.image_url;

        let nft = nft::mint_nft(
            name,
            rarity,
            base_value,
            sequential_id,
            lootbox_name,
            image_url,
            ctx
        );

        nft::transfer_nft(nft, tx_context::sender(ctx));
        lootbox.total_opened = lootbox.total_opened + 1;
    }

    // ==================== NEW FUNCTIONS (V2) ====================

    /// Create NEW style lootbox (multiple NFTs per rarity, flexible supply)
    public entry fun create_lootbox_v2(
        lootbox_name: String,
        price: u64,
        common_names: vector<String>,
        common_values: vector<u64>,
        common_images: vector<String>,
        common_max_supplies: vector<u64>,
        rare_names: vector<String>,
        rare_values: vector<u64>,
        rare_images: vector<String>,
        rare_max_supplies: vector<u64>,
        sr_names: vector<String>,
        sr_values: vector<u64>,
        sr_images: vector<String>,
        sr_max_supplies: vector<u64>,
        ssr_names: vector<String>,
        ssr_values: vector<u64>,
        ssr_images: vector<String>,
        ssr_max_supplies: vector<u64>,
        ur_names: vector<String>,
        ur_values: vector<u64>,
        ur_images: vector<String>,
        ur_max_supplies: vector<u64>,
        lr_names: vector<String>,
        lr_values: vector<u64>,
        lr_images: vector<String>,
        lr_max_supplies: vector<u64>,
        ctx: &mut TxContext
    ) {
        validate_vectors(&common_names, &common_values, &common_images, &common_max_supplies);
        validate_vectors(&rare_names, &rare_values, &rare_images, &rare_max_supplies);
        validate_vectors(&sr_names, &sr_values, &sr_images, &sr_max_supplies);
        validate_vectors(&ssr_names, &ssr_values, &ssr_images, &ssr_max_supplies);
        validate_vectors(&ur_names, &ur_values, &ur_images, &ur_max_supplies);
        validate_vectors(&lr_names, &lr_values, &lr_images, &lr_max_supplies);

        assert!(
            !vector::is_empty(&common_names) || 
            !vector::is_empty(&rare_names) || 
            !vector::is_empty(&sr_names) || 
            !vector::is_empty(&ssr_names) || 
            !vector::is_empty(&ur_names) || 
            !vector::is_empty(&lr_names),
            E_EMPTY_LOOTBOX
        );

        let lootbox = LootboxConfigV2 {
            id: object::new(ctx),
            lootbox_name,
            price,
            admin: tx_context::sender(ctx),
            common_configs: create_nft_configs_batch(common_names, common_values, common_images, common_max_supplies),
            rare_configs: create_nft_configs_batch(rare_names, rare_values, rare_images, rare_max_supplies),
            super_rare_configs: create_nft_configs_batch(sr_names, sr_values, sr_images, sr_max_supplies),
            super_super_rare_configs: create_nft_configs_batch(ssr_names, ssr_values, ssr_images, ssr_max_supplies),
            ultra_rare_configs: create_nft_configs_batch(ur_names, ur_values, ur_images, ur_max_supplies),
            legend_rare_configs: create_nft_configs_batch(lr_names, lr_values, lr_images, lr_max_supplies),
            total_opened: 0,
        };
        transfer::share_object(lootbox);
    }

    /// Open NEW style lootbox
    public entry fun open_lootbox_v2(
        lootbox: &mut LootboxConfigV2,
        pool: &mut TreasuryPool,
        payment: Coin<SUI>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == lootbox.price, E_INVALID_PAYMENT);
        assert!(!is_sold_out_v2(lootbox), E_LOOTBOX_SOLD_OUT);

        pool::add_to_pool(pool, payment);

        let mut generator = random::new_generator(r, ctx);
        let rarity = roll_rarity_with_stock_check_v2(lootbox, &mut generator);
        let lootbox_name = lootbox.lootbox_name;
        let nft_configs = get_configs_by_rarity_mut_v2(lootbox, rarity);

        let type_index = random::generate_u64_in_range(&mut generator, 0, vector::length(nft_configs) - 1);
        let nft_config = vector::borrow_mut(nft_configs, type_index);

        let id_index = random::generate_u64_in_range(&mut generator, 0, vector::length(&nft_config.available_ids) - 1);
        let sequential_id = vector::swap_remove(&mut nft_config.available_ids, id_index);

        let name = nft_config.name;
        let base_value = nft_config.base_value;
        let image_url = nft_config.image_url;

        let nft = nft::mint_nft(
            name,
            rarity,
            base_value,
            sequential_id,
            lootbox_name,
            image_url,
            ctx
        );

        nft::transfer_nft(nft, tx_context::sender(ctx));
        lootbox.total_opened = lootbox.total_opened + 1;
    }

    // ==================== RECYCLED LOOTBOX ====================

    public entry fun create_recycled_lootbox(
        price: u64,
        ctx: &mut TxContext
    ) {
        let recycled = RecycledLootboxConfig {
            id: object::new(ctx),
            price,
            admin: tx_context::sender(ctx),
            total_opened: 0,
        };
        transfer::share_object(recycled);
    }

    public entry fun open_recycled_lootbox(
        recycled: &mut RecycledLootboxConfig,
        pool: &mut TreasuryPool,
        payment: Coin<SUI>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == recycled.price, E_INVALID_PAYMENT);
        assert!(!pool::is_recycled_pool_empty(pool), E_RECYCLED_POOL_EMPTY);

        pool::add_to_pool(pool, payment);

        let mut generator = random::new_generator(r, ctx);
        let random_index = random::generate_u64(&mut generator);
        let nft = pool::get_random_from_recycled(pool, random_index, ctx);

        nft::transfer_nft(nft, tx_context::sender(ctx));
        recycled.total_opened = recycled.total_opened + 1;
    }

    // ==================== HELPER FUNCTIONS ====================

    fun create_nft_type_config(
        name: String, 
        base_value: u64, 
        image_url: String,
        max_supply: u64
    ): NFTTypeConfig {
        assert!(max_supply > 0, E_INVALID_SUPPLY);
        
        let mut ids = vector::empty<u64>();
        let mut i = 1;
        while (i <= max_supply) {
            vector::push_back(&mut ids, i);
            i = i + 1;
        };
        
        NFTTypeConfig {
            name,
            base_value,
            image_url,
            available_ids: ids,
        }
    }

    fun create_nft_configs_batch(
        names: vector<String>,
        values: vector<u64>,
        images: vector<String>,
        max_supplies: vector<u64>
    ): vector<NFTTypeConfig> {
        let mut configs = vector::empty<NFTTypeConfig>();
        let len = vector::length(&names);
        
        let mut i = 0;
        while (i < len) {
            let name = *vector::borrow(&names, i);
            let value = *vector::borrow(&values, i);
            let image = *vector::borrow(&images, i);
            let supply = *vector::borrow(&max_supplies, i);
            
            let config = create_nft_type_config(name, value, image, supply);
            vector::push_back(&mut configs, config);
            i = i + 1;
        };
        
        configs
    }

    fun validate_vectors(
        names: &vector<String>,
        values: &vector<u64>,
        images: &vector<String>,
        supplies: &vector<u64>
    ) {
        let len = vector::length(names);
        assert!(
            vector::length(values) == len &&
            vector::length(images) == len &&
            vector::length(supplies) == len,
            E_MISMATCHED_VECTOR_LENGTHS
        );

        let mut i = 0;
        while (i < len) {
            assert!(*vector::borrow(supplies, i) > 0, E_INVALID_SUPPLY);
            i = i + 1;
        };
    }

    fun roll_rarity_with_stock_check_v1(lootbox: &LootboxConfig, generator: &mut random::RandomGenerator): u8 {
        let mut available_rarities = vector::empty<u8>();
        let mut weights = vector::empty<u64>();

        if (!vector::is_empty(&lootbox.common_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_COMMON);
            vector::push_back(&mut weights, 40);
        };
        if (!vector::is_empty(&lootbox.rare_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_RARE);
            vector::push_back(&mut weights, 30);
        };
        if (!vector::is_empty(&lootbox.super_rare_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_SUPER_RARE);
            vector::push_back(&mut weights, 15);
        };
        if (!vector::is_empty(&lootbox.super_super_rare_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_SUPER_SUPER_RARE);
            vector::push_back(&mut weights, 9);
        };
        if (!vector::is_empty(&lootbox.ultra_rare_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_ULTRA_RARE);
            vector::push_back(&mut weights, 5);
        };
        if (!vector::is_empty(&lootbox.legend_rare_config.available_ids)) {
            vector::push_back(&mut available_rarities, RARITY_LEGEND_RARE);
            vector::push_back(&mut weights, 1);
        };

        let mut total_weight = 0;
        let mut i = 0;
        while (i < vector::length(&weights)) {
            total_weight = total_weight + *vector::borrow(&weights, i);
            i = i + 1;
        };

        let roll = random::generate_u64_in_range(generator, 0, total_weight - 1);
        
        let mut cumulative = 0;
        i = 0;
        while (i < vector::length(&weights)) {
            cumulative = cumulative + *vector::borrow(&weights, i);
            if (roll < cumulative) {
                return *vector::borrow(&available_rarities, i)
            };
            i = i + 1;
        };

        *vector::borrow(&available_rarities, 0)
    }

    fun roll_rarity_with_stock_check_v2(lootbox: &LootboxConfigV2, generator: &mut random::RandomGenerator): u8 {
        let mut available_rarities = vector::empty<u8>();
        let mut weights = vector::empty<u64>();

        if (has_available_stock(&lootbox.common_configs)) {
            vector::push_back(&mut available_rarities, RARITY_COMMON);
            vector::push_back(&mut weights, 40);
        };
        if (has_available_stock(&lootbox.rare_configs)) {
            vector::push_back(&mut available_rarities, RARITY_RARE);
            vector::push_back(&mut weights, 30);
        };
        if (has_available_stock(&lootbox.super_rare_configs)) {
            vector::push_back(&mut available_rarities, RARITY_SUPER_RARE);
            vector::push_back(&mut weights, 15);
        };
        if (has_available_stock(&lootbox.super_super_rare_configs)) {
            vector::push_back(&mut available_rarities, RARITY_SUPER_SUPER_RARE);
            vector::push_back(&mut weights, 9);
        };
        if (has_available_stock(&lootbox.ultra_rare_configs)) {
            vector::push_back(&mut available_rarities, RARITY_ULTRA_RARE);
            vector::push_back(&mut weights, 5);
        };
        if (has_available_stock(&lootbox.legend_rare_configs)) {
            vector::push_back(&mut available_rarities, RARITY_LEGEND_RARE);
            vector::push_back(&mut weights, 1);
        };

        let mut total_weight = 0;
        let mut i = 0;
        while (i < vector::length(&weights)) {
            total_weight = total_weight + *vector::borrow(&weights, i);
            i = i + 1;
        };

        let roll = random::generate_u64_in_range(generator, 0, total_weight - 1);
        
        let mut cumulative = 0;
        i = 0;
        while (i < vector::length(&weights)) {
            cumulative = cumulative + *vector::borrow(&weights, i);
            if (roll < cumulative) {
                return *vector::borrow(&available_rarities, i)
            };
            i = i + 1;
        };

        *vector::borrow(&available_rarities, 0)
    }

    fun has_available_stock(configs: &vector<NFTTypeConfig>): bool {
        let mut i = 0;
        while (i < vector::length(configs)) {
            let config = vector::borrow(configs, i);
            if (!vector::is_empty(&config.available_ids)) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun get_config_by_rarity_mut_v1(lootbox: &mut LootboxConfig, rarity: u8): &mut NFTTypeConfig {
        if (rarity == RARITY_COMMON) {
            &mut lootbox.common_config
        } else if (rarity == RARITY_RARE) {
            &mut lootbox.rare_config
        } else if (rarity == RARITY_SUPER_RARE) {
            &mut lootbox.super_rare_config
        } else if (rarity == RARITY_SUPER_SUPER_RARE) {
            &mut lootbox.super_super_rare_config
        } else if (rarity == RARITY_ULTRA_RARE) {
            &mut lootbox.ultra_rare_config
        } else {
            &mut lootbox.legend_rare_config
        }
    }

    fun get_configs_by_rarity_mut_v2(lootbox: &mut LootboxConfigV2, rarity: u8): &mut vector<NFTTypeConfig> {
        if (rarity == RARITY_COMMON) {
            &mut lootbox.common_configs
        } else if (rarity == RARITY_RARE) {
            &mut lootbox.rare_configs
        } else if (rarity == RARITY_SUPER_RARE) {
            &mut lootbox.super_rare_configs
        } else if (rarity == RARITY_SUPER_SUPER_RARE) {
            &mut lootbox.super_super_rare_configs
        } else if (rarity == RARITY_ULTRA_RARE) {
            &mut lootbox.ultra_rare_configs
        } else {
            &mut lootbox.legend_rare_configs
        }
    }

    fun is_sold_out_v1(lootbox: &LootboxConfig): bool {
        vector::is_empty(&lootbox.common_config.available_ids) &&
        vector::is_empty(&lootbox.rare_config.available_ids) &&
        vector::is_empty(&lootbox.super_rare_config.available_ids) &&
        vector::is_empty(&lootbox.super_super_rare_config.available_ids) &&
        vector::is_empty(&lootbox.ultra_rare_config.available_ids) &&
        vector::is_empty(&lootbox.legend_rare_config.available_ids)
    }

    fun is_sold_out_v2(lootbox: &LootboxConfigV2): bool {
        !has_available_stock(&lootbox.common_configs) &&
        !has_available_stock(&lootbox.rare_configs) &&
        !has_available_stock(&lootbox.super_rare_configs) &&
        !has_available_stock(&lootbox.super_super_rare_configs) &&
        !has_available_stock(&lootbox.ultra_rare_configs) &&
        !has_available_stock(&lootbox.legend_rare_configs)
    }

    // ==================== VIEW FUNCTIONS ====================

    /// Original V1 view functions
    public fun get_remaining_stock(lootbox: &LootboxConfig, rarity: u8): u64 {
        if (rarity == RARITY_COMMON) {
            vector::length(&lootbox.common_config.available_ids)
        } else if (rarity == RARITY_RARE) {
            vector::length(&lootbox.rare_config.available_ids)
        } else if (rarity == RARITY_SUPER_RARE) {
            vector::length(&lootbox.super_rare_config.available_ids)
        } else if (rarity == RARITY_SUPER_SUPER_RARE) {
            vector::length(&lootbox.super_super_rare_config.available_ids)
        } else if (rarity == RARITY_ULTRA_RARE) {
            vector::length(&lootbox.ultra_rare_config.available_ids)
        } else {
            vector::length(&lootbox.legend_rare_config.available_ids)
        }
    }

    public fun get_price(lootbox: &LootboxConfig): u64 {
        lootbox.price
    }

    public fun get_total_opened(lootbox: &LootboxConfig): u64 {
        lootbox.total_opened
    }

    /// V2 view functions
    public fun get_total_stock_by_rarity_v2(lootbox: &LootboxConfigV2, rarity: u8): u64 {
        let configs = if (rarity == RARITY_COMMON) {
            &lootbox.common_configs
        } else if (rarity == RARITY_RARE) {
            &lootbox.rare_configs
        } else if (rarity == RARITY_SUPER_RARE) {
            &lootbox.super_rare_configs
        } else if (rarity == RARITY_SUPER_SUPER_RARE) {
            &lootbox.super_super_rare_configs
        } else if (rarity == RARITY_ULTRA_RARE) {
            &lootbox.ultra_rare_configs
        } else {
            &lootbox.legend_rare_configs
        };

        let mut total = 0;
        let mut i = 0;
        while (i < vector::length(configs)) {
            let config = vector::borrow(configs, i);
            total = total + vector::length(&config.available_ids);
            i = i + 1;
        };
        total
    }

    public fun get_nft_type_count_v2(lootbox: &LootboxConfigV2, rarity: u8): u64 {
        let configs = if (rarity == RARITY_COMMON) {
            &lootbox.common_configs
        } else if (rarity == RARITY_RARE) {
            &lootbox.rare_configs
        } else if (rarity == RARITY_SUPER_RARE) {
            &lootbox.super_rare_configs
        } else if (rarity == RARITY_SUPER_SUPER_RARE) {
            &lootbox.super_super_rare_configs
        } else if (rarity == RARITY_ULTRA_RARE) {
            &lootbox.ultra_rare_configs
        } else {
            &lootbox.legend_rare_configs
        };
        vector::length(configs)
    }

    public fun get_price_v2(lootbox: &LootboxConfigV2): u64 {
        lootbox.price
    }

    public fun get_total_opened_v2(lootbox: &LootboxConfigV2): u64 {
        lootbox.total_opened
    }

    public fun get_recycled_price(recycled: &RecycledLootboxConfig): u64 {
        recycled.price
    }
}