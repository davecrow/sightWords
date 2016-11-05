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

currentSetIndex = 0
currentWordIndex = 0
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

currentSet = null
wordsLayer = []

createWordLayers = ->
	if currentSetIndex >= first25.words.length # Check if we're at the last set
		currentSetIndex = 0 # Reset the index
	
	currentSet = first25.words[currentSetIndex]
	
	# Create word layers
	for word, i in currentSet
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
	
	shuffle(wordsLayer) # Shuffle the order of the words array 

createWordLayers()
	

# Show cards in random order

nextWord = ->
	# Hide all layers
	layer.stateSwitch 'hide' for layer in wordsLayer
	
	# Show word matching current index number
	wordsLayer[currentWordIndex].stateSwitch 'show'
	
	currentWordIndex += 1 # Increment the index number
	
	if currentWordIndex >= wordsLayer.length # Check if we're at the last word
		currentWordIndex = 0 # Reset the word index
		shuffle(wordsLayer)

nextSet = ->
	# Destroy current word layers
	layer.destroy() for layer in wordsLayer
	
	currentSetIndex += 1 # Increment the index number
	print currentSetIndex
	
	createWordLayers()
		
# 	currentSetOffset += wordsPerSet
# 	
# 	if currentSetOffset >= wordsLayer.length # Check if we're at the end of the set
# 		currentSetOffset = 0 # Reset offset
# 		currentIndex = 0 # Reset Index

nextWord()

button.onTap ->
	nextWord()
		
nextSetButton.onTap ->
	nextSet()
	nextWord()
	


