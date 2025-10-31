# Technical Test for Zama

## Architectural choices
In order to ensure a good level of maintainability and consistency, I have created a `constants.ts` file where I have stored all those values that are frequently queries and whose data is not likely to change from one feature implementation to the next one. Values such as primary colours and error messages are stored in that file.

### Feature flag and how to show it
The component I had decided to fit into the category of Feature Flag is a classic: A Marketing banner including a limited-time offer. From my experience in different work environments (specially at Securitize and Synergy Games), I found out that the best way to show feature flags is via a debug toolbar. Creating it is a quite simple task (after all, it's just a div on the right that can collapse) but its usefulness vastly surpasses the time to implement it. I have decided to design it in a similar fashion as in Django Debug Toolbar.

In order to activate the feature flag, you have to click on the arrow located at the right side of the page and then click on the Halloween toggle.

## Reflections
### If I had more time, what would I extend or improve?
Quite a few things!:
- Definitely I would add internationalization with i18n. 
- A small backend to avoid having a raw JSON file on the front-end repo and instead generate it from scratch with each call to the dummy endpoint
- In the Usage page, a button to allow the user to download all of its usage data.
- A responsive design for mobile users


### AI Coding assistance
I have used Github Copilot AI to help me develop the entirety of this project (except for this README.md). I wanted to take this opportunity to try the famed *vibe coding* and my feelings are somewhat mixed. First, while I was writing this README I got so bombarded with Copilot suggestions that I had to turn it off. 

When creating the project, I used the Copilot agent to set up the initial page and scaffolding and I gave as a prompt a succinted version of the task. One big flaw I felt during this step was that the agent took too much time with the prompt, which I believe it is due to me not providing a clear one (It lagged considerably while trying to implement the Playwright features). This meant that I could not work in parallel because anything I would do in the meantime meant that I would later have to deal with merge conflicts of all kind. Fortunately tho, I spent that time setting up Wakatime and Wakapi, time-tracker plugins that provide very detailed information about the time spent coding and writing docs. Overall, it took the agent around 40 minutes to provide the initial setup.

From my experience using Copilot on this project, I can say that the main aspect that it cannot accomplish is the fine-tuning part of development. For instance, in the mini charts located in the dashboard the Agent was unable to recognize that the UX was horribly produced. I had to step in and correct those details to give them a sleek view. Another issue is that, if left on its own, it will tend to generate a huge bloat of code that sometimes contains plenty of variables and values that are not needed for the solution.

