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


# Layers

Screen.backgroundColor = 'white'

button = new Layer
	width: Screen.width, height: Screen.height - 100
	y: 100
	backgroundColor: '#'

nextSetButton = new TextLayer
	x: Align.center, y: 0
# 	autoSize: true
	width: Screen.width, height: 100
	text: 'Next'
	backgroundColor: '#efefef'
	color: 'black'

nextSetButton.style =
	'padding': '10px'


# Data

currentIndex = 0
currentSetOffset = 0
currentWord = 0
wordsPerSet = 5
currentList = null

first25 = 
	title: 'The First 25'
	words: [
		['I', 'he', 'am', 'a', 'go']
		['no', 'my', 'on', 'look', 'in']
		['to', 'we', 'said', 'do', 'is']
		['and', 'at', 'the', 'it', 'can']
		['see', 'me', 'like', 'come', 'here']
		]
	wordsList: []
first25.wordsList.push(first25.words[0])




# print first25.words[0]



# Create Layers from words array

# shuffle(first25) # Shuffle the order of the words array 

wordsLayer = []

for word, i in first25.words[0]
	i = new TextLayer
		text: word
		color: 'black'
		fontFamily: 'Comic Sans'
		fontSize: 72*4
		autoSize: true
		name: word
		x: Align.center
		y: Align.center
	
	wordsLayer.push(i)

# Create states
for layer, i in wordsLayer
	layer.states =
		hide: opacity: 0
		show: opacity: 1
	

# Show cards in random order

nextWord = ->
	# Hide all layers
	layer.stateSwitch 'hide' for layer in wordsLayer
	
	currentWord = currentSetOffset + currentIndex
	
	# Show word matching current index number
	wordsLayer[currentWord].stateSwitch 'show'
	
	currentIndex += 1 # Increment the index number
	
	if currentIndex >= wordsPerSet # Check if we're at the last word
		currentIndex = 0 # Reset the index
		currentWord = currentSetOffset + currentIndex # Reset the word
		shuffle(wordsLayer)

nextSet = ->	
	currentSetOffset += wordsPerSet
	
	if currentSetOffset >= wordsLayer.length
		currentSetOffset = 0
		currentIndex = 0

nextWord()

button.onTap ->
	nextWord()
		
nextSetButton.onTap ->
	nextSet()
	nextWord()
	


