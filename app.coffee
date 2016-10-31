# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "Dave Crow"
	twitter: ""
	description: ""



# Setup

{FontFace} = require 'FontFace'
{TextLayer} = require 'TextLayer'

comicSans = new FontFace
　name: "Comic Sans"
　file: "Comic Sans MS.ttf"


# Layers

Screen.backgroundColor = 'white'

button = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: ''


# Data

currentIndex = 1

first25 = [
	'I'
	'he'
	'am'
	'a'
	'go'
	'no'
	'my'
	'on'
	'look'
	'in'
	'to'
	'we'
	'said'
	'do'
	'is'
	'and'
	'at'
	'the'
	'it'
	'can'
	'see'
	'me'
	'like'
	'come'
	'here'
]

wordsLayer = []


# Shuffle Function

shuffle = (source) ->
  # Arrays with < 2 elements do not shuffle well. Instead make it a noop.
  return source unless source.length >= 2
  # From the end of the list to the beginning, pick element `index`.
  for index in [source.length-1..1]
    # Choose random element `randomIndex` to the front of `index` to swap with.
    randomIndex = Math.floor Math.random() * (index + 1)
    # Swap `randomIndex` with `index`, using destructured assignment
    [source[index], source[randomIndex]] = [source[randomIndex], source[index]]
  source


# Create Layers from words array

for i in [1..first25.length]
	index = i - 1

	i = new TextLayer
		text: first25[index]
		color: 'black'
		fontFamily: 'Comic Sans'
		fontSize: 72*4
		autoSize: true
		name: first25[index]
		x: Align.center
		y: Align.center
	
	wordsLayer.push(i)


# Setup for word layers
	
for layer, i in wordsLayer
	layer.states =
		hide: opacity: 0
		show: opacity: 1
	
	wordsLayer[i].stateSwitch 'hide' unless i is 0
	wordsLayer[0].stateSwitch 'show'
	

# Show cards in random order

button.onTap ->
	# Hide all layers
	layer.stateSwitch 'hide' for layer in wordsLayer
	
	# Show word matching current index number
	wordsLayer[currentIndex].stateSwitch 'show'
	currentIndex += 1 # Increment the index number
	
	if currentIndex is wordsLayer.length # Check if we're at the last word
		currentIndex = 0 # Reset the index
		shuffle(wordsLayer) # Shuffle the order of the words array 


