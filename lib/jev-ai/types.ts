/**
 * Types for the Jev AI decision API (https://jev-ai.pro).
 *
 * Confirmed against the integration contract supplied for this project:
 *  - POST /api/v1/systemone request shape, and the "noul" answer field.
 *  - GET /api/v1/models exists and requires auth.
 *  - Error status codes 401/402/422/429/502/504.
 *
 * NOT confirmed (jev-ai.pro/docs was unreachable from this environment —
 * network egress to that domain is blocked — so these are best-effort
 * inferences, not verified against the real API):
 *  - The exact response field names for "choice" and "score" answers.
 *  - The exact shape of the "usage" object.
 *  - The exact field jev-ai.pro uses to mark a model "connected" in
 *    GET /api/v1/models.
 *
 * Run `npm run jev:live-check` once JEV_AI_API_KEY is configured and diff
 * the real response against these types — adjust here if they differ.
 */

export type JevModel = "jev-latest" | "laya-english" | "laya-multilingual" | (string & {});

export type JevQuestionType = "noul" | "choice" | "score";

export interface JevQuestionSpec {
  type: JevQuestionType;
  instructions: string;
  /**
   * Inferred, unconfirmed: candidate options for a "choice" question.
   * Verify the real field name against https://jev-ai.pro/docs.
   */
  choices?: string[];
}

export type JevQuestions = Record<string, JevQuestionSpec>;

export interface JevSystemOneRequest {
  model: JevModel;
  state: string;
  questions: JevQuestions;
}

export interface JevAnswer {
  /** Confirmed: probability 0-1 that a "noul" question is true. */
  noul?: number;
  /** Inferred, unconfirmed: the selected option for a "choice" question. */
  choice?: string;
  /** Inferred, unconfirmed: a numeric rating for a "score" question. */
  score?: number;
  [key: string]: unknown;
}

/** Inferred, unconfirmed shape — jev-ai.pro/docs was unreachable. */
export interface JevUsage {
  [key: string]: unknown;
}

export interface JevSystemOneResponse {
  answers: Record<string, JevAnswer>;
  usage?: JevUsage;
  [key: string]: unknown;
}

export interface JevModelInfo {
  id?: string;
  name?: string;
  /** Inferred, unconfirmed: verify against a real response. */
  connected?: boolean;
  /** Inferred, unconfirmed: verify against a real response. */
  status?: string;
  [key: string]: unknown;
}

export interface JevModelsResponse {
  models: JevModelInfo[];
  [key: string]: unknown;
}
