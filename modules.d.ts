declare namespace NodeJS {
  export interface ProcessEnv {
    PHP_SERVER_PORT?: string
    DISCORD_BOT_TOKEN: string

    DEEPL_API_KEY?: string

    OPENAI_API_KEY?: string
    OPENAI_ORGANIZATION_ID?: string
  }
}