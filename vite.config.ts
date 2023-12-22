import { defineConfig, ServerOptions, UserConfig } from "vite"

const server: ServerOptions = {
  open: "index.html"
}

const config: UserConfig = { server }

export default defineConfig(config)