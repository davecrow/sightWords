# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "Sight Words"
	author: "Dave Crow"
	twitter: ""
	description: "A sight words flash card app"



# Setup

{FontFace} = require 'FontFace'
{TextLayer} = require 'TextLayer'
{dpr} = require 'DevicePixelRatio'

comicSans = new FontFace
　name: "Comic Sans"
　file: "Comic Sans MS.ttf"


# Data

currentSetIndex = 0
currentWordIndex = 0
currentWord = 0
wordsPerSet = 5

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
	words: [
		['the', 'was', 'to', 'said', 'and']
		['his', 'he', 'that', 'a', 'she']
		['I', 'for', 'you', 'on', 'it']
		['they', 'of', 'but', 'in', 'had']
		]

soccerWords = 
	title: 'Soccer Words'
	words: [
		['at', 'out', 'is', 'am', 'her']
		['then', 'have', 'up', 'some', 'go']
		['look', 'we', 'as', 'with', 'be']
		['little', 'there', 'all', 'down', 'him']
		]

basketballWords =
	title: 'Basketball Words'
	words: [
		['do', 'get', 'can', 'them', 'would']
		['like', 'did', 'this', 'when', 'one']
		['what', 'my', 'so', 'could', 'see']
		['me', 'were', 'yes', 'not', 'will']
		]

footballWords = 
	title: 'Football Words'
	words: [
		['big', 'very', 'went', 'an', 'are']
		['over', 'come', 'your', 'if', 'its']
		['now', 'ride', 'long', 'into', 'no']
		['just', 'came', 'blue', 'ask', 'red']
		]

volleyballWords =
	title: 'Volleyball Words'
	words: [
		['from', 'put', 'good', 'too', 'any']
		['got', 'about', 'take', 'around', 'four']
		['want', 'every', '''don't''', 'pretty', 'how']
		['jump', 'know', 'green', 'right', 'where']
		]

golfWords = 
	title: 'Golf Words'
	words: [
		['away', 'ran', 'old', 'let', 'by']
		['help', 'their', 'make', 'here', 'going']
		['saw', 'sleep', 'call', 'brown', 'after']
		['yellow', 'well', 'five', 'think', 'six']
		]

tennisWords = 
	title: 'Tennis Words'
	words: [
		['walk', 'stop', 'two', 'off', 'round']
		['before', 'who', 'never', 'fly', 'been']
		['again', 'cold', 'play', 'today', 'myself']
		['eight', 'or', 'may', 'eat', 'seven']
		]

bowlingWords = 
	title: 'Bowling Words'
	words: [
		['tell', 'black', 'much', 'white', 'keep']
		['ten', 'give', 'does', 'work', 'bring']
		['first', 'goes', 'try', 'write', 'new']
		['always', 'must', 'drink', 'start', 'once']
		]

pingPongWords = 
	title: 'Ping Pong Words'
	words: [
		['soon', 'our', 'made', 'better', 'run']
		['hold', 'gave', 'buy', 'open', 'funny']
		['has', 'warm', 'find', 'ate', 'only']
		['full', 'us', 'those', 'three', 'done']
		]

hockeyWords =
	title: 'Hockey Words'
	words: [
		['use', 'sit', 'fast', 'which', 'say']
		['fall', 'light', 'caryy', 'pick', 'small']
		['hurt', 'under', 'pull', 'read', 'cut']
		['why', 'kind', 'own', 'both', 'found']
		]

beachBallWords =
	title: 'Beach Ball Words'
	words: [
		['wash', 'upon', 'show', 'these', 'hot']
		['sing', 'because', 'together', 'best', 'please']
		['live', 'thank', 'draw', 'wish', 'clean']
		['many', 'grow', 'far', 'shall', 'laugh']
		]

listTitles = [
	first25.title
	baseballWords.title
	soccerWords.title
	basketballWords.title
	footballWords.title
	volleyballWords.title
	golfWords.title
	tennisWords.title
	bowlingWords.title
	pingPongWords.title
	hockeyWords.title
	beachBallWords.title
	]

list = [
	first25.words
	baseballWords.words
	soccerWords.words
	basketballWords.words
	footballWords.words
	volleyballWords.words
	golfWords.words
	tennisWords.words
	bowlingWords.words
	pingPongWords.words
	hockeyWords.words
	beachBallWords.words
	]

currentList = list[currentSetIndex]



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
	width: Screen.width, height: Screen.height - dpr(100)
	y: dpr 100
	backgroundColor: ''

nextSetButton = new Layer
	x: Align.center, maxY: Screen.height - dpr(50)
	width: dpr(250), height: dpr(50)
	borderRadius: dpr(25)
	backgroundColor: '#6BACC2'

nextSetLabel = new TextLayer
	x: Align.center, y: Align.center
	autoSize: true
	fontSize: dpr(16)
	parent: nextSetButton
	text: 'Next Set of 5'
	color: 'white'

chooseListButton = new Layer
	x: Align.center, y: dpr(50)
	width: dpr(250), height: dpr(50)
	borderRadius: dpr(25)
	backgroundColor: '#6BACC2'

