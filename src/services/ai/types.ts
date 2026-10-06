import type {AIFinding} from '../../types';
export interface AIService{provider:string;label:string;analyze(imageId:string,equipment:string,facility:string):Promise<AIFinding>}
