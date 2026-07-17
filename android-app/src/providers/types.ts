import { ImageAsset } from '../types';

export interface AnalyzeParams {
  apiKey: string;
  image: ImageAsset;
  referenceImage?: ImageAsset;
}

export interface VisionProvider {
  analyzeImage(params: AnalyzeParams): Promise<string>;
}

export class ProviderRequestError extends Error {}
