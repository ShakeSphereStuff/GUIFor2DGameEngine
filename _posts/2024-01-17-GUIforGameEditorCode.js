var cell = document.getElementsByClassName("cell")
var horIsMouseDown = Array(document.getElementsByClassName("horizontalDivider").length).fill(false)
var vertIsMouseDown = Array(document.getElementsByClassName("verticalDivider").length).fill(false)
var layOutSelectionMenu = [
    {
        "name": "Coding Layout",
        "layOut":[["Scene Editor"], ["Javascript Runner", "Editor Controls"]]
    },
    {
        "name": "Tile Layout",
        "layOut":[["Scene Editor"], ["Tile Editor", "Tile Editor Colors"]]
    }
]
var layOut = [["Scene Editor"], ["Javascript Runner", "Editor Controls"]]
var cellModes = ["Scene Editor", "Editor Controls", "Tile Editor", "Javascript Runner", "Tile Editor Colors"]
var allCells = document.querySelectorAll(".cell")
var allRows = document.querySelectorAll(".row")
var menuOptions = {
    "Scene Editor" : {
        "objectData" : [{
            "name": "Test Box", 
            "x": 10, 
            "y":10, 
            "width": 100, 
            "height": 150,
            "colors":[],
        },
        {
            "name": "Test Box 2", 
            "x": 300, 
            "y":300, 
            "width": 100, 
            "height": 150,
            "colors":[],
        }], // Holds all objects in Scene, Tile Values, Has Collision, i.e., {"x": 0, "y": 0}
        "screenData" : [], 
        "player" :{
            "speed" : 5,
            "canMove": true
        },
    },
    "Editor Controls" : {
        "" : "" // IDK What goes here
    },
    "Tile Editor" : {
        "tileStorage" : [] // Array of color for Colors
        },
    "Javascript API" : {
        "Code" : [""] // Array for code values, eventualy to 2D Array for multiple tabs 
    }
}
var cellType = ""
var settingsPromptOptions = [
    ["showPlayer", "checkbox", true, null],
    ["gridSnaping", "range", 10, 1],
    ["playerSpeed", "range", 5, 0.1]
]
var tileXSpacing = 15 // In px
var tileYSpacing = 15
var tilesOnXAxis = 8
var tilesOnYAxis = 8
var gridSnaping = 10
var defaultObjectParameters = [
    ["X:", "number", 100, "x"], 
    ["Y:", "number", 100, "y"], 
    ["Width:", "number", 100, "width"], 
    ["Height:", "number",  150, "height"], 
]

for(var objectItterator in menuOptions["Scene Editor"]["objectData"]){
    menuOptions["Scene Editor"]["objectData"][objectItterator]["colors"] = Array(tilesOnYAxis * tilesOnYAxis).fill([0, 128, 0])
}

function compileWindows(){
    var cellsToAppend = []
    for(let layOutOfRows in layOut){
        var startingRow = document.createElement("div")
        startingRow.className = "row"
        startingRow.style.width = `calc(${100 / layOut.length}% - 16px)`
        for(let layOutOfCells in layOut[layOutOfRows]){
            var startingCell = document.createElement("div")
            startingCell.className = "cell"
            startingCell.style.height = `calc(${100 / layOut[layOutOfRows].length}% - ${10 / layOut[layOutOfRows].length}px)`
            startingRow.appendChild(startingCell)
            cellsToAppend.push([startingCell, layOut[layOutOfRows][layOutOfCells]])
            document.getElementById("mainWindow").appendChild(startingRow)
            if(layOut[layOutOfRows].length - 1 > layOutOfCells){
                var startingVerticalDivider = document.createElement("div")
                startingVerticalDivider.id = `vertical${layOutOfRows},${layOutOfCells},${parseInt(layOutOfCells) + 1}`
                startingVerticalDivider.className = "verticalDivider"
                document.getElementsByClassName("row")[parseInt(layOutOfRows)].appendChild(startingVerticalDivider)
            }
        }
        if(layOutOfRows < layOut.length - 1){
            var startingHorizontalDivider = document.createElement("div")
            startingHorizontalDivider.id = `horizontal${layOutOfRows}${parseInt(layOutOfRows) + 1}`
            startingHorizontalDivider.className = "horizontalDivider"
            document.getElementById("mainWindow").appendChild(startingHorizontalDivider)
        }
    }
    return cellsToAppend
}

