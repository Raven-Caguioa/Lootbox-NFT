module lootbox_nft::marketplace {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::table::{Self, Table};
    use lootbox_nft::nft::{Self, LootboxNFT};
    use lootbox_nft::pool::{Self, TreasuryPool};

    /// Errors
    const E_NOT_SELLER: u64 = 0;
    const E_INVALID_PAYMENT: u64 = 1;
    const E_LISTING_NOT_FOUND: u64 = 2;

    /// Marketplace fee: 10%
    const MARKETPLACE_FEE_BPS: u64 = 1000; // 10% in basis points (10% = 1000/10000)

    /// A listing on the marketplace
    public struct Listing has key, store {
        id: UID,
        nft_id: ID,             // ID of the listed NFT
        seller: address,
        price: u64,             // in MIST
        nft: LootboxNFT,       // The actual NFT being sold
    }

    /// Marketplace object to track all listings
    public struct Marketplace has key {
        id: UID,
        listings: Table<ID, Listing>, // Map of listing_id -> Listing
        total_sales: u64,
        total_volume: u64,
    }

    /// Initialize marketplace
    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            listings: table::new(ctx),
            total_sales: 0,
            total_volume: 0,
        };
        transfer::share_object(marketplace);
    }

    /// List an NFT for sale
    public entry fun list_nft(
        marketplace: &mut Marketplace,
        nft: LootboxNFT,
        price: u64,
        ctx: &mut TxContext
    ) {
        let nft_id = object::id(&nft);
        
        let listing = Listing {
            id: object::new(ctx),
            nft_id,
            seller: tx_context::sender(ctx),
            price,
            nft,
        };

        let listing_id = object::id(&listing);
        table::add(&mut marketplace.listings, listing_id, listing);
    }

    /// Buy an NFT from marketplace
    public entry fun buy_nft(
        marketplace: &mut Marketplace,
        pool: &mut TreasuryPool,
        listing_id: ID,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Get listing
        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        let Listing { id, nft_id: _, seller, price, nft } = table::remove(&mut marketplace.listings, listing_id);
        
        // Verify payment
        assert!(coin::value(&payment) == price, E_INVALID_PAYMENT);

        // Calculate fee (10%)
        let fee_amount = (price * MARKETPLACE_FEE_BPS) / 10000;

        // Split payment
        let fee_coin = coin::split(&mut payment, fee_amount, ctx);
        let seller_coin = payment; // Remaining goes to seller

        // Send fee to pool
        pool::add_marketplace_fee(pool, fee_coin);

        // Send payment to seller
        transfer::public_transfer(seller_coin, seller);

        // Transfer NFT to buyer
        nft::transfer_nft(nft, tx_context::sender(ctx));

        // Update stats
        marketplace.total_sales = marketplace.total_sales + 1;
        marketplace.total_volume = marketplace.total_volume + price;

        // Delete listing ID
        object::delete(id);
    }

    /// Cancel listing (only seller can cancel)
    public entry fun cancel_listing(
        marketplace: &mut Marketplace,
        listing_id: ID,
        ctx: &TxContext
    ) {
        assert!(table::contains(&marketplace.listings, listing_id), E_LISTING_NOT_FOUND);
        
        let Listing { id, nft_id: _, seller, price: _, nft } = table::remove(&mut marketplace.listings, listing_id);
        
        // Verify caller is seller
        assert!(tx_context::sender(ctx) == seller, E_NOT_SELLER);

        // Return NFT to seller
        nft::transfer_nft(nft, seller);

        // Delete listing ID
        object::delete(id);
    }

    /// View functions
    public fun get_listing_price(marketplace: &Marketplace, listing_id: ID): u64 {
        let listing = table::borrow(&marketplace.listings, listing_id);
        listing.price
    }

    public fun get_listing_seller(marketplace: &Marketplace, listing_id: ID): address {
        let listing = table::borrow(&marketplace.listings, listing_id);
        listing.seller
    }

    public fun get_total_sales(marketplace: &Marketplace): u64 {
        marketplace.total_sales
    }

    public fun get_total_volume(marketplace: &Marketplace): u64 {
        marketplace.total_volume
    }

    public fun listing_exists(marketplace: &Marketplace, listing_id: ID): bool {
        table::contains(&marketplace.listings, listing_id)
    }
}