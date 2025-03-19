(impl-trait .trait-ownable.ownable-trait)
(use-trait ft-trait .trait-sip-010.sip-010-trait)


(define-constant ERR-SAME-TOKENS u2001)      ;; Error code for when token-x and token-y are the same
(define-constant ERR-INVALID-FACTOR u2002)    ;; Error code for when token-x and token-y are the same



(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-INVALID-LIQUIDITY (err u2003))
(define-constant ERR-POOL-ALREADY-EXISTS (err u2000))
(define-constant ERR-PERCENT-GREATER-THAN-ONE (err u5000))
(define-constant ERR-EXCEEDS-MAX-SLIPPAGE (err u2020))
(define-constant ERR-PAUSED (err u1001))
(define-constant ERR-SWITCH-THRESHOLD-BIGGER-THAN-ONE (err u7005))
(define-constant ERR-INVALID-POOL u1001)
(define-constant ERR-MAX-IN-RATIO (err u4001))
(define-constant ERR-MAX-OUT-RATIO (err u4002))
(define-constant transfer-x-failed-err (err u72))
(define-constant transfer-y-failed-err (err u73))

(define-data-var MAX-IN-RATIO uint (* u5 (pow u10 u6))) ;; 5%
(define-data-var MAX-OUT-RATIO uint (* u5 (pow u10 u6))) ;; 5%

(define-data-var contract-owner principal tx-sender)
(define-data-var paused bool false)
(define-data-var switch-threshold uint u80000000)

(define-read-only (get-switch-threshold)
    (var-get switch-threshold)
)

(define-public (set-switch-threshold (new-threshold uint))
    (begin 
        (try! (check-is-owner))
        (asserts! (<= new-threshold ONE_8) ERR-SWITCH-THRESHOLD-BIGGER-THAN-ONE)
        (ok (var-set switch-threshold new-threshold))
    )
)

(define-read-only (is-paused)
    (var-get paused)
)

(define-public (pause (new-paused bool))
    (begin 
        (try! (check-is-owner))
        (ok (var-set paused new-paused))
    )
)

(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

(define-public (set-contract-owner (owner principal))
  (begin
   
    (try! (check-is-owner))
    (asserts! (is-eq tx-sender owner) ERR-NOT-AUTHORIZED)
    (ok (var-set contract-owner owner))
  )
)

(define-private (check-is-owner)
    (ok (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED))
)

(define-map pools-data-map
  {
    token-x: principal,
    token-y: principal,
    factor: uint
  }
  {
  
    total-supply: uint,
    balance-x: uint,
    balance-y: uint,
    pool-owner: principal,    
    fee-rate-x: uint,
    fee-rate-y: uint,  
    threshold-x: uint,;;A threshold value for swaps involving token-x
    threshold-y: uint
  }
)


;;get-pool-exists, Likely a helper function (defined elsewhere in the contract) that checks whether a pool with the given token-x, 
;;token-y, and factor exists in the pools-data-map
(define-read-only (get-pool-details (token-x principal) (token-y principal) (factor uint))
    (match (get-pool-exists token-x token-y factor)
        pool (ok pool) ;; If the pool exists, return it wrapped in `ok`
        (err ERR-INVALID-POOL) ;; Otherwise, return an error
    )
)

(define-read-only (get-pool-exists (token-x principal) (token-y principal) (factor uint))
    (map-get? pools-data-map { token-x: token-x, token-y: token-y, factor: factor }) 
)

(define-read-only (get-balances (token-x principal) (token-y principal) (factor uint))
  (let
    (
      (pool (try! (get-pool-details token-x token-y factor)))
    )
    (ok {balance-x: (get balance-x pool), balance-y: (get balance-y pool)})
  )
)



;; @desc get-price, of token-x in terms of token-y
;; @returns (response uint uint)
(define-read-only (get-price (token-x principal) (token-y principal) (factor uint))
    (let
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (ok (get-price-internal (get balance-x pool) (get balance-y pool) factor))
    )
)
;;create-pool Works as a Pair Creation and Liquidity Initialization
;;The function ensures that no existing pool already exists for the given token pair and factor
(define-public (create-pool (token-x-trait <ft-trait>) (token-y-trait <ft-trait>) (factor uint) (pool-owner principal) (dx uint) (dy uint)) 
   (begin

     ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) 
     (asserts! (is-eq factor u0) (err u66))
    ;;  (asserts! (>= factor u0) (err u66))
    (let
        (
          
            (token-x (contract-of token-x-trait))
            (token-y (contract-of token-y-trait))
            ;; (valid-factor (is-ok ))
            (pool-data {
               
                total-supply: u0,
                balance-x: u0,
                balance-y: u0,
                pool-owner: pool-owner,
                fee-rate-x: u0,
                fee-rate-y: u0,
                threshold-x: u0,
                threshold-y: u0
            })
        )
        (asserts! (not (is-paused)) ERR-PAUSED)
        (asserts! (is-ok (check-is-owner)) ERR-NOT-AUTHORIZED)
        (asserts!
            (and
                (is-none (map-get? pools-data-map { token-x: token-x, token-y: token-y, factor: factor }))
                (is-none (map-get? pools-data-map { token-x: token-y, token-y: token-x, factor: factor }))
            )
            ERR-POOL-ALREADY-EXISTS
        )             
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } pool-data)
        

        (try! (add-to-position token-x-trait token-y-trait factor dx (some dy)))
        (print { object: "pool", action: "created", data: pool-data })
        (ok true)
    )

   )
)

