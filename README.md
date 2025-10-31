# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Architectural choices
In order to ensure a good level of maintainability and consistency, I have created a `constants.ts` file where I have stored all those values that are frequently queries and whose data is not likely to change from one feature implementation to the next one. Values such as primary colours and error messages are stored in that file.


## Reflections
### If I had more time, what would I extend or improve?
Quite a few things!:
- Definitely I would add internationalization with i18n. 
- A small backend to avoid having a raw JSON file on the front-end repo and instead generate it from scratch with each call to the dummy endpoint


### AI Coding assistance
I have used Github Copilot AI to help me develop the entirety of this project (except for this README.md). I wanted to take this opportunity to try the famed *vibe coding* and my feelings are somewhat mixed. First, while I was writing this README I got so bombarded with Copilot suggestions that I had to turn it off. 

When creating the project, I used the Copilot agent to set up the initial page and scaffolding and I gave as a prompt a succinted version of the task. One big flaw I felt during this step was that the agent took too much time with the prompt, which I believe it is due to me not providing a clear one (It lagged considerably while trying to implement the Playwright features). This meant that I could not work in parallel because anything I would do in the meantime meant that I would later have to deal with merge conflicts of all kind. Fortunately tho, I spent that time setting up Wakatime and Wakapi, time-tracker plugins that provide very detailed information about the time spent coding and writing docs. Overall, it took the agent around 40 minutes to provide the initial setup.

From my experience using Copilot on this project, I can say that the main aspect that it cannot accomplish is the fine-tuning detail. For instance, in the mini charts located in the dashboard, the Agent was unable to recognize that the UX was horribly produced. I had to step in and correct those details to give them a sleek view.