function settingsPrompt(){ 
    var settingsPromptBackground = document.createElement("div")
    var settingsPrompt = document.createElement("div")
    var settingsPromptHeaderBar = document.createElement("div")
    var settingsPromptHeaderBarCloseButton = document.createElement("div")
    var settingsPromptHeaderBarTitle = document.createElement("div")
    var settingsPromptSaveButton = document.createElement("button") 

    settingsPromptBackground.className = "settingsPromptBackgroundColor"
    settingsPrompt.className = "settingsPrompt"
    settingsPromptHeaderBar.className = "settingsPromptHeaderBar"
    settingsPromptHeaderBarTitle.className = "settingsPromptHeaderBarTitle"
    settingsPromptHeaderBarCloseButton.className = "settingsPromptCloseButton"
    settingsPromptSaveButton.className = "settingsPromptSaveButton" 

    // Work on sliders for Grid spacing / player controls

    settingsPromptHeaderBarCloseButton.innerText = "X"
    settingsPromptSaveButton.innerText = "Save"
    settingsPromptHeaderBarTitle.innerText = "Settings"
    settingsPromptHeaderBarCloseButton.onclick = () => {
        document.getElementsByClassName("settingsPromptBackgroundColor")[0].remove()
    }
    settingsPromptSaveButton.onclick = () => {saveSettingChanges()}

    settingsPromptHeaderBar.appendChild(settingsPromptHeaderBarTitle)
    settingsPromptHeaderBar.appendChild(settingsPromptHeaderBarCloseButton)
    settingsPrompt.appendChild(settingsPromptHeaderBar)

    for(let settingsPromptOptionsIterator in settingsPromptOptions){
        var settingsPromptOptionLabel = document.createElement("p")
        var settingsPromptOptionInput = document.createElement("input")
        var settingsPromptOptionDiv = document.createElement("div")
        var settingsPromptOptionValue = document.createElement("p")

        settingsPromptOptionLabel.innerText = settingsPromptOptions[settingsPromptOptionsIterator][0]
        settingsPromptOptionInput.type = settingsPromptOptions[settingsPromptOptionsIterator][1]
        settingsPromptOptionInput.value = settingsPromptOptions[settingsPromptOptionsIterator][2]
        settingsPromptOptionValue.innerText = settingsPromptOptions[settingsPromptOptionsIterator][2]

        if(settingsPromptOptions[settingsPromptOptionsIterator][1] == "checkbox"){ 
            if(settingsPromptOptions[settingsPromptOptionsIterator][2]){
                settingsPromptOptionInput.setAttribute("checked", settingsPromptOptions[settingsPromptOptionsIterator][2])
            }
            settingsPromptOptionInput.addEventListener("click", (event)=>{
                console.log(document.getElementsByClassName("settingsPromptOptionValue")[settingsPromptOptionsIterator])
                document.getElementsByClassName("settingsPromptOptionValue")[settingsPromptOptionsIterator].innerText = document.getElementsByClassName("settingsPromptOptionInput")[settingsPromptOptionsIterator].checked
            })
        }
        else if(settingsPromptOptions[settingsPromptOptionsIterator][1] == "range"){
            settingsPromptOptionInput.min = settingsPromptOptions[settingsPromptOptionsIterator][3]
            settingsPromptOptionInput.step = settingsPromptOptions[settingsPromptOptionsIterator][3]
            settingsPromptOptionInput.addEventListener("input", (event)=>{
                document.getElementsByClassName("settingsPromptOptionValue")[settingsPromptOptionsIterator].innerText = document.getElementsByClassName("settingsPromptOptionInput")[settingsPromptOptionsIterator].value
            })
        }

        settingsPromptOptionLabel.className = "settingsPromptOptionLabel"
        settingsPromptOptionInput.className = "settingsPromptOptionInput"
        settingsPromptOptionValue.className = "settingsPromptOptionValue"
        settingsPromptOptionDiv.style.display = "flex"
        settingsPromptOptionDiv.style.paddingLeft = "10px"

        settingsPromptOptionDiv.appendChild(settingsPromptOptionLabel)
        settingsPromptOptionDiv.appendChild(settingsPromptOptionInput)
        settingsPromptOptionDiv.appendChild(settingsPromptOptionValue)
        settingsPrompt.appendChild(settingsPromptOptionDiv)
    }
    settingsPrompt.appendChild(settingsPromptSaveButton)
    settingsPromptBackground.appendChild(settingsPrompt)
    document.getElementById("mainContainer").appendChild(settingsPromptBackground)
}

