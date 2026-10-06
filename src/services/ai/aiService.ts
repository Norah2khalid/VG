import {mockAIService} from './mockAIService';import type {AIService} from './types';
// Add real providers (vision model, LLM, external API) here behind the same AIService interface.
const providers:Record<string,AIService>={mock:mockAIService};
export const aiService:AIService=providers[import.meta.env.VITE_AI_PROVIDER||'mock']??mockAIService;
