/**
 * Trust System for Directory Security
 * Prevents IDE3 from operating in untrusted directories
 */
/**
 * Check if current directory is trusted
 */
export declare function checkDirectoryTrust(): Promise<boolean>;
/**
 * List trusted directories
 */
export declare function listTrustedDirs(): Promise<string[]>;
/**
 * Remove trust for current directory
 */
export declare function untrustCurrentDir(): Promise<void>;
/**
 * Clear all trusted directories
 */
export declare function clearAllTrust(): Promise<void>;
