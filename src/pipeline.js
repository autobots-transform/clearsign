export const PIPELINE = {
  components: [
    {
      id: 'parse_1',
      provider: 'parse',
      config: {},
      input: [
        { lane: 'tags', from: 'dropper_1' },
        { lane: 'tags', from: 'webhook_1' },
      ],
    },
    {
      id: 'response_text_1',
      provider: 'response_text',
      config: { laneName: 'text' },
    },
    {
      id: 'dropper_1',
      provider: 'dropper',
      config: { hideForm: true, mode: 'Source', parameters: {}, type: 'dropper' },
    },
    {
      id: 'llm_gemini_1',
      provider: 'llm_gemini',
      config: {
        profile: 'gemini-3_1-pro-preview',
        '1-pro-preview': { apikey: import.meta.env.VITE_GEMINI_API_KEY },
        parameters: { google: {} },
      },
      input: [{ lane: 'questions', from: 'prompt_1' }],
    },
    {
      id: 'question_1',
      provider: 'question',
      config: { type: 'question' },
      input: [{ lane: 'text', from: 'parse_1' }],
    },
    {
      id: 'response_answers_1',
      provider: 'response_answers',
      config: { laneName: 'answers' },
      input: [{ lane: 'answers', from: 'llm_gemini_1' }],
    },
    {
      id: 'prompt_1',
      provider: 'prompt',
      config: {
        instructions: [
          'You are a senior corporate attorney. Analyze the contract text provided and return ONLY valid JSON with risk_score, high_risk_clauses with confidence scores and exact quotes, missing_protections, plain_english_summary, and top_3_actions.',
        ],
        parameters: { google: {} },
      },
      input: [{ lane: 'questions', from: 'question_1' }],
    },
    {
      id: 'webhook_1',
      provider: 'webhook',
      config: { hideForm: true, mode: 'Source', parameters: {}, type: 'webhook' },
    },
  ],
  source: 'webhook_1',
  project_id: 'ee5f7aa4-10bf-4cd2-ac85-2f4ac5889a79',
  viewport: { x: 0, y: 0, zoom: 1 },
  version: 1,
}
