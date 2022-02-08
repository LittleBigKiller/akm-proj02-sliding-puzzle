var puzzle = {
    leftImg: null,
    rightImg: null,
    img : null,
    arr_left : null,
    arr_right : null,
    doCheckWin : false,
    img_src : [],
    table : [],
    empty : {},
    lastClicked : 0,
    randomCounter : 0,
    delayMaster : 10,
    container : null,
    imgContainer : null,
    timer : null,
    startTime : null,
    currentTime : null,
    timerCells : [],
    initCalled : false,
    mode : '',
    records : [],
    imgId : 0,
    busy : false,
    init : function () {
        this.createTimer(puzzle.img)
        this.createContainer(puzzle.img)
        puzzle.initCalled = true
        puzzle.records = document.cookie.split(';')
        for (let i = 0; i < puzzle.records.length; i++) {
            puzzle.records[i] = puzzle.records[i][0] == ' ' ? puzzle.records[i].substr(1) : puzzle.records[i]
            puzzle.records[i] = puzzle.records[i].slice(' ')
        }
        if (puzzle.records[0] == '')
            puzzle.records = []
        //console.log(puzzle.records)
    },
    createArrows : function (img) {
        var arr_left = document.createElement('button')
        puzzle.arr_left = arr_left
        arr_left.style.backgroundImage = 'url(img/arrow.png)'
        arr_left.className = "arr"
        arr_left.style.left = '-128px'
        arr_left.style.transform = 'rotate(180deg)'
        puzzle.container.appendChild(arr_left)
        arr_left.addEventListener('click', function () {
            if (!puzzle.busy) {
                puzzle.busy = true
                puzzle.switchImg(true)
            }
        })

        var arr_right = document.createElement('button')
        puzzle.arr_right = arr_right
        arr_right.style.backgroundImage = 'url(img/arrow.png)'
        arr_right.className = "arr"
        arr_right.style.right = '-128px'
        puzzle.container.appendChild(arr_right)
        arr_right.addEventListener('click', function () {
            if (!puzzle.busy) {
                puzzle.busy = true
                puzzle.switchImg(false)
            }
        })
    },
    checkArrows : function () {
        puzzle.arr_left.removeAttribute('disabled')
        puzzle.arr_right.removeAttribute('disabled')

        if (puzzle.imgId == 0) {
            puzzle.arr_left.setAttribute('disabled', true)
            //console.log(puzzle.imgId)
        }
        if (puzzle.imgId == puzzle.imgContainer.children.length - 1)
            puzzle.arr_right.setAttribute('disabled', true)
    },
    switchImg : function (toLeft) {
        if (toLeft)
            puzzle.imgId--
        else
            puzzle.imgId++

        if (puzzle.imgId == puzzle.img_src.length)
            puzzle.imgId = 0
        else if (puzzle.imgId < 0)
            puzzle.imgId = puzzle.img_src.length - 1
        
        //puzzle.checkArrows()

        //puzzle.scrollLeftTo(puzzle.imgContainer, puzzle.imgId * 300)
        console.error(toLeft)
        puzzle.scrollImg(puzzle.imgContainer, toLeft)
    },
    scrollImg : function (obj, toLeft) {
        puzzle.leftImg.src = puzzle.img_src[puzzle.imgId]
        puzzle.rightImg.src = puzzle.img_src[puzzle.imgId]

        let counter = puzzle.imgContainer.scrollLeft
        let step = 4

        function scrollStep () {
            console.log(obj.scrollLeft)
            console.log(toLeft)
            if (toLeft)
                obj.scrollLeft -= step
            else
                obj.scrollLeft += step
            
            counter -= step

            if (counter != 0)
                setTimeout(scrollStep, 1)
            else {
                puzzle.img.src = puzzle.img_src[puzzle.imgId]
                setTimeout(function () {
                    puzzle.imgContainer.scrollLeft = 300
                    puzzle.busy = false
                }, 100)
            }
        }

        setTimeout(scrollStep, 100)
    },
    scrollLeftTo : function (obj, target) {
        
        let difference = Math.abs(obj.scrollLeft - target)
        let step = difference/76
            
        function scrollStep () {
            if (target/300 > obj.scrollLeft/300)
                obj.scrollLeft += step
            else
                obj.scrollLeft -= step
            difference = Math.abs(obj.scrollLeft - target)
            
            if (difference != 0)
                setTimeout(scrollStep, 1)
            else
                puzzle.busy = false
        }

        scrollStep()
    },
    createImgCont : function (img) {
        var el = document.createElement("DIV")
        el.className = "img_container"
        el.width = img.width * puzzle.img_src.length + 'px'
        document.body.appendChild(el)
        puzzle.imgContainer = el
    },
    createMain : function (img) {
        var el = document.createElement("DIV")
        el.className = "main_container"
        el.width = img.width
        el.style.margin = '0 auto'
        document.body.appendChild(el)
        puzzle.container = el
    },
    createContainer : function (img) {
        // Create Tile Container
        //console.log(img)
        var el = document.createElement("DIV")
        el.className = "tile_container"
        el.order = 3
        el.width = img.width
        el.height = img.height
        puzzle.container.appendChild(el)
    },
    createButtons : function (img) {
        var cont = document.createElement("DIV")
        cont.className = "button_container"
        cont.order = 2
        cont.width = img.width
        cont.height = img.height
        puzzle.container.appendChild(cont)
        for (let i = 2; i < 7; i++) {
            var el = document.createElement("button")
            el.innerHTML = i + "x" + i
            el.addEventListener("click", function () {
                if (!puzzle.initCalled)
                    puzzle.init(puzzle.img)
                var tc = document.getElementsByClassName("tile_container")[0]
                puzzle.randomCounter = 0
                clearInterval(puzzle.timer)
                tc.innerHTML = ""
                puzzle.createTimer(puzzle.img)
                puzzle.createTiles(i, img)
                puzzle.mode = 'm' + i + 'x' + i
            })
            el.className = "button"
            cont.appendChild(el)
        }
    },
    createTiles : function (amount, img) {
        var tc = document.getElementsByClassName("tile_container")[0]
        var img = document.getElementsByClassName("prev_img")[0]
        for (let i = 0; i < amount; i++) {
            this.table[i] = []
            for (let j = 0; j < amount; j++) {
                this.table[i][j] = i * amount + j
                if (!(i == amount - 1 && j == amount - 1)) {
                    var el = document.createElement("div")
                    el.className = "tile"
                    tc.appendChild(el)
                    el.style.left = img.width/amount * i + "px"
                    el.style.width = img.width/amount + "px"
                    el.style.top = img.height/amount * j + "px"
                    el.style.height = img.height/amount + "px"
                    el.style.backgroundImage = "url(" + puzzle.img_src[puzzle.imgId] + ")"
                    el.style.backgroundSize = img.width + "px"
                    el.style.backgroundPositionX = "-" + el.style.left
                    el.style.backgroundPositionY = "-" + el.style.top
                    el.id = i * amount + j
                    el.addEventListener("click", function(e){
                        //console.error("KEK")
                        let dimen = e.target.style.width.slice(0,-2)
                        let posX = e.target.style.left.slice(0,-2)
                        let posY = e.target.style.top.slice(0,-2)
                        let ePosX = puzzle.empty.style.left.slice(0,-2)
                        let ePosY = puzzle.empty.style.top.slice(0,-2)

                        let ti = parseInt(posX / dimen)
                        let tj = parseInt(posY / dimen)

                        if (posX - ePosX == dimen) {
                            if (posY - ePosY == 0) {
                                //console.warn(0)
                                e.target.style.left = ePosX + "px"
                                puzzle.empty.style.left = posX + "px"
                                puzzle.table[ti][tj] = parseInt(puzzle.empty.id)
                                puzzle.table[ti - 1][tj] = parseInt(e.target.id)
                            }
                        } else if (posX - ePosX == -dimen) {
                            if (posY - ePosY == 0) {
                                //console.warn(1)
                                e.target.style.left = ePosX + "px"
                                puzzle.empty.style.left = posX + "px"
                                puzzle.table[ti][tj] = parseInt(puzzle.empty.id)
                                puzzle.table[ti + 1][tj] = parseInt(e.target.id)
                            }
                        } else if (posY - ePosY == dimen) {
                            if (posX - ePosX == 0) {
                                //console.warn(2)
                                e.target.style.top = ePosY + "px"
                                puzzle.empty.style.top = posY + "px"
                                puzzle.table[ti][tj] = parseInt(puzzle.empty.id)
                                puzzle.table[ti][tj - 1] = parseInt(e.target.id)
                            }
                        } else if (posY - ePosY == -dimen) {
                            if (posX - ePosX == 0) {
                                //console.warn(3)
                                e.target.style.top = ePosY + "px"
                                puzzle.empty.style.top = posY + "px"
                                puzzle.table[ti][tj] = parseInt(puzzle.empty.id)
                                puzzle.table[ti][tj + 1] = parseInt(e.target.id)
                            }
                        } else {
                            console.error('why?')
                        }
                        //console.log("id: " + e.target.id)
                        //console.log("ti: " + ti + " tj " + tj)
                        //console.log("posX: " + posX + " posY: " + posY)
                        //console.log("ePosX: " + ePosX + " ePosY: " + ePosY)
                        //console.table(puzzle.table)
                        puzzle.checkWin(amount)
                    })
                } else {
                    var el = document.createElement("div")
                    el.className = "tile swap_tile"
                    tc.appendChild(el)
                    el.style.left = img.width/amount * i + "px"
                    el.style.width = img.width/amount + "px"
                    el.style.top = img.height/amount * j + "px"
                    el.style.height = img.height/amount + "px"
                    el.style.backgroundSize = img.width + "px"
                    el.style.backgroundPositionX = "-" + el.style.left
                    el.style.backgroundPositionY = "-" + el.style.top
                    el.id = i * amount + j
                    puzzle.empty = el
                }
            }
        }
        puzzle.randomize(amount)
    },
    randomize : function (amount) {
        //console.log('randomize called')
        puzzle.doCheckWin = false
        puzzle.timer = null
        let emptyI
        let emptyJ
        for (let i = 0; i < amount; i++) {
            for (let j = 0; j < amount; j++) {
                if (puzzle.table[i][j] == puzzle.empty.id) {
                    emptyI = i
                    emptyJ = j
                }
            }
        }
        let minI
        let maxI
        let minJ
        let maxJ
        if (emptyI == 0) minI = 0
        else minI = emptyI - 1
        if (emptyI == amount - 1) maxI = amount - 1
        else maxI = emptyI + 1
        if (emptyJ == 0) minJ = 0
        else minJ = emptyJ - 1
        if (emptyJ == amount - 1) maxJ = amount - 1
        else maxJ = emptyJ + 1

        var targetId
        do {
            //parseInt(Math.floor(Math.random() * 4))
            let targetI = parseInt(Math.floor(Math.random() * (maxI - minI + 1) + minI))
            let targetJ = parseInt(Math.floor(Math.random() * (maxJ - minJ + 1) + minJ))
            //console.log("ei: " + emptyI + " ej: " + emptyJ)
            //console.log("mini: " + minI + " minj: " + minJ)
            //console.log("maxi: " + maxI + " maxj: " + maxJ)
            //console.log("ti: " + targetI + " tj: " + targetJ)
            targetId = puzzle.table[targetI][targetJ]
            //console.log('last: ' + puzzle.lastClicked)
            //console.warn(targetId + ' counter: ' + puzzle.randomCounter)
        } while (puzzle.lastClicked == targetId || targetId == amount * amount - 1)
        //console.log('---- PASS ----')
        //console.table(puzzle.table)
        //console.log(targetId)
        //console.log(document.getElementById(targetId))
        puzzle.lastClicked = targetId
        document.getElementById(targetId).click()
        puzzle.randomCounter += 1
        //console.table(this.table)
        if (puzzle.randomCounter < amount * amount * 10) {
            setTimeout(function() { puzzle.randomize(amount) }, puzzle.delayMaster)
        } else {
            puzzle.doCheckWin = true
            puzzle.startTimer()
        }
    },
    checkWin : function (amount) {
        if (puzzle.doCheckWin) {
            let fail = false
            for (let i = 0; i < amount; i++) {
                for (let j = 0; j < amount; j++) {
                    if (this.table[i][j] != i * amount + j) fail = true
                }
            }
            if (!fail) {
                clearInterval(puzzle.timer)
                setTimeout(puzzle.displayRecords, 200)
            }
        }
    },
    displayRecords : function () {
        clearInterval(puzzle.timer)
        var modeRecords = []
        var insert = true
        var data = 'Najlepsze wyniki trybu ' + puzzle.mode.substr(1,4) + '\n<table><tr><th>Nazwa</th><th>Czas</th></tr>'
        puzzle.records.sort(function (a, b) {
            return parseInt(a.split(' ')[2]) - parseInt(b.split(' ')[2])
        })
        for (let i = 0; i < puzzle.records.length; i++) {
            //console.log(puzzle.records[i].split(' ')[1])
            if (modeRecords.length == 10)
                break
            modeRecords.sort(function (a, b) {
                return parseInt(a.split(' ')[2]) - parseInt(b.split(' ')[2])
            })
            if (puzzle.records[i].split(' ')[1] == puzzle.mode) {
                modeRecords.push(puzzle.records[i])
                if (puzzle.records[i].split(' ')[2] > puzzle.currentTime && insert)
                    insert = false
            }
        }
        if (modeRecords.length < 10)
            insert = false
        if (!insert) {
            let user = window.prompt('Podaj nazwę użytkownika (do 3 znaków)')
            console.log(user)
            if (user == null || user == '')
                user = '---'
            user = user.substr(0,3)
            console.log(user)
            puzzle.insertData(puzzle.mode, puzzle.currentTime, user)
            modeRecords.push((Date.now() + '=0 ' + puzzle.mode + ' ' + puzzle.currentTime + ' ' + user))
        }
        //console.log('modeRecords')
        //console.log(modeRecords)
        modeRecords.sort(function (a, b) {
            return parseInt(a.split(' ')[2]) - parseInt(b.split(' ')[2])
        })
        //console.log('modeRecords')
        //console.log(modeRecords)
        for (let i = 0; i < 10; i++) {
            if (modeRecords[i] == undefined)
                data += '<tr><td>---</td><td>---</td></tr>'
            else
                data += '<tr><td>' + modeRecords[i].split(' ')[3] + '</td><td>' + puzzle.readableTime(modeRecords[i].split(' ')[2]) + '</td></tr>'
        }
        data += '</table>'
        puzzle.popup('Wygrałeś!', 'Twój czas:\n' + puzzle.readableTime(puzzle.currentTime), data)
    },
    insertData : function (mode, time, user) {
        if (mode == undefined)
            mode = window.prompt('Podaj tryb')
        if (time == undefined)
            time = window.prompt('Podaj czas')
        if (user == undefined)
            user = window.prompt('Podaj nazwę użytkownika')
        puzzle.records.push((Date.now() + '=0 ' + mode + ' ' + time + ' ' + user).split(' '))
        //console.log(puzzle.records)
        let i = puzzle.records.length - 1
            document.cookie = '' + puzzle.records[i][0] + ' ' + puzzle.records[i][1] + ' ' + puzzle.records[i][2] + ' ' + puzzle.records[i][3]
        //console.log(document.cookie)
    },
    readableTime : function (tempTime) {
        let tempMiliseconds = parseInt(tempTime % 1000)
        let tempSeconds = parseInt((tempTime / 1000) % 60)
        let tempMinutes = parseInt((tempTime / (1000 * 60)) % 60)
        let tempHours = parseInt((tempTime / (1000 * 60 * 60)) % 24)

        tempHours = (tempHours < 10) ? "0" + tempHours : tempHours
        tempMinutes = (tempMinutes < 10) ? "0" + tempMinutes : tempMinutes
        tempSeconds = (tempSeconds < 10) ? "0" + tempSeconds : tempSeconds
        tempMiliseconds = (tempMiliseconds < 10) ? "00" + tempMiliseconds : (tempMiliseconds < 100) ? "0" + tempMiliseconds : tempMiliseconds
    
        return (tempHours + ":" + tempMinutes + ":" + tempSeconds + "." + tempMiliseconds)
    },
    createTimer : function (img) {
        var cont = document.getElementsByClassName("timer_container")[0]
        if (cont != null)
            cont.innerHTML = ""
        else {
            cont = document.createElement("DIV")
            puzzle.container.appendChild(cont)
        }
        cont.className = "timer_container"
        cont.order = 1
        cont.width = img.width
        for (let i = 0; i < 12; i++) {
            var el = new Image()
            el.className = "timerCell"
            el.id = "timer" + i
            el.height = 21
            el.src = "img/c0.gif"
            cont.appendChild(el)
        }
        puzzle.timerCells = document.getElementsByClassName("timerCell")

        puzzle.timerCells[2].src = "img/colon.gif"
        puzzle.timerCells[5].src = "img/colon.gif"
        puzzle.timerCells[8].src = "img/dot.gif"
    },
    startTimer : function () {
        puzzle.startTime = Date.now()
        puzzle.timer = setInterval(function () {
            let tempTime = Date.now()
            tempTime -= puzzle.startTime
            let tempMiliseconds = parseInt(tempTime % 1000)
            let tempSeconds = parseInt((tempTime / 1000) % 60)
            let tempMinutes = parseInt((tempTime / (1000 * 60)) % 60)
            let tempHours = parseInt((tempTime / (1000 * 60 * 60)) % 24)

            tempHours = (tempHours < 10) ? "0" + tempHours : tempHours
            tempMinutes = (tempMinutes < 10) ? "0" + tempMinutes : tempMinutes
            tempSeconds = (tempSeconds < 10) ? "0" + tempSeconds : tempSeconds
            tempMiliseconds = (tempMiliseconds < 10) ? "00" + tempMiliseconds : (tempMiliseconds < 100) ? "0" + tempMiliseconds : tempMiliseconds

            tempHours = "" + tempHours
            tempMinutes = "" + tempMinutes
            tempSeconds = "" + tempSeconds
            tempMiliseconds = "" + tempMiliseconds

            puzzle.timerCells[0].src = "img/c" + tempHours[0] + ".gif"
            puzzle.timerCells[1].src = "img/c" + tempHours[1] + ".gif"
            puzzle.timerCells[2].src = "img/colon.gif"
            puzzle.timerCells[3].src = "img/c" + tempMinutes[0] + ".gif"
            puzzle.timerCells[4].src = "img/c" + tempMinutes[1] + ".gif"
            puzzle.timerCells[5].src = "img/colon.gif"
            puzzle.timerCells[6].src = "img/c" + tempSeconds[0] + ".gif"
            puzzle.timerCells[7].src = "img/c" + tempSeconds[1] + ".gif"
            puzzle.timerCells[8].src = "img/dot.gif"
            puzzle.timerCells[9].src = "img/c" + tempMiliseconds[0] + ".gif"
            puzzle.timerCells[10].src = "img/c" + tempMiliseconds[1] + ".gif"
            puzzle.timerCells[11].src = "img/c" + tempMiliseconds[2] + ".gif"
            //console.log(tempHours + ":" + tempMinutes + ":" + tempSeconds + "." + tempMiliseconds)
            puzzle.currentTime = tempTime
        }, 50)
    },
    popup : function (title, text, text1) {
        var bg = document.createElement("DIV")
        bg.className = "pop_background"
        document.body.appendChild(bg)

        var el = document.createElement("DIV")
        el.className = "pop_window"
        bg.appendChild(el)

        var el_title = document.createElement('div')
        el_title.className = 'pop_title'
        el_title.innerHTML = title
        el.appendChild(el_title)

        var el_text = document.createElement('div')
        el_text.className = 'pop_text'
        el_text.innerHTML = text
        el.appendChild(el_text)

        var el_text1 = document.createElement('div')
        el_text1.className = 'pop_text'
        el_text1.innerHTML = text1
        el.appendChild(el_text1)

        //var btn_close = document.createElement('button')
        //btn_close.className = 'pop_btn'
        //btn_close.innerHTML = 'Ok'
        //btn_close.style.left = '40px'
        //el.appendChild(btn_close)
        //btn_close.addEventListener('click', function () {
        //    bg.parentNode.removeChild(bg)
        //})

        var btn_restart = document.createElement('button')
        btn_restart.className = 'pop_btn'
        btn_restart.innerHTML = 'Restart'
        btn_restart.style.left = '50px'
        el.appendChild(btn_restart)
        btn_restart.addEventListener('click', function () {
            location.reload()
        })
    },
    
}

