# About Tuning Visualizer

It's an app for visualizing how and why (from a mathematical point of view) certain intervals and chords sound good while others don't, and learning and constructing different musical tuning systems and temperaments.

I guess [this Wikipedia page](https://en.wikipedia.org/wiki/Musical_tuning) might be a good starting point to actually understand what this project is about.

Yeah it's a pretty niche thing lol

I focused on getting it to work properly, so the layout, styling, accessibility and handling of edge cases is not quite polished yet.

It _does work_ on mobile, but desktop experience is definitely better.

Also it's the first time I've been working alone non-stop on a single project for four weeks straight, in the then mostly unknown territory of SVG, CSS transforms and animations, Web Audio, and other not-your-typical-web-app things. And it's my first MVP-kind-of-finished public project. I guess hackathons can really boost your abilities in quite a short time :D

# Why does it even exist in the first place though

Because understanding tuning systems is hard.

My main priority is creating useful things, I'm interested and quite well versed in both music and maths, and I'm learning (not only) web development - a good combo to end up doing something like this. And the Svelte Hackathon to give me a reason to finally do it xD

# How to

I didn't have time to make a good self-explanatory UI or tutorial, so... just click random things until you figure it out.

You can edit the circle of fifths yourself, or go through the steps of constructing one of the included three basic tuning systems.

# Some theory

An interval is just a ratio between two different sound frequencies - so it's a logarithmic scale. Pure intervals are rational numbers with a small numerator and denominator, originating from the harmonic series.

Cents are a logarithmic scale for measuring intervals and their deviations from pure intervals.
`1 cent = log2(interval) / 1200`

You can prove mathematically that it's impossible to divide the octave (2/1) into equal pure intervals - no rational number raised to a whole power will ever equal 2.

_That's a problem_, because you want intervals to be pure because they sound good, but you also want them to be equal, to make every key/chord sound good too. But you can't have both.

Over the course of history, people have come up with different tuning systems and temperations, each of which has its own advantages and disadvantages. Here you can explore some of them, or create your own.

# Keyboard shortcuts

- Ctrl/CMD + (Shift +) Z - undo/redo
- Backspace - same as Delete button
- A, W, S, E, D, F, T, G, Y, H, U, J - playing notes, as shown on the piano keyboard

# Roadmap

- Better UI (of course)
- Some kind of tutorial/guide/explanation what the heck this is
- More tuning systems
- Analysis of tuning systems and temperations - what they are good/bad for and why
- More about the fundamentals - sound, interactions between different frequencies, harmonic series, perfect intervals
- Better sound (probably adding some harmonics will be enough)
- Editable absolute frequency