(define-public (add-to-position (token-x-trait <ft-trait>) (token-y-trait <ft-trait>) (factor uint) (dx uint) (max-dy (optional uint)))
    (begin 
     ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) 
     (asserts! (is-eq factor u0) (err u66))
    ;;  (asserts! (>= factor u0) (err u66))
    (let
        (
            (token-x (contract-of token-x-trait))
            (token-y (contract-of token-y-trait))
            (pool (try! (get-pool-details token-x token-y factor)))
            (balance-x (get balance-x pool))
            (balance-y (get balance-y pool))
            (total-supply (get total-supply pool))
            (add-data (try! (get-token-given-position token-x token-y factor dx max-dy)))
            (new-supply (get token add-data))
            (dy (get dy add-data))
            (pool-updated (merge pool {
                total-supply: (+ new-supply total-supply),
                balance-x: (+ balance-x dx),
                balance-y: (+ balance-y dy)
            }))
            (sender tx-sender)
        )
        (asserts! (not (is-paused)) ERR-PAUSED)
        (asserts! (is-ok (check-is-owner)) ERR-NOT-AUTHORIZED)
        (asserts! (and (> dx u0) (> dy u0)) ERR-INVALID-LIQUIDITY)
        (asserts! (>= (default-to u340282366920938463463374607431768211455 max-dy) dy) ERR-EXCEEDS-MAX-SLIPPAGE)
        (asserts! (is-ok (contract-call? token-x-trait transfer dx sender (as-contract tx-sender) none)) transfer-x-failed-err)
        (asserts! (is-ok (contract-call? token-y-trait transfer dy sender (as-contract tx-sender) none)) transfer-y-failed-err)
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } pool-updated)
        
        (print { object: "pool", action: "liquidity-added", data: pool-updated })
        (ok {supply: new-supply, dx: dx, dy: dy})
    )
    )
)

(define-public (reduce-position (token-x-trait <ft-trait>) (token-y-trait <ft-trait>) (factor uint) (percent uint))
    (begin 
     ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) 
     (asserts! (is-eq factor u0) (err u66))
    ;;  (asserts! (>= factor u0) (err u66))
    (let
        (
            (token-x (contract-of token-x-trait))
            (token-y (contract-of token-y-trait))
            (pool (try! (get-pool-details token-x token-y factor)))
            (balance-x (get balance-x pool))
            (balance-y (get balance-y pool))
            (total-shares (get total-supply pool)) ;; Use the total supply directly as the total shares
            (shares (if (is-eq percent ONE_8) total-shares (mul-down total-shares percent)))
            (total-supply (get total-supply pool))
            (reduce-data (try! (get-position-given-burn token-x token-y factor shares)))
            (dx (get dx reduce-data))
            (dy (get dy reduce-data))
            (pool-updated (merge pool {
                total-supply: (if (<= total-supply shares) u0 (- total-supply shares)),
                balance-x: (if (<= balance-x dx) u0 (- balance-x dx)),
                balance-y: (if (<= balance-y dy) u0 (- balance-y dy))
                })
            )
            (sender tx-sender)
        )  
        (asserts! (not (is-paused)) ERR-PAUSED)       
        (asserts! (<= percent ONE_8) ERR-PERCENT-GREATER-THAN-ONE)
        (asserts! (is-ok (check-is-owner)) ERR-NOT-AUTHORIZED)
        ;; (try! (contract-call? token-x transfer dx sender))
        ;; (try! (contract-call? token-y transfer dy sender))
        (asserts! (as-contract (is-ok (contract-call? token-x-trait transfer dx sender tx-sender none))) transfer-x-failed-err)
        ;;    (asserts! (as-contract (is-ok (contract-call? token-y-trait transfer dy sender tx-sender none))) transfer-y-failed-err)

        ;;  (as-contract (try! (contract-call? (as-contract sender) transfer token-x-trait dx token-y-trait dy sender)))
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } pool-updated)
        
        (print { object: "pool", action: "liquidity-removed", data: pool-updated })
        (ok {dx: dx, dy: dy})
    )
    )
)


(define-public (swap-x-for-y (token-x-trait <ft-trait>) (token-y-trait <ft-trait>) (factor uint) (dx uint) (min-dy (optional uint)))
   (begin 
    ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) 
     (asserts! (> dx u0) (err u101)) ;; Error u101: x must be greater than 0
     (asserts! (is-eq factor u0) (err u66))
    ;;  (asserts! (>= factor u0) (err u66))
    (let
        (
            (token-x (contract-of token-x-trait))
            (token-y (contract-of token-y-trait))
            (pool (try! (get-pool-details token-x token-y factor)))
            (balance-x (get balance-x pool))
            (balance-y (get balance-y pool))
            (fee (mul-up dx (get fee-rate-x pool)))
            (dx-net-fees (if (<= dx fee) u0 (- dx fee)))
            ;; (fee-rebate (mul-down fee (get fee-rebate pool)))
            (dy (try! (get-y-given-x token-x token-y factor dx-net-fees)))                
            (pool-updated (merge pool {
                balance-x: (+ balance-x dx-net-fees ),
                balance-y: (if (<= balance-y dy) u0 (- balance-y dy)),
                
                })
            )
            (sender tx-sender)             
        )
        (asserts! (not (is-paused)) ERR-PAUSED)
        
        (asserts! (> dx u0) ERR-INVALID-LIQUIDITY)
        (asserts! (<= (div-down dy dx-net-fees) (get-price-internal balance-x balance-y factor)) ERR-INVALID-LIQUIDITY)
        (asserts! (<= (default-to u0 min-dy) dy) ERR-EXCEEDS-MAX-SLIPPAGE)
       (asserts! (is-ok (contract-call? token-x-trait transfer dx sender (as-contract tx-sender) none)) transfer-x-failed-err)
        
        (asserts! (and (> dy u0) (as-contract (is-ok (contract-call? token-y-trait transfer dy (as-contract tx-sender) sender none)))) transfer-y-failed-err)
        
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } pool-updated)
        (print { object: "pool", action: "swap-x-for-y", data: pool-updated })
        (ok {dx: dx-net-fees, dy: dy})
    )
   )
)