chooseListLabel = new TextLayer
	x: Align.center, y: Align.center
	autoSize: true
	fontSize: dpr(16)
	text: 'Change Word List'
	color: 'white'
	parent: chooseListButton

currentListLabel = new TextLayer
	x: Align.center, y: chooseListButton.maxY + dpr(20)
	autoSize: true
	fontSize: dpr(16)
	text: 'Current List: The First 25'
	color: '#6BACC2'

cardContainer = new Layer
	width: Screen.width, height: Screen.height - dpr(200)
	y: dpr(100)
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
whiteScrim.stateSwitch 'hide' unless Utils.isSafari() is true
whiteScrim.stateSwitch 'hide' if Utils.isDesktop() is true
whiteScrim.sendToBack() unless Utils.isSafari() is true
whiteScrim.sendToBack() if Utils.isDesktop() is true

addToContainer = new Layer
	width: dpr(250), height: dpr(100)
	x: Align.center, maxY: Screen.height
	backgroundColor: ''

addToBox = new Layer
	width: addToContainer.width
	height: addToContainer.height - dpr(10)
	parent: addToContainer
	backgroundColor: '#ccc'
	borderRadius: dpr(4)

addToPointer = new Layer
	parent: addToContainer
	width: dpr(10), height: dpr(10)
	x: Align.center, midY: addToBox.maxY
	rotation: 45
	borderRadius: dpr(2)
	backgroundColor: "#ccc"

addToText = new TextLayer
	parent: addToBox
	autoSize: true
	x: Align.center, y: Align.center
	fontSize: dpr(18)
	color: '#333'
	text: 'Tap "Add to Home Screen"'

addToContainer.states =
	hide: opacity: 0
	show: opacity: 1
addToContainer.stateSwitch 'show'
addToContainer.stateSwitch 'hide' unless Utils.isSafari() is true
addToContainer.stateSwitch 'hide' if Utils.isDesktop() is true




# Create Layers from words array

currentSet = list[0]
wordsLayer = []

createWordLayers = (list) ->

	if currentSetIndex >= currentList.length # Check if we're at the last set
		currentSetIndex = 0 # Reset the index
	
	currentSet = list[currentSetIndex]
	
	# Create word layers
	for word, i in currentSet
		i = new TextLayer
			text: word
			color: 'black'
			fontFamily: 'Comic Sans'
			fontSize: Screen.width / 4
			autoSize: true
			name: word
			x: Align.center
			y: Align.center
			parent: cardContainer
		
		if i.width >= Screen.width / 1.8 # Reduce font size for long words
			i.fontSize = Screen.width / dpr(5)
			i.autoSize = true
			i.x = Align.center
			i.y = Align.center
		
		if i.fontSize >= dpr(100) # Set max fontSize
			i.fontSize = dpr(100)
			i.autoSize = true
			i.x = Align.center
			i.y = Align.center

		wordsLayer.push(i)
	
	# Create states
	for layer, i in wordsLayer
		layer.states =
			hide: opacity: 0
			show: opacity: 1
	
	shuffle(wordsLayer) # Shuffle the order of the words array 

createWordLayers(currentList)

	

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

	createWordLayers(currentList) # Create layers for new words

nextWord()

button.onTap ->
	nextWord()
		
nextSetButton.onTap ->
	nextSet()
	nextWord()
# 	print currentSetIndex



# List Selector 	

selectorItemHeight = dpr(50)
selectorItemLayer = []

listSelectorContainer = new Layer
	width: dpr(250), height: selectorItemHeight * listTitles.length
	x: Align.center, y: Align.center
	backgroundColor: 'rgba(107, 172, 194, 0.8)'
	borderRadius: dpr(4)

for title, i in listTitles
	index = i
	
	i = new Layer
		parent: listSelectorContainer
		width: listSelectorContainer.width, height: selectorItemHeight
		y: selectorItemHeight * i
		backgroundColor: ''
		name: 'listSelectorItem' + i
	i.style =
		'borderBottom': '1px solid white'
	
	selectorItemLayer.push(i)

	listSelectorLabel = new TextLayer
		parent: i
		x: Align.center, y: Align.center
		text: listTitles[index]
		name: listTitles[index]
		autoSize: true
		fontSize: dpr(16)
		textAlign: 'center'
		color: 'white'

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
	
	addToContainer.animate 'hide' if addToContainer.states.current isnt 'hide'

for layer, i in selectorItemLayer
	layer.selectorIndex = i

	layer.onTap ->
		layer.destroy() for layer in wordsLayer # Destroy current word layers
		wordsLayer = [] # Clear the aray
		
		currentList = list[@.selectorIndex] # Choose the new list
		currentSetIndex = 0 # Go to the first set in the list
		currentSet = null
		currentSet = currentList[currentSetIndex]
		
		currentListLabel.text = 'Current List: ' + listTitles[@.selectorIndex]
		currentListLabel.x = Align.center
		
		createWordLayers(currentList) # Create layers from the new list
		nextWord() # Go to the first word in the set
		
		hideListSelector()
	
		




		
