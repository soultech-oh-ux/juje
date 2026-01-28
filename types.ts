
export interface PromptItem {
  id: number;
  text: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  prompts: PromptItem[];
}