(define-public (swap-y-for-x (token-x-trait <ft-trait>) (token-y-trait <ft-trait>) (factor uint) (dy uint) (min-dx (optional uint)))
    (begin 
     ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x-trait token-y-trait)) (err u102)) 
     (asserts! (is-eq factor u0) (err u66))
     (asserts! (> dy u0) (err u101))
    ;;  (asserts! (>= factor u0) (err u66))
    
    (let
        (
            (token-x (contract-of token-x-trait))
            (token-y (contract-of token-y-trait))
            (pool (try! (get-pool-details token-x token-y factor)))
            (balance-x (get balance-x pool))
            (balance-y (get balance-y pool))
            (fee (mul-up dy (get fee-rate-y pool)))
            ;;dy-net-fees: Net amount of token-y after deducting fees.
            (dy-net-fees (if (<= dy fee) u0 (- dy fee)))
            ;; (fee-rebate (mul-down fee (get fee-rebate pool)))
            (dx (try! (get-x-given-y token-x token-y factor dy-net-fees)))
            (pool-updated (merge pool {
                balance-x: (if (<= balance-x dx) u0 (- balance-x dx)),
                balance-y: (+ balance-y dy-net-fees ),
                
                })
            )
            (sender tx-sender)
        )
        (asserts! (not (is-paused)) ERR-PAUSED)
     
        (asserts! (> dy u0) ERR-INVALID-LIQUIDITY)        
        (asserts! (>= (div-down dy-net-fees dx) (get-price-internal balance-x balance-y factor)) ERR-INVALID-LIQUIDITY)
        ;;The default-to function in Clarity is used to provide a default value if an optional value is none
        (asserts! (<= (default-to u0 min-dx) dx) ERR-EXCEEDS-MAX-SLIPPAGE) 
        ;;Transfer dy (amount of token-y provided) from the sender to the vault.       
        (asserts! (is-ok (contract-call? token-y-trait transfer dy sender (as-contract tx-sender) none)) transfer-y-failed-err)
        ;;from the vault to the sender.
        
        (asserts! (and (> dx u0) (as-contract (is-ok (contract-call? token-x-trait transfer dx (as-contract tx-sender) sender none)))) transfer-x-failed-err)        
        
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } pool-updated)
        (print { object: "pool", action: "swap-y-for-x", data: pool-updated })
        (ok {dx: dx, dy: dy-net-fees})
    )
    )
)
;;A unique factor associated with the pool, which differentiates pools with the same tokens.
(define-read-only (get-threshold-x (token-x principal) (token-y principal) (factor uint))
    (ok (get threshold-x (try! (get-pool-details token-x token-y factor))))
)
;;If market conditions or token liquidity levels change, the pool owner can update the threshold without redeploying the contract
;;Sets the threshold-x to 500 for the pool involving tokens X and Y with factor 1.
;; Ensures the pool maintains at least 500 units of token X
(define-public (set-threshold-x (token-x principal) (token-y principal) (factor uint) (new-threshold uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (or (is-eq tx-sender (get pool-owner pool)) (is-ok (check-is-owner))) ERR-NOT-AUTHORIZED)
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } (merge pool { threshold-x: new-threshold }))
        (ok true)
    )
)

(define-read-only (get-threshold-y (token-x principal) (token-y principal) (factor uint))
    (ok (get threshold-y (try! (get-pool-details token-x token-y factor))))
)

(define-public (set-threshold-y (token-x principal) (token-y principal) (factor uint) (new-threshold uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (or (is-eq tx-sender (get pool-owner pool)) (is-ok (check-is-owner))) ERR-NOT-AUTHORIZED)
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } (merge pool { threshold-y: new-threshold }))
        (ok true)
    )
)

(define-read-only (get-fee-rate-x (token-x principal) (token-y principal) (factor uint))
    (ok (get fee-rate-x (try! (get-pool-details token-x token-y factor))))
)

(define-read-only (get-fee-rate-y (token-x principal) (token-y principal) (factor uint))
    (ok (get fee-rate-y (try! (get-pool-details token-x token-y factor))))
)

(define-public (set-fee-rate-x (token-x principal) (token-y principal) (factor uint) (fee-rate-x uint))
    (let 
        (        
            ;;try!: Ensures that if the pool does not exist or an error occurs, the function stops execution and returns an error.
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (or (is-eq tx-sender (get pool-owner pool)) (is-ok (check-is-owner))) ERR-NOT-AUTHORIZED)
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } (merge pool { fee-rate-x: fee-rate-x }))
        (ok true)     
    )
)