function saveSettingChanges(){
    for(var settingsPromptOptionItterator = 0; settingsPromptOptionItterator < document.getElementsByClassName("settingsPromptOptionInput").length; settingsPromptOptionItterator++){
        var settingsPromptCurrentOption = document.getElementsByClassName("settingsPromptOptionInput")[settingsPromptOptionItterator]
        switch(settingsPromptOptionItterator){
            case 0:
                if(settingsPromptCurrentOption.checked){
                    document.getElementById("player").style.display = "inline"
                    settingsPromptOptions[0][2] = true
                    menuOptions["Scene Editor"]["player"]["canMove"] = true
                }
                else{
                    document.getElementById("player").style.display = "none"
                    settingsPromptOptions[0][2] = false
                    menuOptions["Scene Editor"]["player"]["canMove"] = false
                }
                break
            case 1:
                console.log(document.getElementsByClassName("expandedControlsSlider"))
                settingsPromptOptions[1][2] = parseInt(settingsPromptCurrentOption.value)
                gridSnaping = settingsPromptOptions[1][2]

                for(var settingsChangeObjectItterator = 0; settingsChangeObjectItterator < (document.getElementsByClassName("sceneObject").length * defaultObjectParameters.length); settingsChangeObjectItterator++){
                    var currentObjectID = Math.floor(settingsChangeObjectItterator / defaultObjectParameters.length)
                    var currentParameterID = defaultObjectParameters[settingsChangeObjectItterator % defaultObjectParameters.length][3]

                    document.getElementsByClassName("sceneObject")[currentObjectID].setAttribute(
                        defaultObjectParameters[settingsChangeObjectItterator % defaultObjectParameters.length][3], 
                        Math.floor(menuOptions["Scene Editor"]["objectData"][currentObjectID][currentParameterID] / gridSnaping + 0.5) * gridSnaping
                    )
                    menuOptions["Scene Editor"]["objectData"][currentObjectID][currentParameterID] = Math.floor(menuOptions["Scene Editor"]["objectData"][currentObjectID][currentParameterID] / gridSnaping + 0.5) * gridSnaping
                }

                for(let controlSnaping in document.getElementsByClassName("expandedControlsSlider")){
                    if(document.getElementsByClassName("expandedControlsSlider")[controlSnaping].type != "number"){
                        console.log("Not the the right type")
                        continue
                    }
                    let expandedControlsSlider = document.createElement("input")
                    expandedControlsSlider.type = "number"
                    expandedControlsSlider.step = gridSnaping
                    expandedControlsSlider.className = "expandedControlsSlider"

                    if(controlSnaping == 2 || controlSnaping == 3){
                        expandedControlsSlider.min = 0
                    }

                    document.getElementsByClassName("expandedControlsMenu")[controlSnaping].appendChild(expandedControlsSlider)

                    var currentObjectID = parseInt(expandedControlsSlider.parentElement.id.replace("expandedControlsParentObject", ""))
                    var currentParameterID = defaultObjectParameters[controlSnaping % defaultObjectParameters.length][3]

                    expandedControlsSlider.value = Math.floor(menuOptions["Scene Editor"]["objectData"][currentObjectID][currentParameterID] / gridSnaping + 0.5) * gridSnaping

                    expandedControlsSlider.addEventListener("input", () => {
                        changeObjectValues(
                            defaultObjectParameters[controlSnaping][3], 
                            parseInt(expandedControlsSlider.parentElement.id.replace("expandedControlsParentObject", "")), 
                            expandedControlsSlider.value)
                    })
                    document.getElementsByClassName("expandedControlsMenu")[controlSnaping].getElementsByClassName("expandedControlsSlider")[0].remove() 
                }
                var allCells = document.getElementsByClassName("cell")
                for(var sceneEditorItterator = 0; sceneEditorItterator < document.getElementsByClassName("hasSceneEditor").length; sceneEditorItterator++){
                    document.getElementById("player").setAttribute("x", Math.floor((allCells[sceneEditorItterator].clientWidth / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
                    document.getElementById("player").setAttribute("y", Math.floor((allCells[sceneEditorItterator].clientHeight / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
                }
                break
            case 2:
                menuOptions["Scene Editor"]["player"]["speed"] = settingsPromptCurrentOption.value
                settingsPromptOptions[2][2] = settingsPromptCurrentOption.value
                break
        }
    }
    document.getElementsByClassName("settingsPromptBackgroundColor")[0].remove()
}

function createDropdown(currentCell, cellAssignment){
    console.log("createDropdown has", currentCell, cellAssignment)
    var dropDown = document.createElement("select");
    
    dropDown.onchange = function(){changeCell(currentCell, (cellAssignment))};
    dropDown.className = "menuSelector"

    for(var selectOption in cellModes){
        var dropDownOption = document.createElement("option");
        console.log("Cell assignment", cellAssignment)
        dropDownOption.innerText = cellModes[selectOption];
        if(selectOption == cellAssignment){
            console.log("Cell assignment is", cellAssignment)
            dropDownOption.selected = cellModes[selectOption]
        }
        dropDown.appendChild(dropDownOption);
    }

    var header = document.createElement("div")
    header.className = "header";

    header.appendChild(dropDown)
    currentCell.appendChild(header);
}

function startUp(){
    cellType = compileWindows()
    for(let current = 0; current < cell.length; current++){
        let currentCell = document.getElementsByClassName("cell")[current]
        console.log("Selecting Values of", cellType[current])
        createDropdown(currentCell, (cellModes.indexOf(cellType[current][1])))
        selectMode(current, cellType[current][0], cellType[current][1])
    }

    if(document.getElementById("layOutSelectionMenu").children.length > 1){
        return
    }

    for(layOutSelectionIndex in layOutSelectionMenu){
        var layOutSelectionOption = document.createElement("option")
        layOutSelectionOption.innerText = layOutSelectionMenu[layOutSelectionIndex]["name"]
        document.getElementById("layOutSelectionMenu").appendChild(layOutSelectionOption)
    }

    document.getElementById("layOutSelectionMenu").addEventListener("change", (submitedEvent) => {
        document.getElementById("mainWindow").remove()
        var newMainWindow = document.createElement("div")
        newMainWindow.id = "mainWindow"
        document.getElementById("mainContainer").insertBefore(newMainWindow, document.getElementById("cellSettingsOpener"))
        layOut = layOutSelectionMenu[submitedEvent.target.selectedIndex]["layOut"]
        while(document.getElementById("cellSettingsControls").firstChild){
            document.getElementById("cellSettingsControls").removeChild(document.getElementById("cellSettingsControls").firstChild)
        }
        document.getElementById("cellSettingsControls").innerHTML = `<p class = "currentSelectedCellValue" id = "0" hidden></p>
    <p style = "display: inline-block; vertical-align: middle;">Width</p><input type = "range" style="width:75px" value = "0"><br>
    <p style = "display: inline-block; vertical-align: middle">Height</p><input type = "range" style="width:75px" value = "0"><br><br>`
        startUp()
    })
}

function changeCell(typeOfCell, cellID){
    // typeOfCell = document.getElementsByClassName("cell")[cellID - 1]
    console.log("Change Cell has", typeOfCell, (cellID))
    var cellLabel = typeOfCell.getElementsByTagName("select")[0].value
    console.log("Testing", typeOfCell.getElementsByTagName("select")[0].value)

    typeOfCell.getElementsByClassName("header")[0].remove()
    typeOfCell.lastChild.remove()
    createDropdown(typeOfCell, cellModes.indexOf(cellLabel))
    selectMode((parseInt(cellID) - 1) , typeOfCell, cellLabel)
}

function selectMode(cellIteration, activeCell, cellType){
    var header = document.createElement("div");
    var currentCell = activeCell
    console.log("Cell Variables are", activeCell, cellIteration, cellType)

    // Does not work at all! 
    switch(cellType){
        case "Scene Editor":
            var sceneEditor = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            sceneEditor.setAttribute("class", "sceneEditor")

            // Need to set scene editor to be avaliable for multiple windows
            
            menuOptions["Scene Editor"]["screenData"].push(0, 0, currentCell.clientWidth, currentCell.clientHeight)

            currentCell.appendChild(sceneEditor)
            currentCell.className += " hasSceneEditor"
            for(var objectCreator in (menuOptions["Scene Editor"]["objectData"])){
                createObjectForDisplay(objectCreator, (document.getElementsByClassName("sceneEditor").length - 1))
            }

            screenControlsHUD(currentCell)
            break
        case "Editor Controls":
            var mainEditorControls = document.createElement("nav")
            var bottomObjectBar = document.createElement("div")
            var addObjectButton = document.createElement("button")

            bottomObjectBar.className = "bottomObjectBar"
            addObjectButton.innerText = "+"
            addObjectButton.className = "addObjectButton"
            addObjectButton.onclick = () => {
                createObjectControls(cellIteration)
            }
            mainEditorControls.className = "mainEditorControls"

            console.log("Current Cell is", document.getElementsByClassName("cell"))
            bottomObjectBar.appendChild(addObjectButton)
            mainEditorControls.appendChild(bottomObjectBar)
            currentCell.appendChild(mainEditorControls)

            console.log("My current Cell is", currentCell)
            for(let editorObject in menuOptions["Scene Editor"]["objectData"]){
                addObjectControls((currentCell.getElementsByClassName("mainEditorControls")[0]), editorObject)
            }

            break
        
        case "Javascript Runner":
            var codeSpace = document.createElement("textarea")
            codeSpace.className = "codeSpace"
            codeSpace.addEventListener("focus", (event) => {
                menuOptions["Scene Editor"]["player"]["canMove"] = false
            })
            codeSpace.addEventListener("focusout", () => {
                menuOptions["Scene Editor"]["player"]["canMove"] = true
            })
            currentCell.appendChild(codeSpace)
            break

        case "Tile Editor":
            var mainTileEditor = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            var tileEditorItemChanger = document.createElementNS("http://www.w3.org/2000/svg", "g")

            mainTileEditor.setAttribute("class", "mainTileEditor")
            mainTileEditor.setAttribute("height", currentCell.clientHeight)
            mainTileEditor.setAttribute("width", currentCell.clientWidth)
            mainTileEditor.setAttribute("x", 0)
            mainTileEditor.setAttribute("y", 0)
            mainTileEditor.setAttribute("viewbox", `0 0 ${currentCell.clientWidth} ${currentCell.clientHeight}`)

            tileEditorItemChanger.onmousedown = (event) => {
                if(document.getElementsByClassName("selectedTile").length != 0){
                    document.getElementsByClassName("selectedTile")[0].remove()
                }
                var tileEditorSelectedX = Math.floor((event.clientX - Math.floor(tileEditorItemChanger.getBoundingClientRect().x)) / tileXSpacing)
                var tileEditorSelectedY = Math.floor((event.clientY - Math.floor(tileEditorItemChanger.getBoundingClientRect().y)) / tileYSpacing)

                var selectedTile = document.createElementNS("http://www.w3.org/2000/svg", "rect")
                selectedTile.setAttribute("width", 15)
                selectedTile.setAttribute("height", 15)
                selectedTile.setAttribute("x", tileEditorSelectedX * tileXSpacing)
                selectedTile.setAttribute("y", tileEditorSelectedY * tileYSpacing)
                selectedTile.setAttribute("class", "selectedTile")
                selectedTile.setAttribute("style", "fill: transparent; stroke: red; stroke-width: 3")
                tileEditorItemChanger.appendChild(selectedTile)

                console.log("Got values of", document.getElementsByClassName("tileEditorPixel")[tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX].getAttribute("style"))
                console.log("Color should be", `rgb(${document.getElementsByClassName("tileEditorSlider")[0].value}, ${document.getElementsByClassName("tileEditorSlider")[1].value}, ${document.getElementsByClassName("tileEditorSlider")[2].value})`)
                if(document.getElementsByClassName("tileEditorColorShowcase").length == 0){
                    return
                }

                var tileEditorObjectColor = menuOptions["Scene Editor"]["objectData"][0]["colors"][tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX]

                for(var tileEditorColorItterator in Array(document.getElementsByClassName("tileEditorShowcase"))){
                    console.log(tileEditorColorItterator)
                    console.log(document.getElementsByClassName("tileEditorColorShowcase")[tileEditorColorItterator])
                    // document.getElementsByClassName("tileEditorColorShowcase")[tileEditorColorItterator].style.backgroundColor = `rgb(${tileEditorObjectColor[0]}, ${tileEditorObjectColor[1]}, ${tileEditorObjectColor[2]})`
                }
                menuOptions["Scene Editor"]["objectData"][0]["colors"][tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX] = [parseInt(document.getElementsByClassName("tileEditorSlider")[0].value), parseInt(document.getElementsByClassName("tileEditorSlider")[1].value), parseInt(document.getElementsByClassName("tileEditorSlider")[2].value)]

                document.getElementsByClassName("tileEditorPixel")[tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX].setAttribute("style", `fill: rgb(${document.getElementsByClassName("tileEditorSlider")[0].value}, ${document.getElementsByClassName("tileEditorSlider")[1].value}, ${document.getElementsByClassName("tileEditorSlider")[2].value}); user-select:none;`)

                // document.getElementsByClassName("tileEditorPixel")[tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX].setAttribute("class", 
                // document.getElementsByClassName("tileEditorPixel")[tileEditorSelectedY * tilesOnYAxis + tileEditorSelectedX].getAttribute("class").toString() + " selectedTile")
            }

            tileEditorItemChanger.onmouseup = (event) => {
                document.getElementsByClassName("selectedTile")[0].remove()
            }

            var tileXPreCalc = tilesOnXAxis * tileXSpacing
            var tileEditorObjectColor = menuOptions["Scene Editor"]["objectData"][0]["colors"]

            for(var tileItterator = 0; tileItterator < (tilesOnXAxis * tilesOnYAxis); tileItterator++){
                var spacingForTileX = () =>{
                    var tileXSpacingItteration = tileXSpacing * tileItterator 
                    return ((tileXSpacingItteration) - Math.floor((tileXSpacingItteration) / (tileXPreCalc)) * tileXPreCalc) 
                }
                console.log("Main Calculations are", (Math.floor(tileItterator / tilesOnXAxis) * tilesOnXAxis))
                console.log("Spacing is", spacingForTileX())
                var mainObstacle = document.createElementNS("http://www.w3.org/2000/svg" , "rect")
                mainObstacle.setAttribute("height", 15)
                mainObstacle.setAttribute("width", 15)
                mainObstacle.setAttribute("x", spacingForTileX())
                mainObstacle.setAttribute("y", (Math.floor(tileItterator / tilesOnXAxis) * tileYSpacing))
                mainObstacle.setAttribute("class", "tileEditorPixel")
                mainObstacle.setAttribute("style", `fill: rgb(${tileEditorObjectColor[tileItterator][0]}, ${tileEditorObjectColor[tileItterator][1]}, ${tileEditorObjectColor[tileItterator][2]}); user-select: none`)
                tileEditorItemChanger.appendChild(mainObstacle)
            }

            tileEditorItemChanger.setAttribute("transform", `translate(${currentCell.clientWidth / 2 - (tilesOnYAxis * tileYSpacing / 2) - 10.25 + 15 - (tileYSpacing / 2)}, ${currentCell.clientHeight / 2 - (tilesOnYAxis * tileYSpacing / 2) - 10.25 + 15 - (tileYSpacing / 2)})`)

            var targetCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            targetCircle.setAttribute("cx", (currentCell.clientWidth / 2 - 10))
            targetCircle.setAttribute("cy", (currentCell.clientHeight / 2 - 10))
            targetCircle.setAttribute("r", 10)
            targetCircle.setAttribute("style", "stroke:red; stroke-width: 2; fill: transparent")

            mainTileEditor.appendChild(tileEditorItemChanger)
            mainTileEditor.appendChild(targetCircle)

            currentCell.appendChild(mainTileEditor)
            break
        case "Tile Editor Colors":
            var tileEditorMainMenu = document.createElement("div")
            var tileEditorLabels = ["Red:", "Green:", "Blue:", "Alpha:"]
            var tileEditorColorName = document.createElement("p")
            var tileEditorColorShowcase = document.createElement("div")
            var tileEditorColorRow = document.createElement("div")
            var tileEditorSetColor = [127, 127, 127, 255]

            tileEditorMainMenu.className = "tileEditorMainMenu"
            tileEditorColorShowcase.className = "tileEditorColorShowcase"

            tileEditorColorShowcase.style.width = "40px"
            tileEditorColorShowcase.style.height = "20px"

            tileEditorColorName.innerText = "Resulting Color:"
            tileEditorColorName.style.color = "white"
            tileEditorColorName.style.marginBottom = "0px"

            tileEditorColorRow.style.display = "flex"

            tileEditorColorRow.appendChild(tileEditorColorName)
            tileEditorColorRow.appendChild(tileEditorColorShowcase)

            tileEditorMainMenu.appendChild(tileEditorColorRow)

            for(let tileItterator in tileEditorLabels){
                var tileEditorRow = document.createElement("div")
                var tileEditorLabel = document.createElement("p")
                var tileEditorSlider = document.createElement("input")
                var tileEditorColorLabel = document.createElement("p")

                tileEditorSlider.className = "tileEditorSlider"
                tileEditorLabel.className = "tileEditorLabel"
                tileEditorLabel.style.width = "75px"
                tileEditorColorLabel.className = "tileEditorColorLabel tileEditorLabel"

                tileEditorRow.style.display = "flex"
                tileEditorRow.style.height = "20px"
                tileEditorColorLabel.style.right = "10px"
                tileEditorColorLabel.style.position = "absolute"

                tileEditorSlider.type = "range"
                tileEditorSlider.max = "255"
                tileEditorSlider.value = tileEditorSetColor[tileItterator]
                tileEditorLabel.innerText = tileEditorLabels[tileItterator]
                tileEditorColorLabel.innerText = tileEditorSetColor[tileItterator]

                tileEditorSlider.addEventListener("input", () => {
                    console.log(document.getElementsByClassName("tileEditorColorLabel")[tileItterator])
                    document.getElementsByClassName("tileEditorColorLabel")[tileItterator].innerText = document.getElementsByClassName("tileEditorSlider")[tileItterator].value
                    tileEditorSetColor[tileItterator] = document.getElementsByClassName("tileEditorSlider")[tileItterator].value
                    document.getElementsByClassName("tileEditorColorShowcase")[0].style.backgroundColor = `rgba(${tileEditorSetColor[0]}, ${tileEditorSetColor[1]}, ${tileEditorSetColor[2]}, ${tileEditorSetColor[3]})`
                })

                tileEditorRow.appendChild(tileEditorLabel)
                tileEditorRow.appendChild(tileEditorSlider)
                tileEditorRow.appendChild(tileEditorColorLabel)
                tileEditorMainMenu.appendChild(tileEditorRow)
            }

            currentCell.appendChild(tileEditorMainMenu)
    }
}

function createObjectForDisplay(objectCreator, sceneID){
    var sceneElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    sceneElement.setAttribute("height", menuOptions["Scene Editor"]["objectData"][objectCreator]["height"])
    sceneElement.setAttribute("width", menuOptions["Scene Editor"]["objectData"][objectCreator]["width"])
    sceneElement.setAttribute("x", menuOptions["Scene Editor"]["objectData"][objectCreator]["x"])
    sceneElement.setAttribute("y", menuOptions["Scene Editor"]["objectData"][objectCreator]["y"])
    sceneElement.setAttribute("class", "sceneObject")
    sceneElement.setAttribute("style", "fill: purple; stroke: green; stroke-width: 10;")
    document.getElementsByClassName("sceneEditor")[sceneID].appendChild(sceneElement)
}

function createObjectControls(cellIteration){
    var currentAddObjectButton = document.getElementsByClassName("addObjectButton")[cellIteration]
    var addObjectPrompt = document.createElement("div")
    var objectMenu = menuOptions["Scene Editor"]["objectData"]
    var addObjectSubmitOptions = document.createElement("div")

    for(var addObjectIndex in defaultObjectParameters){
        var addObjectRow = document.createElement("div")
        var addObjectInput = document.createElement("input")
        var addObjectText = document.createElement("p")
        
        addObjectInput.className = "addObjectInput"
        addObjectInput.type = defaultObjectParameters[addObjectIndex][1]
        addObjectInput.value = defaultObjectParameters[addObjectIndex][2]

        addObjectText.style.fontFamily = "monospace"
        addObjectText.innerText = defaultObjectParameters[addObjectIndex][0]

        addObjectRow.style.display = "flex"

        addObjectRow.appendChild(addObjectText)
        addObjectRow.appendChild(addObjectInput)
        addObjectPrompt.appendChild(addObjectRow)
    }

    addObjectPrompt.className = "addObjectPrompt"

    addObjectSubmitOptions.className = "addObjectSubmitOptions"
    addObjectSubmitOptions.innerText = "Add Object"
    objectMenu.push(
        {"name": `Text Box ${document.getElementsByClassName("objectNameLabel").length + 1}`}
    )


    addObjectSubmitOptions.onclick = () => {
        for(var addObjectRetrieve = 0; addObjectRetrieve < defaultObjectParameters.length; addObjectRetrieve++){
            objectMenu[objectMenu.length - 1][defaultObjectParameters[addObjectRetrieve][3]] = document.getElementsByClassName("addObjectInput")[addObjectRetrieve].value
            console.log(objectMenu)
        }
        addObjectControls(document.getElementsByClassName("cell")[cellIteration].getElementsByClassName("mainEditorControls")[0], document.getElementsByClassName("editorItem").length)
        createObjectForDisplay((document.getElementsByClassName("mainEditorControls").length + 1), 0)
        document.getElementsByClassName("addObjectPrompt")[0].remove()
    }

    addObjectPrompt.appendChild(addObjectSubmitOptions)

    document.getElementsByClassName("cell")[cellIteration].appendChild(addObjectPrompt)
}

function addObjectControls(editorID, editorObject){
    console.log("Items for controls are", editorID, editorObject)
    var editorItem = document.createElement("div")
    var expandedControlsImage = document.createElement("img")
    var objectName = document.createElement("p")

    expandedControlsImage.src = "editorControlsFor2DGUI.png"
    expandedControlsImage.className = "expandedControlsImage"
    expandedControlsImage.onclick = ()=>{
        expandControls(editorObject, editorID)
    }
    console.log("I'm getting inputed", editorID)

    objectName.innerText = menuOptions["Scene Editor"]["objectData"][editorObject]["name"]
    objectName.style.display = "inline-block"
    objectName.className = "objectNameLabel"
    
    editorItem.style.float = "left"
    editorItem.className = "editorItem"


    editorItem.appendChild(expandedControlsImage)
    editorItem.appendChild(objectName)
    console.log("Appending", editorItem)
    for(var appendChildIterator = 0; appendChildIterator < document.getElementsByClassName("mainEditorControls").length; appendChildIterator++){
        editorID.appendChild(editorItem)
    }
}

function screenControlsHUD(svgWindow){
    svgWindow = document.getElementsByClassName("sceneEditor")[0]
    var player = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    player.setAttribute("id", "player")
    player.setAttribute("x", Math.floor((svgWindow.clientWidth / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
    player.setAttribute("y", Math.floor((svgWindow.clientHeight / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
    svgWindow.appendChild(player)
}

function expandControls(objectIndex, windowIndex){
    var expandedCellControls = document.getElementsByClassName("editorItem")[objectIndex]
    var expandedControlsObjectMainMenu = document.createElement("div")
    var expandedControlsImage = document.getElementsByClassName("expandedControlsImage")[objectIndex]

    if(expandedControlsImage.style.rotate == "90deg"){
        expandedControlsImage.style.rotate = "0deg"
        document.getElementsByClassName("expandedControlsObjectMainMenu")[0].remove()
        return
    }

    expandedControlsObjectMainMenu.className = "expandedControlsObjectMainMenu"

    for(let expandedControlsItterator in defaultObjectParameters){
        let expandedControlsSlider = document.createElement("input")
        var expandedControlsMenu = document.createElement("div")
        var expandedControlsText = document.createElement("p")
        
        expandedControlsImage.style.rotate = "90deg"
        expandedControlsText.innerText = defaultObjectParameters[expandedControlsItterator][0]
        expandedControlsSlider.type = "number"
        expandedControlsSlider.value = menuOptions["Scene Editor"]["objectData"][objectIndex][defaultObjectParameters[expandedControlsItterator][3]]
        expandedControlsSlider.step = gridSnaping
        expandedControlsMenu.id = `expandedControlsParentObject${objectIndex}`

        expandedControlsSlider.className = "expandedControlsSlider"
        expandedControlsText.className = "expandedControlsText"
        expandedControlsMenu.className = "expandedControlsMenu"

        
        if(expandedControlsItterator == 2 || expandedControlsItterator == 3){
            expandedControlsSlider.min = 0
        }

        expandedControlsSlider.addEventListener("input", () => {
            changeObjectValues(defaultObjectParameters[expandedControlsItterator][3], parseInt(objectIndex), 
            expandedControlsSlider.value)
        })

        expandedControlsMenu.appendChild(expandedControlsText)
        expandedControlsMenu.appendChild(expandedControlsSlider)
        expandedControlsObjectMainMenu.appendChild(expandedControlsMenu)
    }
    
    expandedCellControls.appendChild(expandedControlsObjectMainMenu)
}

function changeObjectValues(property = String, objectIndex = Number, newValue = Number){
    console.log("Getting Inputed", property, objectIndex, newValue)
    var svgShape = document.getElementsByClassName("sceneObject")[objectIndex]
    svgShape.setAttribute(property, parseInt(
        svgShape.getAttribute(property)) - (
            menuOptions["Scene Editor"]["objectData"][objectIndex][property] - newValue
        )
    )
    menuOptions["Scene Editor"]["objectData"][objectIndex][property] = newValue
}

function resizeWindows(events){
    var currentAccessedCell = 0
    var allRows = document.querySelectorAll(".row")
    var allCells = document.querySelectorAll(".cell")
    for(let layOutOfRows in layOut){
        for(let layOutOfCells in layOut[layOutOfRows]){
            console.log("Layout of this is", (allCells[currentAccessedCell]))
            allRows[layOutOfRows].style.width = `calc(${String(100 / layOut.length)}% - ${30 / layOut.length}px)`
            if(String(allCells[currentAccessedCell].className).search("hasSceneEditor") > -1){
                resizeSceneEditor(currentAccessedCell)
            }
            currentAccessedCell += 1
        }
    }
}

function resizeSceneEditor(currentAccessedCell){
    var allCells = document.querySelectorAll(".cell")
    for(var svgShapes = 0; svgShapes < document.getElementsByClassName("sceneEditor").length; svgShapes++){
        var svgShape = document.getElementsByClassName("sceneObject")[svgShapes]
        console.log(svgShape)
        console.log("X is", Math.floor((allCells[currentAccessedCell].clientWidth - menuOptions["Scene Editor"]["screenData"][2]) / 2))
        svgShape.setAttribute("x", (Math.floor((allCells[currentAccessedCell].clientWidth - menuOptions["Scene Editor"]["screenData"][2]) / 2) + parseInt(menuOptions["Scene Editor"]["objectData"][svgShapes]["x"])))
        svgShape.setAttribute("y", (Math.floor((allCells[currentAccessedCell].clientHeight - menuOptions["Scene Editor"]["screenData"][3]) / 2)  + parseInt(menuOptions["Scene Editor"]["objectData"][svgShapes]["y"])))
    }
    document.getElementById("player").setAttribute("x", Math.floor((allCells[currentAccessedCell].clientWidth / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
    document.getElementById("player").setAttribute("y", Math.floor((allCells[currentAccessedCell].clientHeight / 2 - 12) / gridSnaping + 0.5) * gridSnaping)
}

function horMoveDivider(e){
    for(var dividerClass = 0; dividerClass < document.getElementsByClassName("horizontalDivider").length; dividerClass++){
        var allRows = document.querySelectorAll(".row")
        var allCells = document.querySelectorAll(".cell")
        var currentDivider = document.getElementsByClassName("horizontalDivider")[dividerClass]
        var firstHalf = allRows[currentDivider.id.toString().replace("horizontal", "")[0]]
        var secondHalf = allRows[currentDivider.id.toString().replace("horizontal", "")[1]]

        console.log("The Class Name is", document.getElementsByClassName("cell")[0].className)
        secondHalf.style.width = `${((secondHalf.clientWidth + firstHalf.clientWidth) - (e.clientX - 25))}px`
        firstHalf.style.width = `${(e.clientX - 25)}px`

        console.log("Selected Elements for rows are", firstHalf, secondHalf)
        console.log("Number of rows are", allRows.length)
    
        console.log("Multiple Cells for", Math.floor(firstHalf.childNodes.length / 2) + 1, Math.floor(secondHalf.childNodes.length) + 1)
        for(var cellIndexSearch = 0; cellIndexSearch < document.getElementsByClassName("cell").length; cellIndexSearch++){
            console.log("Checking for instance", (allCells[cellIndexSearch].getAttributeNode("class").value))
            if((allCells[cellIndexSearch].getAttributeNode("class")).value.includes("hasSceneEditor")){
                console.log("Detected for a Scene Editor")
                resizeSceneEditor(cellIndexSearch)
            }
        }
    }
}
function vertMoveDivider(e){
    var allCells = document.getElementsByClassName("cell")
    for(var dividerClass = 0; dividerClass < document.getElementsByClassName("verticalDivider").length; dividerClass++){
        var currentDivider = document.getElementsByClassName("verticalDivider")[dividerClass]
        var flexableElements = currentDivider.id.toString().replace("vertical", "").split(",")
        var selectedRow = document.querySelectorAll(".row")[flexableElements[0]]
        var firstHalf = selectedRow.getElementsByClassName("cell")[flexableElements[1]];
        var secondHalf = selectedRow.getElementsByClassName("cell")[flexableElements[2]];
        
        console.log(`Selected Row ${selectedRow}, accessing cells ${firstHalf} ${secondHalf}`)
        secondHalf.style.height = `${((secondHalf.clientHeight + firstHalf.clientHeight) - (e.clientY - 60))}px`
        firstHalf.style.height = `${(parseInt(e.clientY) - 60)}px`
        for(var cellIndexSearch = 0; cellIndexSearch < document.getElementsByClassName("cell").length; cellIndexSearch++){
            console.log("Checking for instance", (allCells[cellIndexSearch].getAttributeNode("class").value))
            if((allCells[cellIndexSearch].getAttributeNode("class")).value.includes("hasSceneEditor")){
                console.log("Detected for a Scene Editor")
                resizeSceneEditor(cellIndexSearch)
            }
        }
    }
}

function saveData(){
    var loginPromptBackground = document.createElement("div")
    var loginPrompt = document.createElement("div")
    var loginPromptHeaderBar = document.createElement("div")
    var loginPromptHeaderBarCloseButton = document.createElement("div")
    var loginPromptHeaderBarTitle = document.createElement("div")
    var loginPromptSaveButton = document.createElement("button") 
    var loginPromptOptions = [
        ["UserName", "text", ""],
        ["Password", "password", ""],
    ]

    loginPromptBackground.className = "settingsPromptBackgroundColor"
    loginPrompt.className = "settingsPrompt"
    loginPromptHeaderBar.className = "settingsPromptHeaderBar"
    loginPromptHeaderBarTitle.className = "settingsPromptHeaderBarTitle"
    loginPromptHeaderBarCloseButton.className = "settingsPromptCloseButton"
    loginPromptSaveButton.className = "settingsPromptSaveButton" 

    // Work on sliders for Grid spacing / player controls

    loginPromptHeaderBarCloseButton.innerText = "X"
    loginPromptSaveButton.innerText = "Login"
    loginPromptHeaderBarTitle.innerText = "Save Data"
    loginPromptHeaderBarCloseButton.onclick = () => {
        document.getElementsByClassName("settingsPromptBackgroundColor")[0].remove()
        menuOptions["Scene Editor"]["player"]["canMove"] = true
    }
    menuOptions["Scene Editor"]["player"]["canMove"] = false
    loginPromptSaveButton.onclick = () => {saveSettingChanges()}

    loginPromptHeaderBar.appendChild(loginPromptHeaderBarTitle)
    loginPromptHeaderBar.appendChild(loginPromptHeaderBarCloseButton)
    loginPrompt.appendChild(loginPromptHeaderBar)

    for(var loginPromptOptionsIterator in loginPromptOptions){
        var loginPromptOptionLabel = document.createElement("p")
        var loginPromptOptionInput = document.createElement("input")
        var loginPromptOptionDiv = document.createElement("div")

        loginPromptOptionLabel.innerText = loginPromptOptions[loginPromptOptionsIterator][0]
        loginPromptOptionInput.type = loginPromptOptions[loginPromptOptionsIterator][1]
        loginPromptOptionInput.value = loginPromptOptions[loginPromptOptionsIterator][2]
        if(loginPromptOptions[loginPromptOptionsIterator][1] == "checkbox"){
            loginPromptOptionInput.setAttribute("checked", loginPromptOptions[loginPromptOptionsIterator][2])
        }

        loginPromptOptionLabel.className = "settingsPromptOptionLabel"
        loginPromptOptionInput.className = "loginPromptOptionInput"
        loginPromptOptionDiv.style.display = "flex"
        loginPromptOptionDiv.style.paddingLeft = "10px"

        loginPromptOptionDiv.appendChild(loginPromptOptionLabel)
        loginPromptOptionDiv.appendChild(loginPromptOptionInput)
        loginPrompt.appendChild(loginPromptOptionDiv)
    }
    loginPrompt.appendChild(loginPromptSaveButton)
    loginPromptBackground.appendChild(loginPrompt)
    document.getElementById("mainContainer").appendChild(loginPromptBackground)
}

startUp()
window.addEventListener("mousemove", function (e) {

    vertIsMouseDown.forEach((vertIsInRange) => {
        if(vertIsInRange[0] == true){
            vertMoveDivider(e)
        }
    })
    horIsMouseDown.forEach((horIsInRange) => {
        if(horIsInRange[0] == true){
            horMoveDivider(e)
        }
    })
})
window.addEventListener("resize", function (e) {
    setTimeout(resizeWindows(e), 0)
})
window.addEventListener("mousedown", function (e) {
    for(var horizontalDividerClass = 0; horizontalDividerClass < document.getElementsByClassName("horizontalDivider").length; horizontalDividerClass++){
        var currentHorizontalDivider = document.getElementsByClassName("horizontalDivider")[horizontalDividerClass]
        if(e.clientX >= currentHorizontalDivider.getBoundingClientRect().x && 
        (currentHorizontalDivider.getBoundingClientRect().x + currentHorizontalDivider.clientWidth) >= e.clientX){
            horIsMouseDown[horizontalDividerClass] = [true]
        }
    }
    for(var verticalDividerClass = 0; verticalDividerClass < document.getElementsByClassName("verticalDivider").length; verticalDividerClass++){
        var currentVerticalDivider = document.getElementsByClassName("verticalDivider")[verticalDividerClass]
        if(e.clientY >= currentVerticalDivider.getBoundingClientRect()["y"] && 
        ((currentVerticalDivider.getBoundingClientRect().y + currentVerticalDivider.clientHeight) >= e.clientY) && 
        (e.clientX >= currentVerticalDivider.getBoundingClientRect().x) && 
        ((currentVerticalDivider.getBoundingClientRect().x + currentVerticalDivider.clientWidth) >= e.clientX)){
            console.log("Is called for Vertical data")
            vertIsMouseDown[verticalDividerClass] = [true]
        }
    }
})

window.addEventListener("mouseup", function(e){
    horIsMouseDown = horIsMouseDown.map((setValue) => [false])
    vertIsMouseDown = vertIsMouseDown.map((setValue) => [false])
})

var menu = document.getElementById("mainContainer");
document.addEventListener("keydown", function(event){
    if((event.metaKey && event.key == "F") || (event.ctrlKey && event.key == "F")){
        event.preventDefault()
        if(document.fullscreenElement){
            document.exitFullscreen() 
        }
        else{
            menu.requestFullscreen()
        }
    } else if(menuOptions["Scene Editor"]["player"]["canMove"]) {
        switch(event.key){
            case "w":
                movePlayer(0, menuOptions["Scene Editor"]["player"]["speed"] * gridSnaping)
                break
            case "a":
                movePlayer(menuOptions["Scene Editor"]["player"]["speed"] * gridSnaping, 0)
                break
            case "s":
                movePlayer(0, -menuOptions["Scene Editor"]["player"]["speed"] * gridSnaping)
                break
            case "d":
                movePlayer(-menuOptions["Scene Editor"]["player"]["speed"] * gridSnaping, 0)
                break

        }
    }
})

function movePlayer(x, y){
    for(var sceneObjectIndex = 0; sceneObjectIndex < document.getElementsByClassName("sceneObject").length; sceneObjectIndex++){
        var currentSceneObject = document.getElementsByClassName("sceneObject")[sceneObjectIndex]
        currentSceneObject.setAttribute("x", (parseInt(currentSceneObject.getAttribute("x")) + x))
        currentSceneObject.setAttribute("y", (parseInt(currentSceneObject.getAttribute("y")) + y))
    }
}

var settingsIsOpened = true
document.getElementById("cellSettingsOpener").onclick = function(){
    
    if(settingsIsOpened == false){
        settingsIsOpened = true
        cellSettingsControls.style.right = -(cellSettingsControls.clientWidth - 10) + "px" 
        cellSettingsOpener.style.right = `10px`
        cellSettingsOpener.innerText = "<"
        return
    }
    settingsIsOpened = false
    cellSettingsOpener.style.right = (cellSettingsControls.clientWidth) + "px"
    cellSettingsControls.style.right = "0px" 
    cellSettingsOpener.innerText = ">"
}

preloadCellSettings()

function preloadCellSettings(){
    var cellSettingsOpener = document.getElementById("cellSettingsOpener")
    var cellSettingsControls = document.getElementById("cellSettingsControls")
    var cellType = []
    layOut.forEach((row, rowID) => {
        row.forEach((cell) =>{
            cellType.push([cell, rowID])
        })
    })

    cellSettingsControls.getElementsByTagName("input")[1].addEventListener("input", (e) => {
        var currentSelectedCellValue = document.getElementsByClassName("currentSelectedCellValue")[0]
        console.log(currentSelectedCellValue.getAttribute("id").split(" ")[0], Math.ceil(document.getElementsByClassName("row")[currentSelectedCellValue.getAttribute("id").split(" ")[0]].children.length / 2))
        document.getElementsByClassName("cell")[currentSelectedCellValue.getAttribute("id").split(" ")[1]].lastChild.style.height = `calc(
            ${100}%
        - ${e.target.value}px)`
        console.log(e.target.value)
    })

    console.log("CellType is", cellType)
    for(let cellIteration in cellType){
        let cellButtonControl = document.createElement("button")
        cellButtonControl.className = "cellButtonControls"
        cellButtonControl.style.minWidth = String(100/document.querySelectorAll(".row").length) + "%"
        cellButtonControl.innerText = `Cell ${parseInt(cellIteration)}`
        cellButtonControl.style.width = (100/(cellType[0].length)) + "%"
        cellButtonControl.onclick = () => {switchCellSelect(cellType[cellIteration], cellIteration)}
        cellSettingsControls.appendChild(cellButtonControl)
    }
}

function switchCellSelect(cellData, cellNumber){
    var extractCellHeight = String(document.getElementsByClassName("cell")[cellNumber].lastElementChild.style.height).split(" - ")
    console.log("Extracting Last element", document.getElementsByClassName("cell")[cellNumber].lastElementChild.style.height)
    console.log("Current Height Offset is", extractCellHeight[1].slice(0, extractCellHeight[1].search("px")))
    console.log("Current Selected Cell Value", document.getElementsByClassName("currentSelectedCellValue")[0].getAttribute("id"))
    console.log("Cell number is", cellNumber, "value for width is", document.getElementById("cellSettingsControls").getElementsByTagName("input")[0].value, document.getElementById("cellSettingsControls").getElementsByTagName("input")[1].value)

    document.getElementsByClassName("currentSelectedCellValue")[0].id = String(cellData[1]) + " " + String(cellNumber)
    
    document.getElementById("cellSettingsControls").getElementsByTagName("input")[1].value = extractCellHeight[1].slice(0, extractCellHeight[1].search("px"))

    document.getElementsByClassName("cell")[cellNumber].lastChild.style.height = `calc(100% - 
        ${document.getElementById("cellSettingsControls").getElementsByTagName("input")[1].value}px)`
}
