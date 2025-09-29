export interface Input {
    since: string | undefined,
    till: string | undefined,
}

export interface EventURLOptions {
  page?: number;
  since?: string;
  till?: string;
  limit?: number;
  cityId?: string;
  categoryId?: string;
}

