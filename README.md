# E-ink Sticky Notes

E-ink sticky notes showing up-to-date status of tasks, focused on GitHub PRs and customer support Slack threads.

The project has been on my mind for a while, but I started working on it during the [lofi hack](https://lofihack.com/) on Feb 22, 2025

## The idea

A lot of my work is async. I often have to pause tasks to wait for customers to respond or for a co-worker to review my PR. I tried sticky notes to manage my tasks, but they get outdated too quickly. Notion made it easier to keep their status up-to-date, but it’s still a manual process, and I miss having physical sticky notes to represent my tasks.

This project’s goal is to create a hybrid between physical and digital task management. The digital side is a local-first auto-updating dashboard, while the physical side are e-ink displays where each of them would have a single task assigned to them.

The idea is to have five to ten e-ink sticky notes on my desk. As I start my work, I’ll pick which tasks to focus for the day, each of them will be displayed on their own e-ink sticky note. Then I can arrange the tasks as I see fit, whether I’m creating piles by importance, separating coding and customer tasks, or putting them in the order I want to tackle them. As I finish a task, I can physically inspect my tasks to see if any of them is now unblocked, or if I should ping someone about them.

Lastly, placing the e-ink sticky note on a base would start my timer for that task, potentially opening a window letting me navigate to the relevant PR or Slack thread.

## Lofi Hack

During the hackathon I managed to build a simple dashboard, but I didn't get to get the e-ink display showing the graphics I wanted.

## Created with

Created using [create-lofi-app](https://www.npmjs.com/package/create-lofi-app)