(define-public (set-fee-rate-y (token-x principal) (token-y principal) (factor uint) (fee-rate-y uint))
    (let 
        (    
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (or (is-eq tx-sender (get pool-owner pool)) (is-ok (check-is-owner))) ERR-NOT-AUTHORIZED)
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } (merge pool { fee-rate-y: fee-rate-y }))
        (ok true)     
    )
)

(define-read-only (get-pool-owner (token-x principal) (token-y principal) (factor uint))
    (ok (get pool-owner (try! (get-pool-details token-x token-y factor))))
)
;;only contract owner can call this function
(define-public (set-pool-owner (token-x principal) (token-y principal) (factor uint) (pool-owner principal))
(begin 
 ;; Ensure `token-x` and `token-y` are not the same
     (asserts! (not (is-eq token-x token-y)) (err u102)) 
     (asserts! (is-eq factor u0) (err u66))
    ;;  (asserts! (>= factor u0) (err u66))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (try! (check-is-owner))
        (map-set pools-data-map { token-x: token-x, token-y: token-y, factor: factor } (merge pool { pool-owner: pool-owner }))
        (ok true)     
    )
)
)
;;The pool has enough tokens left after the swap - The swap respects certain safe ratios.
(define-read-only (get-y-given-x (token-x principal) (token-y principal) (factor uint) (dx uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
            (threshold (get threshold-x pool))
            ;;calculated amount of Token Y the user will receive for dx units of Token X
            ;;If the input dx (amount of Token X) is greater than or equal to the threshold,
            ;; a direct calculation is performed using the helper function get-y-given-x-internal.
            (dy (if (>= dx threshold)
                (get-y-given-x-internal (get balance-x pool) (get balance-y pool) factor dx)
                (div-down (mul-down dx (get-y-given-x-internal (get balance-x pool) (get balance-y pool) factor threshold)) threshold)
            ))
        )
        ;;Total Token X in the pool mul by Maximum allowed ratio for input tokens - Prevents draining too much Token X from the pool
        (asserts! (< dx (mul-down (get balance-x pool) (var-get MAX-IN-RATIO))) ERR-MAX-IN-RATIO)     
        (asserts! (< dy (mul-down (get balance-y pool) (var-get MAX-OUT-RATIO))) ERR-MAX-OUT-RATIO)
        (ok dy)
    )
)

(define-read-only (get-x-given-y (token-x principal) (token-y principal) (factor uint) (dy uint)) 
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
            (threshold (get threshold-y pool))
            (dx (if (>= dy threshold)
                (get-x-given-y-internal (get balance-x pool) (get balance-y pool) factor dy)
                (div-down (mul-down dy (get-x-given-y-internal (get balance-x pool) (get balance-y pool) factor threshold)) threshold)         
            ))
        )        
        (asserts! (< dy (mul-down (get balance-y pool) (var-get MAX-IN-RATIO))) ERR-MAX-IN-RATIO)
        (asserts! (< dx (mul-down (get balance-x pool) (var-get MAX-OUT-RATIO))) ERR-MAX-OUT-RATIO)
        (ok dx)
    )
)

(define-read-only (get-y-in-given-x-out (token-x principal) (token-y principal) (factor uint) (dx uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
            (threshold (get threshold-x pool))
            (dy (if (>= dx threshold)
                (get-y-in-given-x-out-internal (get balance-x pool) (get balance-y pool) factor dx)
                (div-down (mul-down dx (get-y-in-given-x-out-internal (get balance-x pool) (get balance-y pool) factor threshold)) threshold)
            ))
        )
        (asserts! (< dy (mul-down (get balance-y pool) (var-get MAX-IN-RATIO))) ERR-MAX-IN-RATIO)
        (asserts! (< dx (mul-down (get balance-x pool) (var-get MAX-OUT-RATIO))) ERR-MAX-OUT-RATIO)
        (ok dy)
    )
)

(define-read-only (get-x-in-given-y-out (token-x principal) (token-y principal) (factor uint) (dy uint)) 
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
            (threshold (get threshold-y pool))
            (dx (if (>= dy threshold)
            ;;When dy is greater than or equal to the threshold, the function uses the helper function get-x-in-given-y-out-internal
            ;; to calculate the amount of Token X (dx) required for the given amount of Token Y (dy).
                (get-x-in-given-y-out-internal (get balance-x pool) (get balance-y pool) factor dy)
                (div-down (mul-down dy (get-x-in-given-y-out-internal (get balance-x pool) (get balance-y pool) factor threshold)) threshold)
            ))
        )
        (asserts! (< dx (mul-down (get balance-x pool) (var-get MAX-IN-RATIO))) ERR-MAX-IN-RATIO)     
        (asserts! (< dy (mul-down (get balance-y pool) (var-get MAX-OUT-RATIO))) ERR-MAX-OUT-RATIO)
        (ok dx)
    )
)
;;Suppose a user wants to swap Token X for Token Y at a price of 1 Token X = 100 Token Y. The contract will use this function 
;;to calculate how much Token X (dx) is required to achieve this price based on the current liquidity in the pool. If the pool's 
;;current price is different from the target price, it may return an error 
(define-read-only (get-x-given-price (token-x principal) (token-y principal) (factor uint) (price uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (< price (get-price-internal (get balance-x pool) (get balance-y pool) factor)) ERR-NO-LIQUIDITY) 
        (ok (get-x-given-price-internal (get balance-x pool) (get balance-y pool) factor price))
    )
)

