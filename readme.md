# World Time

A simple world time app built in vanilla JS.

## Features

- Displays current time around the world as analog clocks
- Multiple clocks possible for that cosmopolitan feel
- Dynamic search of cities and places
- AM/PM Indicator, (some) user settings

##### Planned features / not yet implemented

- Daylight saving time\*
- Fancy backgrounds according to current time
- Localstorage

## About

This project grew from the idea of experimenting with a simple CSS clock in JavaScript. My aim was to apply what I have learned over the last weeks while deepening my frontend knowledge. For educational purposes I set the rule to not use any external libraries or frameworks.\*
If you happen to stumble upon this and want to submit a pull request/report issues: Go for it! ☺

##### Concepts I utilized

- Basic functional programming
- ES6 Syntax, array methods
- Event handling & delegation
- Fetch API
- DOM Manipulation with dynamic content
- SASS/SCSS
- RWD
- Basic Git workflow via CLI

## \*Problems/Issues

I ran into a lot of smaller issues & gnarly feeling workarounds due to the limitations I set for myself when creating this project. However, it wasn't until I tried implementing the DST feature when I realised that it's just not worth the hassle continuing with these limitations. The ideal solution for me is to rewrite most of the code:

1. Use [another](https://github.com/dmfilipenko/timezones.json)[timezone.JSON](http://worldtimeapi.org/api/timezone) for displaying the data.
2. Rewrite search & display suggestions functionality.
3. Rewrite set & make clock functionality while implementing DST, AM/PM & others.
4. [Use Moment.js](https://momentjs.com/) as working with time objects can be super hard to wrap your head around and very confusing.

## Todo

#### Features

###### Important

- [ ] Implement daylight savings
- [x] AM/PM display
- [x] Settings functionality

###### Nice to have

- [ ] Add localstorage
- [ ] Smooth loading of clocks
- [ ] Smooth repositioning when terminate clock
- [ ] Make Highlight follow suggestion width
- [ ] Frame mode (clocks fill frame + skip like gallery)
- [ ] Color/gradient styles representing time (radar mode)
- [ ] Hide or sticky menu bar / fullscreen or "zen" mode
- [ ] No double clocks?
- [ ] Limit clock count

#### Code

###### Important

- [ ] Utilize new timezones.JSON -> Rewrite search/suggestion functionality
- [ ] Prevent firing highlight too often

###### Minor

- [ ] Clean up conditionals
- [ ] Console error when searching with empty string
- [ ] Clean up variable & parameter names
- [ ] Return strings from filter / check map functions
