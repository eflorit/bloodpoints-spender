This is a simple afternoon project for automatically spending bloodpoints on Dead By Daylight bloodwebs, thus leveling up characters. Fire it up, and go walk outside for an hour. It'll make mom happy.

You must be on PC, with an in-game resolution of `1920x1080`. Tested with graphics on `Low`.

# Usage (Installation below)

1. Launch Dead By Daylight and open up the bloodweb section of the character you want to level up.
2. `Alt+Tab` or `Windows+D` to return to Windows, find and run the program.
3. Quickly `Alt+Tab` back to the game, the bloodweb will start completing on its own within seconds.
4. To stop the program, `Alt+Tab` back to it, and press `Ctrl+C`.

# Installation

### Binary download

1. Download the [precompiled project](https://github.com/eflorit/bloodpoints-spender/releases/download/v1.0.0/bloodpoints-spender.zip), and uncompress the archive.
2. Run `bloodpoints-spender.exe`.

### Building yourself

1. Install [Node.js](https://nodejs.org/en/download/), make sure during install to check box to also get [Chocolatey](https://user-images.githubusercontent.com/3109072/68096791-82350c00-fe89-11e9-8cfa-b4619ce96162.jpg) as well.
2. Follow requirements to build [RobotJS](http://robotjs.io/docs/building) (you may or may not need to [tweak PowerShell](https://caiomsouza.medium.com/fix-for-powershell-script-not-digitally-signed-69f0ed518715) at some point).
3. Install dependencies: `npm install`
4. Run: `node index.js`

# FAQ

- **How does it work?**

It takes screenshots of the screen, tries to find a random selectable node, and moves the mouse over to it to click it. Then does it all over again, until it eventually gets stuck (either a bug, or no more bloodpoints to spend) and gives up. It also handles prestiging.

- **Can I make it prioritize certain items/rarities?**

No, it would be a ridiculous amount of work to implement. The current goal is just to randomly spend bloodpoints to level up.

- **Why does my mouse cursor sporadically act up when the program is running?**

To work with clear screen captures, the program will frequently move the mouse to the top left corner of the screen. It is expected behavior.

- **Will I get banned for using this?**

This script is very simple and it doesn't tamper with the game memory, so you should be in the clear. You will also only run it while on the bloodweb screen. That said, this project is experimental and you take full responsibility for running it.

- **Why is the UX so ####?**

Yes.