(define-read-only (get-y-given-price (token-x principal) (token-y principal) (factor uint) (price uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (> price (get-price-internal (get balance-x pool) (get balance-y pool) factor)) ERR-NO-LIQUIDITY)
        (ok (get-y-given-price-internal (get balance-x pool) (get balance-y pool) factor price))
    )
)
;;The function get-token-given-position is used to calculate how much of a specific token (Token Y) a user can receive in exchange
;; for providing a certain amount of Token X (denoted as dx) in a liquidity pool.
(define-read-only (get-token-given-position (token-x principal) (token-y principal) (factor uint) (dx uint) (max-dy (optional uint)))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
            ;;it checks if the max-dy value is missing. If max-dy is provided, it will use the provided value.
            ;; If max-dy is not provided (i.e. its missing) it will use the default value.
            ;;If max-dy is missing it defaults to 2^128 minus 1
            (dy (default-to u340282366920938463463374607431768211455 max-dy))
        )
        (asserts! (and (> dx u0) (> dy u0))  ERR-NO-LIQUIDITY)
        (ok (get-token-given-position-internal (get balance-x pool) (get balance-y pool) factor (get total-supply pool) dx dy))
    )
)


(define-read-only (get-position-given-burn (token-x principal) (token-y principal) (factor uint) (token uint))
    (let 
        (
            (pool (try! (get-pool-details token-x token-y factor)))
        )
        (asserts! (> (get total-supply pool) u0) ERR-NO-LIQUIDITY)
        (ok (get-position-given-burn-internal (get balance-x pool) (get balance-y pool) factor (get total-supply pool) token))
    )
)




(define-constant ERR-NO-LIQUIDITY (err u2002))

;; @desc invariant = b_x ^ (1 - t) + b_y ^ (1 - t), or
;; @desc invariant = (1 - t) * (b_x + b_y) + t * b_x * b_y
(define-read-only (get-invariant (balance-x uint) (balance-y uint) (t uint))
    (if (>= t (var-get switch-threshold))
        (+ (mul-down (- ONE_8 t) (+ balance-x balance-y)) (mul-down t (mul-down balance-x balance-y)))
        (+ (pow-down balance-x (- ONE_8 t)) (pow-down balance-y (- ONE_8 t)))
    )
)

;; @desc p = (b_y / b_x) ^ t, or
;; @desc p = ((1 - t) + t * b_y) / ((1 - t) + t * b_x)
;;computes a price based on the reserves of two tokens
;;switches between two pricing mechanisms based on whether the factor is above or below a threshold 
(define-private (get-price-internal (balance-x uint) (balance-y uint) (factor uint))
    (if (>= factor (var-get switch-threshold))
        (div-down (+ (- ONE_8 factor) (mul-down factor balance-y)) (+ (- ONE_8 factor) (mul-down factor balance-x)))
        (pow-down (div-down balance-y balance-x) factor)
    )
)

;; @desc d_y = b_y - (b_x ^ (1 - t) + b_y ^ (1 - t) - (b_x + d_x) ^ (1 - t)) ^ (1 / (1 - t)), or
;; @desc d_y = ((1 - t) * d_x + t * d_x * b_y) / ((1 - t) + t * (b_x + d_x))
;;dynamic factor (t).
(define-private (get-y-given-x-internal (balance-x uint) (balance-y uint) (t uint) (dx uint))
    (if (>= t (var-get switch-threshold))
    (let
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
        )        
        (div-down (+ (mul-down t-comp dx) (mul-down t (mul-down dx balance-y))) (+ t-comp (mul-down t (+ balance-x dx))))
    )
    (let
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-up ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (x-pow (pow-up balance-x t-comp))
            (y-pow (pow-up balance-y t-comp))
            (x-dx-pow (pow-down (+ balance-x dx) t-comp))
            (add-term (+ x-pow y-pow))
            (term (if (<= add-term x-dx-pow) u0 (- add-term x-dx-pow)))
            (final-term (pow-up term t-comp-num))
        )        
        (if (<= balance-y final-term) u0 (- balance-y final-term))
    )  
    )      
)

;; @desc d_x = b_x - (b_x ^ (1 - t) + b_y ^ (1 - t) - (b_y + d_y) ^ (1 - t)) ^ (1 / (1 - t)), or
;; @desc d_x = ((1 - t) * d_y + t * d_y * b_x) / ((1 - t) + t * (b_y + d_y))
;; This function calculates how much Token X you get given a certain amount of Token Y
(define-private (get-x-given-y-internal (balance-x uint) (balance-y uint) (t uint) (dy uint))
    (if (>= t (var-get switch-threshold))
    (let
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
        )        
        (div-down (+ (mul-down t-comp dy) (mul-down t (mul-down dy balance-x))) (+ t-comp (mul-down t (+ balance-y dy))))
    )  
    (let 
        (          
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-up ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (x-pow (pow-up balance-x t-comp))
            (y-pow (pow-up balance-y t-comp))
            (y-dy-pow (pow-down (+ balance-y dy) t-comp))
            (add-term (+ x-pow y-pow))
            (term (if (<= add-term y-dy-pow) u0 (- add-term y-dy-pow)))
            (final-term (pow-up term t-comp-num))
        )
        (if (<= balance-x final-term) u0 (- balance-x final-term))
    )
    )    
)

