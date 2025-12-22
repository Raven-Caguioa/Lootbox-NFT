module lootbox_nft::nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::transfer;
    use sui::package;
    use sui::display;

    /// Rarity tiers
    const RARITY_COMMON: u8 = 0;
    const RARITY_RARE: u8 = 1;
    const RARITY_SUPER_RARE: u8 = 2;
    const RARITY_SUPER_SUPER_RARE: u8 = 3;
    const RARITY_ULTRA_RARE: u8 = 4;
    const RARITY_LEGEND_RARE: u8 = 5;

    /// One-Time-Witness for the module
    public struct NFT has drop {}

    /// The main NFT struct
    public struct LootboxNFT has key, store {
        id: UID,
        name: String,              // e.g., "Bronze Common NFT"
        rarity: u8,                // 0-5 (C, R, SR, SSR, UR, LR)
        base_value: u64,           // Value in MIST (1 SUI = 1_000_000_000 MIST)
        sequential_id: u64,        // 1-500 unique per NFT type
        lootbox_source: String,    // "Bronze", "Silver", "Gold"
        image_url: String,         // IPFS or HTTP URL
    }

    /// Initialize function - creates Publisher and Display
    fun init(otw: NFT, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        
        // Create Display object immediately
        let keys = vector[
            std::string::utf8(b"name"),
            std::string::utf8(b"description"),
            std::string::utf8(b"image_url"),
            std::string::utf8(b"project_url"),
            std::string::utf8(b"creator"),
        ];

        let values = vector[
            std::string::utf8(b"{name} #{sequential_id}"),
            std::string::utf8(b"A {lootbox_source} lootbox NFT with rarity tier {rarity}. Base value: {base_value} MIST"),
            std::string::utf8(b"{image_url}"),
            std::string::utf8(b"https://your-lootbox-project.com"),
            std::string::utf8(b"Lootbox NFT Collection"),
        ];

        let mut display = display::new_with_fields<LootboxNFT>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);
        
        // Transfer both Publisher and Display to sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Create a new NFT (called by lootbox module)
    public(package) fun mint_nft(
        name: String,
        rarity: u8,
        base_value: u64,
        sequential_id: u64,
        lootbox_source: String,
        image_url: String,
        ctx: &mut TxContext
    ): LootboxNFT {
        LootboxNFT {
            id: object::new(ctx),
            name,
            rarity,
            base_value,
            sequential_id,
            lootbox_source,
            image_url,
        }
    }

    /// Transfer NFT to recipient
    public fun transfer_nft(nft: LootboxNFT, recipient: address) {
        transfer::public_transfer(nft, recipient);
    }

    /// Getters
    public fun get_name(nft: &LootboxNFT): String {
        nft.name
    }

    public fun get_rarity(nft: &LootboxNFT): u8 {
        nft.rarity
    }

    public fun get_base_value(nft: &LootboxNFT): u64 {
        nft.base_value
    }

    public fun get_sequential_id(nft: &LootboxNFT): u64 {
        nft.sequential_id
    }

    public fun get_lootbox_source(nft: &LootboxNFT): String {
        nft.lootbox_source
    }

    public fun get_image_url(nft: &LootboxNFT): String {
        nft.image_url
    }

    /// Unpack NFT (used when returning to pool or burning)
    public(package) fun unpack_nft(nft: LootboxNFT): (String, u8, u64, u64, String, String) {
        let LootboxNFT { 
            id, 
            name, 
            rarity, 
            base_value, 
            sequential_id, 
            lootbox_source, 
            image_url 
        } = nft;
        object::delete(id);
        (name, rarity, base_value, sequential_id, lootbox_source, image_url)
    }

    /// Repack NFT (used when pulling from recycled pool)
    public(package) fun repack_nft(
        name: String,
        rarity: u8,
        base_value: u64,
        sequential_id: u64,
        lootbox_source: String,
        image_url: String,
        ctx: &mut TxContext,
    ): LootboxNFT {
        LootboxNFT {
            id: object::new(ctx),
            name,
            rarity,
            base_value,
            sequential_id,
            lootbox_source,
            image_url,
        }
    }
}