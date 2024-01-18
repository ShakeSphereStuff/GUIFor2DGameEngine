var cell = document.getElementsByClassName("cell")
var horIsMouseDown = Array(document.getElementsByClassName("horizontalDivider").length).fill(false)
var vertIsMouseDown = Array(document.getElementsByClassName("verticalDivider").length).fill(false)
var layOutSelectionMenu = [
    {
        "name": "Coding Layout",
        "layOut":[["Scene Editor"], ["Javascript API", "Editor Controls"]]
    },
    {
        "name": "Tile Layout",
        "layOut":[["Scene Editor"], ["Javascript API", "Tile Editor"]]
    }
]
var layOut = [["Scene Editor"], ["Tile Editor", "Editor Controls"]]
var cellModes = ["Scene Editor", "Editor Controls", "Tile Editor", "Javascript Runner"]
var allCells = document.querySelectorAll(".cell")
var allRows = document.querySelectorAll(".row")
var menuOptions = {
    "Scene Editor" : {
        "objectData" : [{"name": "Test Box", "x": 10, "y":10, "width": 100, "height": 150}], // Holds all objects in Scene, Tile Values, Has Collision, i.e., {"x": 0, "y": 0}
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
    ["showPlayer", "checkbox", true],
    ["gridSnaping(nextPush)", "range", 1],
    ["playerSpeed", "range", 5]
]

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
            cellsToAppend.push(layOut[layOutOfRows][layOutOfCells])
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

    for(var settingsPromptOptionsIterator in settingsPromptOptions){
        var settingsPromptOptionLabel = document.createElement("p")
        var settingsPromptOptionInput = document.createElement("input")
        var settingsPromptOptionDiv = document.createElement("div")

        settingsPromptOptionLabel.innerText = settingsPromptOptions[settingsPromptOptionsIterator][0]
        settingsPromptOptionInput.type = settingsPromptOptions[settingsPromptOptionsIterator][1]
        settingsPromptOptionInput.value = settingsPromptOptions[settingsPromptOptionsIterator][2]
        if(settingsPromptOptions[settingsPromptOptionsIterator][1] == "checkbox"){
            settingsPromptOptionInput.setAttribute("checked", settingsPromptOptions[settingsPromptOptionsIterator][2])
        }

        settingsPromptOptionLabel.className = "settingsPromptOptionLabel"
        settingsPromptOptionInput.className = "settingsPromptOptionInput"
        settingsPromptOptionDiv.style.display = "flex"
        settingsPromptOptionDiv.style.paddingLeft = "10px"

        settingsPromptOptionDiv.appendChild(settingsPromptOptionLabel)
        settingsPromptOptionDiv.appendChild(settingsPromptOptionInput)
        settingsPrompt.appendChild(settingsPromptOptionDiv)
    }
    settingsPrompt.appendChild(settingsPromptSaveButton)
    settingsPromptBackground.appendChild(settingsPrompt)
    document.getElementById("mainContainer").appendChild(settingsPromptBackground)
}

function saveSettingChanges(){
    for(var settingsPromptOptionItterator = 0; settingsPromptOptionItterator < document.getElementsByClassName("settingsPromptOptionInput").length; settingsPromptOptionItterator++){
        var settingsPromptCurrentOption = document.getElementsByClassName("settingsPromptOptionInput")[settingsPromptOptionItterator]
        console.log(settingsPromptCurrentOption)
        switch(settingsPromptOptionItterator){
            case 0:
                if(settingsPromptCurrentOption.checked){
                    document.getElementById("player").style.display = "inline"
                }
                else{
                    document.getElementById("player").style.display = "none"
                }
                break
            case 1:
                break
            case 2:
                menuOptions["Scene Editor"]["player"]["speed"] = parseInt(settingsPromptCurrentOption.value) 
                settingsPromptOptions[2][2] = parseInt(settingsPromptCurrentOption.value)
        }
    }
    document.getElementsByClassName("settingsPromptBackgroundColor")[0].remove()
}