;; @desc d_y = (b_x ^ (1 - t) + b_y ^ (1 - t) - (b_x - d_x) ^ (1 - t)) ^ (1 / (1 - t)) - b_y, or
;; @desc d_y = ((1 - t) * d_x + t * d_x * b_y) / ((1 - t) + t * (b_x - d_x))
(define-private (get-y-in-given-x-out-internal (balance-x uint) (balance-y uint) (t uint) (dx uint))    
    (if (>= t (var-get switch-threshold))
    (let 
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
        )
        (div-down (+ (mul-down t-comp dx) (mul-down t (mul-down dx balance-y))) (+ t-comp (mul-down t (- balance-x dx))))
    )
    (let 
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-down ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (x-pow (pow-down balance-x t-comp))
            (y-pow (pow-down balance-y t-comp))
            (x-dx-pow (pow-up (if (<= balance-x dx) u0 (- balance-x dx)) t-comp))
            (add-term (+ x-pow y-pow))
            (term (if (<= add-term x-dx-pow) u0 (- add-term x-dx-pow)))
            (final-term (pow-down term t-comp-num))
        )
        (if (<= final-term balance-y) u0 (- final-term balance-y))
    )
    )    
)

;; @desc d_x = (b_x ^ (1 - t) + b_y ^ (1 - t) - (b_y - d_y) ^ (1 - t)) ^ (1 / (1 - t)) - b_x, or
;; @desc d_x = ((1 - t) * d_y + t * d_y * b_x) / ((1 - t) + t * (b_y - d_y))
;;This function calculates how much Token X is required to receive a certain amount of Token Y
(define-private (get-x-in-given-y-out-internal (balance-x uint) (balance-y uint) (t uint) (dy uint))
    (if (>= t (var-get switch-threshold))
    (let 
        (          
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
        )
        (div-down (+ (mul-down t-comp dy) (mul-down t (mul-down dy balance-x))) (+ t-comp (mul-down t (- balance-y dy))))
    )
    (let 
        (          
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-down ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (x-pow (pow-down balance-x t-comp))
            (y-pow (pow-down balance-y t-comp))
            (y-dy-pow (pow-up (if (<= balance-y dy) u0 (- balance-y dy)) t-comp))
            (add-term (+ x-pow y-pow))
            (term (if (<= add-term y-dy-pow) u0 (- add-term y-dy-pow)))
            (final-term (pow-down term t-comp-num))
        )
        (if (<= final-term balance-x) u0 (- final-term balance-x))
    )
    )    
)

;; @desc d_x = b_x * ((1 + spot ^ ((1 - t) / t) / (1 + price ^ ((1 - t) / t)) ^ (1 / (1 - t)) - 1), or
;; @desc d_x = b_x * ((spot / price) ^ 0.5 - 1)
(define-private (get-x-given-price-internal (balance-x uint) (balance-y uint) (t uint) (price uint))
    (if (>= t (var-get switch-threshold))
    (let
        (
            (power (pow-down (div-down (get-price-internal balance-x balance-y t) price) u50000000))
        )
        (mul-down balance-x (if (<= power ONE_8) u0 (- power ONE_8)))
    ) 
    (let 
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-down ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (numer (+ ONE_8 (pow-down (get-price-internal balance-x balance-y t) (div-down t-comp t))))
            (denom (+ ONE_8 (pow-down price (div-down t-comp t))))
            (lead-term (pow-down (div-down numer denom) t-comp-num))
        )
        (if (<= lead-term ONE_8) u0 (mul-up balance-x (- lead-term ONE_8)))
    )
    )    
)

