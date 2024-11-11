export const Constants = {
    // Player defaults
    NAME: "John",
    AGE_IN_DAYS: 8030, // starts at 22 years
    CASH_START: 3000,

    // Economic environment
    MIN_INFLATION: 5, // %
    MAX_INFLATION: 15, // %
    
    CREDIT_INTEREST_RATE: 5, // %
    CREDIT_MAX_RATE: 500,

    UBER_RIDES_PER_DAY: 2,
    ANNUAL_JOB_PAYMENT_INCREASE: 0.1, // 10%, for dynamism I think the value should be between inflation limits

    // Technical game settings
    STORAGE_PREFIX: "game_",
    DAY_LASTS: 500 // how mouch lasts a day (in ms)
};