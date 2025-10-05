import { RpsSymbol } from '../types';
export declare function sha256(s: string): Promise<string>;
export declare function judge(a: RpsSymbol, b: RpsSymbol): 0 | 1 | -1;