;; @desc d_y = b_y * (1 - (1 + spot ^ ((1 - t) / t) / (1 + price ^ ((1 - t) / t)) ^ (1 / (1 - t))), or
;; @desc d_y = b_y * ((price / spot) ^ 0.5 - 1)
(define-private (get-y-given-price-internal (balance-x uint) (balance-y uint) (t uint) (price uint))
    (if (>= t (var-get switch-threshold))
    (let
        (            
            (power (pow-down (div-down price (get-price-internal balance-x balance-y t)) u50000000))
        )
        (mul-down balance-y (if (<= power ONE_8) u0 (- power ONE_8)))
    )
    (let 
        (
            (t-comp (if (<= ONE_8 t) u0 (- ONE_8 t)))
            (t-comp-num-uncapped (div-down ONE_8 t-comp))
            (t-comp-num (if (< t-comp-num-uncapped MILD_EXPONENT_BOUND) t-comp-num-uncapped MILD_EXPONENT_BOUND))            
            (numer (+ ONE_8 (pow-down (get-price-internal balance-x balance-y t) (div-down t-comp t))))
            (denom (+ ONE_8 (pow-down price (div-down t-comp t))))
            (lead-term (pow-down (div-down numer denom) t-comp-num))
        )
        (if (<= ONE_8 lead-term) u0 (mul-up balance-y (- ONE_8 lead-term)))
    )
    )    
)
;; The amount of pool tokens (or liquidity provider tokens) the user would receive for adding dx of Token X to the pool
;;The amount of Token Y that the user would need to deposit for the amount dx of Token X being added
;;If the pool is empty (total-supply == u0) the function uses a different formula (get-invariant dx dy t) for the output
(define-private (get-token-given-position-internal (balance-x uint) (balance-y uint) (t uint) (total-supply uint) (dx uint) (dy uint))
    (if (is-eq total-supply u0)
        {token: (get-invariant dx dy t), dy: dy}
        {token: (div-down (mul-down total-supply dx) balance-x), dy: (div-down (mul-down balance-y dx) balance-x)}
    )
)

(define-private (get-position-given-mint-internal (balance-x uint) (balance-y uint) (t uint) (total-supply uint) (token uint))
    (let
        (
            (token-div-supply (div-down token total-supply))
        )                
        {dx: (mul-down balance-x token-div-supply), dy: (mul-down balance-y token-div-supply)}    
    )
)

(define-private (get-position-given-burn-internal (balance-x uint) (balance-y uint) (t uint) (total-supply uint) (token uint))
    (get-position-given-mint-internal balance-x balance-y t total-supply token)
)

(define-constant ONE_8 u100000000) ;; 8 decimal places
(define-constant MAX_POW_RELATIVE_ERROR u4) 

(define-private (mul-down (a uint) (b uint))
    (/ (* a b) ONE_8)
)

(define-private (mul-up (a uint) (b uint))
    (let
        (
            (product (* a b))
       )
        (if (is-eq product u0)
            u0
            (+ u1 (/ (- product u1) ONE_8))
       )
   )
)

(define-private (div-down (a uint) (b uint))
    (if (is-eq a u0)
        u0
        (/ (* a ONE_8) b)
   )
)

(define-private (div-up (a uint) (b uint))
    (if (is-eq a u0)
        u0
        (+ u1 (/ (- (* a ONE_8) u1) b))
    )
)

(define-private (pow-down (a uint) (b uint))    
    (let
        (
            (raw (unwrap-panic (pow-fixed a b)))
            (max-error (+ u1 (mul-up raw MAX_POW_RELATIVE_ERROR)))
        )
        (if (< raw max-error)
            u0
            (- raw max-error)
        )
    )
)

(define-private (pow-up (a uint) (b uint))
    (let
        (
            (raw (unwrap-panic (pow-fixed a b)))
            (max-error (+ u1 (mul-up raw MAX_POW_RELATIVE_ERROR)))
        )
        (+ raw max-error)
    )
)

(define-constant UNSIGNED_ONE_8 (pow 10 8))
(define-constant MAX_NATURAL_EXPONENT (* 69 UNSIGNED_ONE_8))
(define-constant MIN_NATURAL_EXPONENT (* -18 UNSIGNED_ONE_8))
(define-constant MILD_EXPONENT_BOUND (/ (pow u2 u126) (to-uint UNSIGNED_ONE_8)))
(define-constant x_a_list_no_deci (list {x_pre: 6400000000, a_pre: 62351490808116168829, use_deci: false} ))

(define-constant x_a_list (list 
{x_pre: 3200000000, a_pre: 78962960182680695161, use_deci: true} ;; x2 = 2^5, a2 = e^(x2)
{x_pre: 1600000000, a_pre: 888611052050787, use_deci: true} ;; x3 = 2^4, a3 = e^(x3)
{x_pre: 800000000, a_pre: 298095798704, use_deci: true} ;; x4 = 2^3, a4 = e^(x4)
{x_pre: 400000000, a_pre: 5459815003, use_deci: true} ;; x5 = 2^2, a5 = e^(x5)
{x_pre: 200000000, a_pre: 738905610, use_deci: true} ;; x6 = 2^1, a6 = e^(x6)
{x_pre: 100000000, a_pre: 271828183, use_deci: true} ;; x7 = 2^0, a7 = e^(x7)
{x_pre: 50000000, a_pre: 164872127, use_deci: true} ;; x8 = 2^-1, a8 = e^(x8)
{x_pre: 25000000, a_pre: 128402542, use_deci: true} ;; x9 = 2^-2, a9 = e^(x9)
{x_pre: 12500000, a_pre: 113314845, use_deci: true} ;; x10 = 2^-3, a10 = e^(x10)
{x_pre: 6250000, a_pre: 106449446, use_deci: true} ;; x11 = 2^-4, a11 = e^x(11)
))

(define-constant ERR-X-OUT-OF-BOUNDS (err u5009))
(define-constant ERR-Y-OUT-OF-BOUNDS (err u5010))
(define-constant ERR-PRODUCT-OUT-OF-BOUNDS (err u5011))
(define-constant ERR-INVALID-EXPONENT (err u5012))
(define-constant ERR-OUT-OF-BOUNDS (err u5013))

(define-private (ln-priv (a int))
  (let
    (
      (a_sum_no_deci (fold accumulate_division x_a_list_no_deci {a: a, sum: 0}))
      (a_sum (fold accumulate_division x_a_list {a: (get a a_sum_no_deci), sum: (get sum a_sum_no_deci)}))
      (out_a (get a a_sum))
      (out_sum (get sum a_sum))
      (z (/ (* (- out_a UNSIGNED_ONE_8) UNSIGNED_ONE_8) (+ out_a UNSIGNED_ONE_8)))
      (z_squared (/ (* z z) UNSIGNED_ONE_8))
      (div_list (list 3 5 7 9 11))
      (num_sum_zsq (fold rolling_sum_div div_list {num: z, seriesSum: z, z_squared: z_squared}))
      (seriesSum (get seriesSum num_sum_zsq))
    )
    (+ out_sum (* seriesSum 2))
  )
)

(define-private (accumulate_division (x_a_pre (tuple (x_pre int) (a_pre int) (use_deci bool))) (rolling_a_sum (tuple (a int) (sum int))))
  (let
    (
      (a_pre (get a_pre x_a_pre))
      (x_pre (get x_pre x_a_pre))
      (use_deci (get use_deci x_a_pre))
      (rolling_a (get a rolling_a_sum))
      (rolling_sum (get sum rolling_a_sum))
   )
    (if (>= rolling_a (if use_deci a_pre (* a_pre UNSIGNED_ONE_8)))
      {a: (/ (* rolling_a (if use_deci UNSIGNED_ONE_8 1)) a_pre), sum: (+ rolling_sum x_pre)}
      {a: rolling_a, sum: rolling_sum}
   )
 )
)

(define-private (rolling_sum_div (n int) (rolling (tuple (num int) (seriesSum int) (z_squared int))))
  (let
    (
      (rolling_num (get num rolling))
      (rolling_sum (get seriesSum rolling))
      (z_squared (get z_squared rolling))
      (next_num (/ (* rolling_num z_squared) UNSIGNED_ONE_8))
      (next_sum (+ rolling_sum (/ next_num n)))
   )
    {num: next_num, seriesSum: next_sum, z_squared: z_squared}
 )
)

(define-private (pow-priv (x uint) (y uint))
  (let
    (
      (x-int (to-int x))
      (y-int (to-int y))
      (lnx (ln-priv x-int))
      (logx-times-y (/ (* lnx y-int) UNSIGNED_ONE_8))
    )
    (asserts! (and (<= MIN_NATURAL_EXPONENT logx-times-y) (<= logx-times-y MAX_NATURAL_EXPONENT)) ERR-PRODUCT-OUT-OF-BOUNDS)
    (ok (to-uint (try! (exp-fixed logx-times-y))))
  )
)

(define-private (exp-pos (x int))
  (begin
    (asserts! (and (<= 0 x) (<= x MAX_NATURAL_EXPONENT)) ERR-INVALID-EXPONENT)
    (let
      (
        (x_product_no_deci (fold accumulate_product x_a_list_no_deci {x: x, product: 1}))
        (x_adj (get x x_product_no_deci))
        (firstAN (get product x_product_no_deci))
        (x_product (fold accumulate_product x_a_list {x: x_adj, product: UNSIGNED_ONE_8}))
        (product_out (get product x_product))
        (x_out (get x x_product))
        (seriesSum (+ UNSIGNED_ONE_8 x_out))
        (div_list (list 2 3 4 5 6 7 8 9 10 11 12))
        (term_sum_x (fold rolling_div_sum div_list {term: x_out, seriesSum: seriesSum, x: x_out}))
        (sum (get seriesSum term_sum_x))
     )
      (ok (* (/ (* product_out sum) UNSIGNED_ONE_8) firstAN))
   )
 )
)

(define-private (accumulate_product (x_a_pre (tuple (x_pre int) (a_pre int) (use_deci bool))) (rolling_x_p (tuple (x int) (product int))))
  (let
    (
      (x_pre (get x_pre x_a_pre))
      (a_pre (get a_pre x_a_pre))
      (use_deci (get use_deci x_a_pre))
      (rolling_x (get x rolling_x_p))
      (rolling_product (get product rolling_x_p))
   )
    (if (>= rolling_x x_pre)
      {x: (- rolling_x x_pre), product: (/ (* rolling_product a_pre) (if use_deci UNSIGNED_ONE_8 1))}
      {x: rolling_x, product: rolling_product}
   )
 )
)

(define-private (rolling_div_sum (n int) (rolling (tuple (term int) (seriesSum int) (x int))))
  (let
    (
      (rolling_term (get term rolling))
      (rolling_sum (get seriesSum rolling))
      (x (get x rolling))
      (next_term (/ (/ (* rolling_term x) UNSIGNED_ONE_8) n))
      (next_sum (+ rolling_sum next_term))
   )
    {term: next_term, seriesSum: next_sum, x: x}
 )
)

(define-private (pow-fixed (x uint) (y uint))
  (begin
    (asserts! (< x (pow u2 u127)) ERR-X-OUT-OF-BOUNDS)
    (asserts! (< y MILD_EXPONENT_BOUND) ERR-Y-OUT-OF-BOUNDS)
    (if (is-eq y u0) 
      (ok (to-uint UNSIGNED_ONE_8))
      (if (is-eq x u0) 
        (ok u0)
        (pow-priv x y)
      )
    )
  )
)

(define-private (exp-fixed (x int))
  (begin
    (asserts! (and (<= MIN_NATURAL_EXPONENT x) (<= x MAX_NATURAL_EXPONENT)) ERR-INVALID-EXPONENT)
    (if (< x 0)
      (ok (/ (* UNSIGNED_ONE_8 UNSIGNED_ONE_8) (try! (exp-pos (* -1 x)))))
      (exp-pos x)
    )
  )

)
