interface Args {
    onBackPress: () => boolean;
    isDisabled: boolean;
}
interface UseBackPressSubscription {
    handleAttached: () => void;
    handleDetached: () => void;
    createSubscription: () => void;
    clearSubscription: () => void;
}
/**
 * This hook is an abstraction for keeping back press subscription
 * logic in one place.
 */
export declare function useBackPressSubscription({ onBackPress, isDisabled, }: Args): UseBackPressSubscription;
export {};
