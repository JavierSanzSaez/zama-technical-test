# Technical Test for Zama

## Objective
Demonstrate strong React and TypeScript skills, developer UX judgement, and testing discipline. Success looks like a small but coherent 'Sandbox Console' that feels fast and reliable, includes a visible feature flag, shows a tiny analytics chart from synthetic data, and is well documented and tested with Playwright.

## Deployed Demo
You can find a deployed version of the project at: [https://zama-technical-test.vercel.app/](https://zama-technical-test.vercel.app/)

Additionally, you can run the page locally:

```bash
# Install dependencies
npm install
# Run the development server
npm run dev
```

All the dummy data is stored locally, so no backend setup or generators are needed. Check the section about [Dummy Data](#dummy-data) for more information.

### Testing the project
To run the Playwright tests, you can use the following command:

```bash
npx playwright test
```

You can check the section about [Testing](#testing) for more information about the testing strategy and coverage.

## Deployment

### Vercel Deployment
The project is configured for deployment on Vercel. The necessary configuration files are already included:

- `vercel.json`: Contains build settings, routing rules, and security headers
- `.vercelignore`: Specifies files to exclude from deployment

To deploy to Vercel:

1. **Using Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Using GitHub Integration:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically build and deploy on every push to main branch

3. **Manual Deployment:**
   - Build the project locally: `npm run build`
   - Upload the `dist` folder to Vercel dashboard

The `vercel.json` configuration includes:
- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Caching**: Optimized cache headers for static assets
- **Build Settings**: Automated build process using `npm run build`

### Environment Variables
No environment variables are required for this demo project as it uses local storage for authentication and static JSON data.

## Architectural choices

The entire page is set up with Vite, a very fast builder library that allows for a quick development experience. The front-end is built with React and TypeScript, using functional components and hooks to manage state and side effects. For styling, I have opted for Tailwind CSS, which provides utility-first CSS classes that help in rapidly building custom designs without leaving the HTML.

In order to ensure a good level of maintainability and consistency, I have created a `constants.ts` file where I have stored all those values that are frequently queries and whose data is not likely to change from one feature implementation to the next one. Values such as primary colours and error messages are stored in that file.

### Auth
For this demo I have decided to use a simple localStorage-based solution since it was the simplest way to simulate authentication without a backend. The auth API simulates login, logout, and session management with expiration. The session token is set to expire after 24 hours, and this duration can be configured via a global variable for testing purposes.

However, if this project were to be deployed on a production setting, I would implement the authentication flow using secure HTTP-only cookies set by the server upon successful login. This approach mitigates the risk of XSS attacks since the cookies are not accessible via JavaScript. Additionally, I would implement proper session management on the server side, including token expiration and refresh mechanisms to ensure security and a seamless user experience.

### Dummy data
The dashboard reads dummy usage data from two sources:

1. A local JSON file located in the `data` folder. This data is mainly used for the Usage page and, as such, it contains data related to the user activity over the span of 30 days, although it is granular enough to provide hourly data.
2. A function named `createMockAPIKeys` that generates a set of dummy API keys for testing purposes. This object is used in the API Keys page to display a list of API keys associated with the user.

### Feature flag and how to show it
The component I had decided to fit into the category of Feature Flag is a classic: A Marketing banner including a limited-time offer. From my experience in different work environments (specially at Securitize and Synergy Games), I found out that the best way to show feature flags is via a debug toolbar. Creating it is a quite simple task (after all, it's just a div on the right that can collapse) but its usefulness vastly surpasses the time to implement it. I have decided to design it in a similar fashion as in Django Debug Toolbar.

In order to activate the feature flag, you have to click on the arrow located at the right side of the page and then click on the Halloween toggle.

## Description of the pages
Overall, I have designed the following pages:
- **Login page**: A simple login form that accepts any email and password combination. Upon successful login, the user is redirected to the dashboard.
- **Dashboard page**: The main page that displays an overview of the user's activity, including a mini chart showing usage data.
- **API Keys page**: A page that lists the user's API keys, allowing them to view and manage their keys.
- **Usage page**: A detailed view of the user's usage data over the past 30 days, presented in a larger chart.
- **Documentation page**: A static page that provides documentation and resources for users.
- **Not Found page**: A fallback page that is displayed when the user navigates to an undefined route. If the user is not authenticated, they will be redirected to the login page.

All routes are protected, meaning that if the user is not authenticated, they will be redirected to the login page.

## Testing
The project includes end-to-end tests using Playwright to ensure the reliability and correctness of the application. 

Due to the contrived nature of this project, I have focused the tests on mainly E2E flows as well as the features that I consider more critical for the user experience.

The tests cover the following scenarios:
- **Authentication Flow**: Tests for login and logout functionality, including redirection to the login page when unauthenticated.
- **Dashboard Functionality**: Verification of the dashboard's loading state, data display, and mini chart rendering.
- **API Keys Management**: Tests for displaying API keys and handling cases with no keys.
- **Usage Data Visualization**: Tests for the correct rendering of usage data charts and tables.

You can read more about the testing strategy and coverage in the [tests/README.md](tests/README.md) file.

## Reflections
### If I had more time, what would I extend or improve?
Quite a few things!:
- Definitely I would add internationalization with i18n. I have not implemented it because it would have taken a considerable amount of time to set up all the translation files and the necessary configuration, as well as to adapt the Playwright tests to handle multiple languages.
- A small backend to avoid having a raw JSON file on the front-end repo and instead generate it from scratch with each call to the dummy endpoint
- In the Usage page, a button to allow the user to download all of its usage data.
- A responsive design for mobile users

### AI Coding assistance
I have used Github Copilot AI to help me develop the entirety of this project (except for this README.md). I wanted to take this opportunity to try the famed *vibe coding* and my feelings are somewhat mixed. First, while I was writing this README I got so bombarded with Copilot suggestions that I had to turn it off. 

When creating the project, I used the Copilot agent to set up the initial page and scaffolding and I gave as a prompt a succinted version of the task. One big flaw I felt during this step was that the agent took too much time with the prompt, which I believe it is due to me not providing a clear one (It lagged considerably while trying to implement the Playwright features). This meant that I could not work in parallel because anything I would do in the meantime meant that I would later have to deal with merge conflicts of all kind. Fortunately tho, I spent that time setting up Wakatime and Wakapi, time-tracker plugins that provide very detailed information about the time spent coding and writing docs. Overall, it took the agent around 40 minutes to provide the initial setup.

From my experience using Copilot on this project, I can say that the main aspect that it cannot accomplish is the fine-tuning part of development. For instance, in the mini charts located in the dashboard the Agent was unable to recognize that the UX was horribly produced. I had to step in and correct those details to give them a sleek view. Another issue is that, if left on its own, it will tend to generate a huge bloat of code that sometimes contains plenty of variables and values that are not needed for the solution.