document.addEventListener("DOMContentLoaded", function () {
    window.ondragstart = function() { return false }
    puzzle.img_src.push("https://i.pinimg.com/736x/11/34/c5/1134c5b0f8cb1fc61d67fdacb4dd007e--color-harmony-blurred-lines.jpg")
    puzzle.img_src.push("https://i.scdn.co/image/7c435e8d29e31091e5d45e110cc677089f062b3b")
    puzzle.img_src.push("https://i.scdn.co/image/343c1825d62a81ff84e80057467a63176a9d25af")
    puzzle.img_src.push("https://i.scdn.co/image/a5efb653ab35f67057167d676d8bd1fd3eb5c062")
    puzzle.img_src.push("https://i.scdn.co/image/f86df5cca1d4a05e225f50e8c8c39259c4dab210")
    puzzle.img_src.push("https://i.scdn.co/image/40f132901394ff87d3e05bae6e01fd0f5a0afbd9")
    puzzle.img_src.push("https://i.scdn.co/image/4c4fca599c016feb149efa5eac98bfcc9f2cf26b")
    puzzle.imgId = 0

    var img = new Image()
    img.className = "prev_img"
    puzzle.leftImg = img
    puzzle.leftImg.src = puzzle.img_src[puzzle.imgId]
    if (puzzle.imgContainer == null )
        puzzle.createImgCont(puzzle.leftImg)
    puzzle.imgContainer.appendChild(puzzle.leftImg)

    var img = new Image()
    img.className = "prev_img"
    puzzle.img = img
    puzzle.img.src = puzzle.img_src[puzzle.imgId]
    if (puzzle.imgContainer == null )
        puzzle.createImgCont(puzzle.img)
    puzzle.imgContainer.appendChild(puzzle.img)

    var img = new Image()
    img.className = "prev_img"
    puzzle.rightImg = img
    puzzle.rightImg.src = puzzle.img_src[puzzle.imgId]
    if (puzzle.imgContainer == null )
        puzzle.createImgCont(puzzle.rightImg)
    puzzle.imgContainer.appendChild(puzzle.rightImg)

    //for (let i = 0; i < puzzle.img_src.length; i++) {
    //    var img = new Image()
    //    img.className = "prev_img"
    //    puzzle.img = img
    //    puzzle.img.src = puzzle.img_src[i]
    //    if (puzzle.imgContainer == null )
    //        puzzle.createImgCont(puzzle.img)
    //    puzzle.imgContainer.appendChild(puzzle.img)
    //}
    img.onload = function () {
        function temp () {
            puzzle.init(puzzle.img)
            img.removeEventListener("click", temp)
        }
        img.addEventListener("click", temp)
    }
    puzzle.createMain(puzzle.img)
    puzzle.container.appendChild(puzzle.imgContainer)
    puzzle.createArrows(puzzle.img)
    puzzle.createButtons(puzzle.img)
    //puzzle.checkArrows()
    setTimeout(function () {puzzle.imgContainer.scrollLeft = 300}, 100)
})