function createDropdown(currentCell, cellAssignment){
    var dropDown = document.createElement("select");
        
    dropDown.onchange = function(){changeCell(currentCell, cellAssignment)};
    dropDown.className = "menuSelector"

    for(var selectOption in cellModes){
        var dropDownOption = document.createElement("option");
        dropDownOption.innerText = cellType[selectOption];
        if(selectOption == cellAssignment){
            dropDownOption.selected = "true"
        }
        dropDown.appendChild(dropDownOption);
    }

    var header = document.createElement("div")
    header.className = "header";

    header.appendChild(dropDown)
    document.getElementsByClassName("cell")[cellAssignment].appendChild(header);
}

function startUp(){
    cellType = compileWindows()
    for(let current = 0; current < cell.length; current++){
        let currentCell = document.getElementsByClassName("cell")[current]

        createDropdown(currentCell, current)
        selectMode(current, cellType)
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
    var cellArray = Array.from(Array(cellID), () => {return null})
    cellArray.push(typeOfCell.getElementsByClassName("menuSelector")[0].value)
    createDropdown(document.getElementsByClassName("cell")[cellID], cellID)
    selectMode(cellID, cellArray)
}

function clearCell(cellID){
    var cellsToDelete = document.getElementsByClassName("cell")[cellID]
    while(cellsToDelete.firstChild){
        cellsToDelete.removeChild(cellsToDelete.firstChild)
    }
}

function selectMode(cellIteration, cellPosition){
    var header = document.createElement("div");
    var currentCell = document.getElementsByClassName("cell")[cellIteration]; 
    var cellAssignment = cellPosition[cellIteration]
    switch(cellAssignment){
        case "Scene Editor":
            var sceneEditor = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            var sceneElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")

            for(var objectCreator in (menuOptions["Scene Editor"]["objectData"])){
                sceneElement.setAttribute("height", menuOptions["Scene Editor"]["objectData"][objectCreator]["height"])
                sceneElement.setAttribute("width", menuOptions["Scene Editor"]["objectData"][objectCreator]["width"])
                sceneElement.setAttribute("x", menuOptions["Scene Editor"]["objectData"][objectCreator]["x"])
                sceneElement.setAttribute("y", menuOptions["Scene Editor"]["objectData"][objectCreator]["y"])
                sceneElement.setAttribute("class", "sceneObject")
                sceneElement.setAttribute("style", "fill: purple; stroke: green; stroke-width: 10;")
            }

            sceneEditor.setAttribute("class", "sceneEditor")
            sceneEditor.setAttribute("x", 0)
            sceneEditor.setAttribute("y", 0)
            sceneEditor.setAttribute("width", currentCell.clientWidth - 1)
            sceneEditor.setAttribute("height", currentCell.clientHeight - 14)
            sceneEditor.xmlns = "http://www.w3.org/2000/svg"
            sceneEditor.setAttribute("viewbox", `0 0 ${currentCell.clientWidth - 1} ${currentCell.clientHeight - 14}`)

            menuOptions["Scene Editor"]["screenData"].push(0, 0, currentCell.clientWidth, currentCell.clientHeight)

            sceneEditor.appendChild(sceneElement)

            currentCell.appendChild(sceneEditor)
            currentCell.className += " hasSceneEditor"
            break
        case "Editor Controls":
            var mainEditorControls = document.createElement("div")
            mainEditorControls.className = "mainEditorControls"

            for(var editorObject in menuOptions["Scene Editor"]["objectData"]){
                var editorItem = document.createElement("div")
                var expandedControlsImage = document.createElement("img")
                var objectName = document.createElement("p")

                expandedControlsImage.src = "editorControlsFor2DGUI.png"
                expandedControlsImage.className = "expandedControlsImage"
                expandedControlsImage.onclick = ()=>{
                    expandControls(editorObject, cellIteration)
                }

                objectName.innerText = menuOptions["Scene Editor"]["objectData"][editorObject]["name"]
                objectName.style.display = "inline-block"
                objectName.className = "objectNameLabel"
                
                editorItem.style.float = "left"
                editorItem.className = "editorItem"

                editorItem.appendChild(expandedControlsImage)
                editorItem.appendChild(objectName)
                mainEditorControls.appendChild(editorItem)
                screenControlsHUD(document.getElementsByClassName("sceneEditor").length - 1)
            }
            currentCell.appendChild(mainEditorControls)
            break
        
        case "Javascript API":
            break

        case "Tile Editor":
            break
        
    }
}

function screenControlsHUD(windowID){
    var svgWindow = document.getElementsByClassName("sceneEditor")[windowID]
    var player = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    player.setAttribute("id", "player")
    player.setAttribute("x", svgWindow.clientWidth / 2 - 12)
    player.setAttribute("y", svgWindow.clientHeight / 2 - 12)
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

    var expandedControlsXSlider = document.createElement("input")
    var expandedControlsYSlider = document.createElement("input")
    var expandedControlsWidthSlider = document.createElement("input")
    var expandedControlsHeightSlider = document.createElement("input")

    var expandedControlsXMenu = document.createElement("div")
    var expandedControlsYMenu = document.createElement("div")
    var expandedControlsWidthMenu = document.createElement("div")
    var expandedControlsHeightMenu = document.createElement("div")

    var expandedControlsXText = document.createElement("p")
    var expandedControlsYText = document.createElement("p")
    var expandedControlsWidthText = document.createElement("p")
    var expandedControlsHeightText = document.createElement("p")
    
    expandedControlsImage.style.rotate = "90deg"

    expandedControlsXText.innerText = "X: "
    expandedControlsYText.innerText = "Y: "
    expandedControlsWidthText.innerText = "Width: "
    expandedControlsHeightText.innerText = "Height: "

    expandedControlsXSlider.type = "number"
    expandedControlsYSlider.type = "number"
    expandedControlsWidthSlider.type = "number"
    expandedControlsHeightSlider.type = "number"

    expandedControlsXSlider.className = "expandedControlsSlider"
    expandedControlsYSlider.className = "expandedControlsSlider"
    expandedControlsWidthSlider.className = "expandedControlsSlider"
    expandedControlsHeightSlider.className = "expandedControlsSlider"
    expandedControlsObjectMainMenu.className = "expandedControlsObjectMainMenu"

    expandedControlsXText.className = "expandedControlsText"
    expandedControlsYText.className = "expandedControlsText"
    expandedControlsWidthText.className = "expandedControlsText"
    expandedControlsHeightText.className = "expandedControlsText"

    expandedControlsXMenu.className = "expandedControlsMenu"
    expandedControlsYMenu.className = "expandedControlsMenu"
    expandedControlsWidthMenu.className = "expandedControlsMenu"
    expandedControlsHeightMenu.className = "expandedControlsMenu"

    expandedControlsXSlider.value = menuOptions["Scene Editor"]["objectData"][objectIndex]["x"]
    expandedControlsYSlider.value = menuOptions["Scene Editor"]["objectData"][objectIndex]["y"]
    expandedControlsWidthSlider.value = menuOptions["Scene Editor"]["objectData"][objectIndex]["width"]
    expandedControlsHeightSlider.value = menuOptions["Scene Editor"]["objectData"][objectIndex]["height"]

    expandedControlsXSlider.addEventListener("input", () => {changeObjectValues("X", objectIndex, expandedControlsXSlider.value)})
    expandedControlsYSlider.addEventListener("input", () => {changeObjectValues("Y", objectIndex, expandedControlsYSlider.value)})
    expandedControlsWidthSlider.addEventListener("input", () => {changeObjectValues("Width", objectIndex, expandedControlsWidthSlider.value)})
    expandedControlsHeightSlider.addEventListener("input", () => {changeObjectValues("Height", objectIndex, expandedControlsHeightSlider.value)})

    expandedControlsXMenu.appendChild(expandedControlsXText)
    expandedControlsYMenu.appendChild(expandedControlsYText)
    expandedControlsWidthMenu.appendChild(expandedControlsWidthText)
    expandedControlsHeightMenu.appendChild(expandedControlsHeightText)

    expandedControlsXMenu.appendChild(expandedControlsXSlider)
    expandedControlsYMenu.appendChild(expandedControlsYSlider)
    expandedControlsWidthMenu.appendChild(expandedControlsWidthSlider)
    expandedControlsHeightMenu.appendChild(expandedControlsHeightSlider)

    expandedControlsObjectMainMenu.appendChild(expandedControlsXMenu)
    expandedControlsObjectMainMenu.appendChild(expandedControlsYMenu)
    expandedControlsObjectMainMenu.appendChild(expandedControlsWidthMenu)
    expandedControlsObjectMainMenu.appendChild(expandedControlsHeightMenu)
    
    expandedCellControls.appendChild(expandedControlsObjectMainMenu)
}

function changeObjectValues(property = String, objectIndex = Number, newValue = Number){
    var svgShape = document.getElementsByClassName("sceneObject")[objectIndex]
    switch(property){
        case "X":
            document.getElementsByClassName("sceneObject")[objectIndex].setAttribute("x", Math.floor((svgShape.parentElement.clientWidth - menuOptions["Scene Editor"]["screenData"][2]) / 2) + parseInt(newValue))
            menuOptions["Scene Editor"]["objectData"][objectIndex]["x"] = newValue
            break
        case "Y":
            document.getElementsByClassName("sceneObject")[objectIndex].setAttribute("y", Math.floor((svgShape.parentElement.clientWidth - menuOptions["Scene Editor"]["screenData"][3]) / 2) + parseInt(newValue))
            menuOptions["Scene Editor"]["objectData"][objectIndex]["y"] = newValue
            break
        case "Width": 
            document.getElementsByClassName("sceneObject")[objectIndex].setAttribute("width", newValue)
            menuOptions["Scene Editor"]["objectData"][objectIndex]["width"] = newValue
            break
        case "Height":
            document.getElementsByClassName("sceneObject")[objectIndex].setAttribute("height", newValue)
            menuOptions["Scene Editor"]["objectData"][objectIndex]["height"] = newValue
            break
    }
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
    document.getElementById("player").setAttribute("x", allCells[currentAccessedCell].clientWidth / 2 - 12)
    document.getElementById("player").setAttribute("y", allCells[currentAccessedCell].clientHeight / 2 - 12)
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
        secondHalf.style.height = `${((secondHalf.clientHeight + firstHalf.clientHeight) - (e.clientY - 70))}px`

        secondHalf.style.height = `${((secondHalf.clientHeight + firstHalf.clientHeight) - (e.clientY - 70))}px`
        firstHalf.style.height = `${(e.clientY - 70)}px`
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
        console.log(`The Current Horizontal Divider is ${currentHorizontalDivider}`)
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
    } else if(event.key == "w" && menuOptions["Scene Editor"]["player"]["canMove"]){
        movePlayer(0, menuOptions["Scene Editor"]["player"]["speed"])
    } else if(event.key == "a" && menuOptions["Scene Editor"]["player"]["canMove"]){
        movePlayer(menuOptions["Scene Editor"]["player"]["speed"], 0)
    } else if(event.key == "s" && menuOptions["Scene Editor"]["player"]["canMove"]){
        movePlayer(0, -menuOptions["Scene Editor"]["player"]["speed"])
    } else if(event.key == "d" && menuOptions["Scene Editor"]["player"]["canMove"]){
        movePlayer(-menuOptions["Scene Editor"]["player"]["speed"], 0)
    }
})

function movePlayer(x, y){
    for(var sceneObjectIndex = 0; sceneObjectIndex < document.getElementsByClassName("sceneObject").length; sceneObjectIndex++){
        var currentSceneObject = document.getElementsByClassName("sceneObject")[sceneObjectIndex]
        currentSceneObject.setAttribute("x", (parseInt(currentSceneObject.getAttribute("x")) + x))
        currentSceneObject.setAttribute("y", (parseInt(currentSceneObject.getAttribute("y")) + y))
        menuOptions["Scene Editor"]["objectData"][sceneObjectIndex]["x"] = parseInt(currentSceneObject.getAttribute("x")) + x
        menuOptions["Scene Editor"]["objectData"][sceneObjectIndex]["y"] = parseInt(currentSceneObject.getAttribute("y")) + y
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
