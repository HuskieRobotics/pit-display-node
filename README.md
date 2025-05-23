# Robotics Pit Display Application

The Robotics Pit Display is an application that is used during FIRST Robotics competitions. It is displayed in your robotics team’s pit using some sort of screen such as a monitor. It lists upcoming matches, match history, ranking information, as well as a live Twitch display on the first page. These are from the Blue Alliance API.

The second page is for monitoring the team’s robot functionalities, with the application connecting to the robot’s local server to gather information such as the temperature of the motors as well as the voltage input of different components of the robot. A checklist is included to help your team organize all checks on the robot while it is in the pit. Network Tables, a publish-subscribe messaging system that connects to the robot to get certain values, is used on the second page.

Here is a detailed overview of the project:

**First Page:**
Team stats: This displays our most important statistics from the current competition, allowing team members to plan and strategize accordingly.
Twitch stream: Allows members to keep the stream in view even when they are confined to the pit while working on the robot.
Past matches: Provides a helpful log of what Huskie Robotics’ past matches looked like (i.e. win/loss, red/blue alliance, points earned that match)
Upcoming matches: A schedule of all upcoming matches so the team has a good sense of when the robot needs to be ready for their next match and how much time they have between.

**Second Page (incomplete):**
Checklist: Useful when preparing for a match.
Temperature data: Uses network tables to get the temperatures of each motor and other parts of the robot to catch failures early.

**Third Page (Settings page)**
There are inputs for streaming link that corresponds to the streaming service (Twitch/YouTube). Additionally, there is an input for the event key, which fetches data about the match and competition from the Blue Alliance API. This resolves the prior issue about having to change the event key in config.json and committing this change during every single competition. To configure the RoboRio logs downloading, use the IP Address of the RoboRio. This is usually 10.30.61.2 in the pit network. roborio-3061-frc.local can also work. It will automaticly download the latest log that contains the name of the configured event.
 
This project is based on Ranger Robotics’ Flutter app: [Link](https://github.com/3015RangerRobotics/2023Public)

## Motivation

The Robotics team needs an easy and reliable way to access important data. By having a display that gathers it all in one place, it makes it way easier on the busy members of our robotics team to multi-task.

## Screenshots

![Picture](readmeimages/img1.png)
![Picture](readmeimages/img2.png)

## Platform Requirements

The operating systems that work with our project currently are Windows and Mac. We did not run it on Linux yet, so feel free to try. No external services are needed to use the project. As of current, here are the processing requirements:

- Windows: Windows 10 and 11 (64-bit)
- macOS: latest release and the two previous versions, with Apple security update support
- Linux (Debian): Ubuntu Desktop 20.04, Debian 10
- Linus (Red Hat): Red Hat Enterprise Linux 8, Fedora 36

## Data Schema Organization

In the website folder there is a JSON file titled “website.json”. The checklist on the second page displays whatever is in this json file.

To edit this JSON file, follow these steps:

- Open the JSON file using a text editor like vscode
- Locate the section you want to edit or add a new section if needed.
- To edit an existing item, find the specific task within the corresponding array and modify the text as needed.
- To add a new task, locate the array for the section where you want to add the task, and simply add a new string inside the array with the task description.
- Save the file once you've made your changes.

Your changes will now show up next time you load the website.

This project currently does not use any other data schemas.

## Technologies/Framework Used

Built with:

- JS: used to connect to the APIs and logic out which information we need placed and where in the html code.
- HTML: used to format the data and display it on the page.
- CSS: used to style the data to make our website more visually appealing and easy to read.
- @msgpack/msgpack: ^3.0.0-beta2
- axios: ^1.6.7
- dotenv: ^16.3.1
- ejs: ^3.1.9
- express: ^4.18.2
- express-session: ^1.17.3
- google-auth-library: ^9.4.1
- isomorphic-ws: ^5.0.0
- mongoose: ^7.4.0
- morgan: ^1.10.0
- nodemon: ^3.0.2
- ntcore-ts-client: ^0.2.2
- tslib: ^2.6.2
- uuid: ^9.0.1
- zod: ^3.23.4

## How to Install and Run the Project:

In the VSCode terminal, run these commands:

- ritwickdey.LiveServer ← a VSCode extension that runs the project on web browser

- npm install node axios @msgpack/msgpack@3.0.0-beta2 dotenv@16.3.1 ejs@3.1.9 express@4.18.2 express-session@1.17.3 google-auth-library@9.4.1 isomorphic-ws@5.0.0 mongoose@7.4.0 morgan@1.10.0 nodemon@3.0.2 ntcore-ts-client@0.2.2 tslib@2.6.2 uuid@9.0.1 zod@3.23.4

- open the website folder and right click on index.html and click open with live server

### Instructions:

After cloning the project from the Robotics Pit Display Github, right click on the index.html file int the website folder and click on the “Open with Live Server” option. Make sure that you have a web browser, such as Chrome, opened in order for this to work.

When you have the project opened on your web browser, it should be identical to the screenshots shown in the screenshots section of this README. For the first page, it should show the rank box, the past matches box, the box with the embedded Twitch screen, and the upcoming matches box. The page should refresh every 5 minutes.

On the second page, there should be a working checklist on the left, and placeholder boxes for the information that is going to come from NetworkTables. The checklist clears every time the web page manually refreshes, and the refresh requirement from the first page does not affect this.

Click on the icons on the top-left of the screen to switch between the match information page and the robotics information page.

### .env File:

Regarding TOKEN_NEXUS, this will allow the notifications from Nexus to work. Using the link, https://frc.nexus/en/api, scroll down to the Push section and entire the URL of the public server with a reference point to /nexus in Webhook URL: https://pit.team3061.org/nexus. Then, select a specific event, choosing the certain competition you want to receive notifications from. Following this, choose Live event status after being asked what data you would like to receive. After that, press add. The Webhook token should then show up beneath. Copy that and replace whatever is currently in the TOKEN_NEXUS field and keep it in "". This will then allow for the certain notifications to show up.
## Credits

The Robotics Pit Display was created by Arav Juneja, Georgia Riley, and Yutong Ji @ Naperville North High School for Huskie Robotics 2024.
Jai Gupta, Diya Gupta, and Mihika Gokhale worked on the project in 2025.
