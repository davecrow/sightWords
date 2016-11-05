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

baseballWords =
	title: 'Baseball Words'

listTitles = [
	first25.title
	baseballWords.title
	]



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
	x: Align.center, maxY: Screen.height
	width: Screen.width, height: 100
	text: 'Next Set'
	backgroundColor: '#efefef'
	color: 'black'
nextSetButton.style =
	'padding': '10px'

chooseListButton = new TextLayer
	x: Align.center, y: 0
	width: Screen.width, height: 100
	text: 'Choose Word List'
	backgroundColor: '#efefef'
	color: 'black'

cardContainer = new Layer
	width: Screen.width, height: Screen.height - 200
	y: 100
	backgroundColor: ''

whiteScrim = new Layer
	width: Screen.width, height: Screen.height
	backgroundColor: "white"
	opacity: 0.95
	ignoreEvents: true
whiteScrim.bringToFront()

whiteScrim.states =
	hide: opacity: 0
	show: opacity: 0.95
whiteScrim.animationOptions =
	time: 0.3
	curve: 'linear'
whiteScrim.stateSwitch 'hide'
whiteScrim.sendToBack()





# List Selector 	

listSelectorContainer = new Layer
	width: 250, height: 100
	x: Align.center, y: Align.center
	backgroundColor: 'rgba(107, 172, 194, 0.8)'
	borderRadius: 4

listSelectorItem = new Layer
	parent: listSelectorContainer
	width: listSelectorContainer.width, height: 50
	backgroundColor: ''
listSelectorItem.style =
	'borderBottom': '1px solid white'

listSelectorLabel = new TextLayer
	parent: listSelectorItem
	x: Align.center, y: Align.center
	text: first25.title
	autoSize: true
	textAlign: 'center'
	color: 'black'

# States

listSelectorContainer.states =
	hide: maxY: 0
	show: y: listSelectorContainer.y
listSelectorContainer.animationOptions = curve: 'spring'
listSelectorContainer.stateSwitch 'hide'

# Events

showListSelector = ->
	whiteScrim.placeBefore(cardContainer)
	whiteScrim.animate 'show'
	listSelectorContainer.animate 'show'

hideListSelector = ->
	whiteScrim.animate 'hide'
	listSelectorContainer.animate 'hide'
	
	Utils.delay 0.5, -> whiteScrim.sendToBack()

chooseListButton.onTap ->
	showListSelector()

whiteScrim.onTap ->
	hideListSelector()


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
			fontSize: Screen.width / 3
			autoSize: true
			name: word
			x: Align.center
			y: Align.center
			parent: cardContainer
		
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
	layer.destroy() for layer in wordsLayer # Destroy current word layers
	wordsLayer = [] # Clear the words layer array
	
	currentWordIndex = 0 # Reset the word index
	currentSetIndex += 1 # Increment the index number
	
	createWordLayers() # Create layers for new words

nextWord()

button.onTap ->
	nextWord()
		
nextSetButton.onTap ->
	nextSet()
	nextWord()
	


