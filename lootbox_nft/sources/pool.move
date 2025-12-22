module lootbox_nft::pool {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use std::string::{String};
    use lootbox_nft::nft::{Self, LootboxNFT};

    /// Errors
    const E_INSUFFICIENT_POOL_BALANCE: u64 = 0;
    const E_NOT_ADMIN: u64 = 1;
    const E_RECYCLED_POOL_EMPTY: u64 = 2;

    /// Struct to store a recycled NFT's data
    public struct RecycledNFTData has store, drop {
        name: String,
        rarity: u8,
        base_value: u64,
        sequential_id: u64,
        lootbox_source: String,
        image_url: String,
    }

    /// Main pool/treasury that holds all SUI
    public struct TreasuryPool has key {
        id: UID,
        balance: Balance<SUI>,              // All SUI collected
        admin: address,                      // Admin who can withdraw fees
        recycled_nfts: vector<RecycledNFTData>, // Returned NFTs waiting to be re-distributed
        total_collected: u64,                // Total SUI ever collected
        total_returned: u64,                 // Total SUI returned to users
        marketplace_fees_collected: u64,     // Total marketplace fees
    }

    /// Initialize the pool (called once on deployment)
    fun init(ctx: &mut TxContext) {
        let pool = TreasuryPool {
            id: object::new(ctx),
            balance: balance::zero(),
            admin: tx_context::sender(ctx),
            recycled_nfts: vector::empty(),
            total_collected: 0,
            total_returned: 0,
            marketplace_fees_collected: 0,
        };
        transfer::share_object(pool);
    }

    /// Add initial funding to pool (called by admin)
    public entry fun fund_pool(
        pool: &mut TreasuryPool,
        payment: Coin<SUI>,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == pool.admin, E_NOT_ADMIN);
        let amount = coin::value(&payment);
        coin::put(&mut pool.balance, payment);
        pool.total_collected = pool.total_collected + amount;
    }

    /// Add SUI from lootbox purchase to pool
    public(package) fun add_to_pool(pool: &mut TreasuryPool, payment: Coin<SUI>) {
        let amount = coin::value(&payment);
        coin::put(&mut pool.balance, payment);
        pool.total_collected = pool.total_collected + amount;
    }

    /// Return NFT to recycled pool and pay user base value
    public entry fun return_nft_to_pool(
        pool: &mut TreasuryPool,
        nft: LootboxNFT,
        ctx: &mut TxContext
    ) {
        let base_value = nft::get_base_value(&nft);
        
        // Check pool has enough balance
        assert!(balance::value(&pool.balance) >= base_value, E_INSUFFICIENT_POOL_BALANCE);

        // Unpack NFT data
        let (name, rarity, base_value_copy, sequential_id, lootbox_source, image_url) = 
            nft::unpack_nft(nft);

        // Store NFT data in recycled pool
        let recycled_data = RecycledNFTData {
            name,
            rarity,
            base_value: base_value_copy,
            sequential_id,
            lootbox_source,
            image_url,
        };
        vector::push_back(&mut pool.recycled_nfts, recycled_data);

        // Pay user the base value
        let payment = coin::take(&mut pool.balance, base_value, ctx);
        transfer::public_transfer(payment, tx_context::sender(ctx));
        
        pool.total_returned = pool.total_returned + base_value;
    }

    /// Get random NFT from recycled pool (called by lootbox module)
    public(package) fun get_random_from_recycled(
        pool: &mut TreasuryPool,
        random_index: u64,
        ctx: &mut TxContext
    ): LootboxNFT {
        assert!(!vector::is_empty(&pool.recycled_nfts), E_RECYCLED_POOL_EMPTY);
        
        // Get random NFT data
        let index = random_index % vector::length(&pool.recycled_nfts);
        let recycled_data = vector::swap_remove(&mut pool.recycled_nfts, index);

        // Recreate NFT with new UID
        nft::repack_nft(
            recycled_data.name,
            recycled_data.rarity,
            recycled_data.base_value,
            recycled_data.sequential_id,
            recycled_data.lootbox_source,
            recycled_data.image_url,
            ctx,
        )
    }

    /// Add marketplace fee to pool
    public(package) fun add_marketplace_fee(pool: &mut TreasuryPool, fee: Coin<SUI>) {
        let amount = coin::value(&fee);
        coin::put(&mut pool.balance, fee);
        pool.marketplace_fees_collected = pool.marketplace_fees_collected + amount;
    }

    /// Admin withdraw (for operational costs, not user funds)
    public entry fun admin_withdraw(
        pool: &mut TreasuryPool,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == pool.admin, E_NOT_ADMIN);
        let payment = coin::take(&mut pool.balance, amount, ctx);
        transfer::public_transfer(payment, pool.admin);
    }

    /// View functions
    public fun get_pool_balance(pool: &TreasuryPool): u64 {
        balance::value(&pool.balance)
    }

    public fun get_recycled_count(pool: &TreasuryPool): u64 {
        vector::length(&pool.recycled_nfts)
    }

    public fun get_total_collected(pool: &TreasuryPool): u64 {
        pool.total_collected
    }

    public fun get_total_returned(pool: &TreasuryPool): u64 {
        pool.total_returned
    }

    public fun get_marketplace_fees(pool: &TreasuryPool): u64 {
        pool.marketplace_fees_collected
    }

    public fun is_recycled_pool_empty(pool: &TreasuryPool): bool {
        vector::is_empty(&pool.recycled_nfts)
    }
}