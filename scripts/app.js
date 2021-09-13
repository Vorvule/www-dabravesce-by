window.addEventListener('load', async () => {

    if (navigator.serviceWorker) {
        try {
            const regInfo = await navigator.serviceWorker.register('service-worker.js')
            // console.log('Service Worker register success', regInfo)
        } catch (e) {
            // console.log('Service Worker register fail')
        }
    }
    site.load.first()

})

const site = {

    layout: {
        fix: function () { WrapperLeft.style.height = WrapperRight.style.height = (window.innerHeight - 94) + 'px' },
        get isDesktop() { return screen.width > 600 },
    }, // layout

    load: {

        first: function () {
            site.layout.fix()
            site.menu.make()

            site.load.parse()
            site.page.open()

            site.load.listenToKeyUp
            site.load.listenToPopUp
        },

        parse: function () {
            try {
                let keys = document.location.href.split('?i=')[1]
                keys = keys.split('&')[0]
                keys = keys.split('-')
                site.page.setKeys(Number(keys[0]), Number(keys[1]), Number(keys[2]), Number(keys[3]))
            } catch {
                site.page.setKeys(0, 0, 0, 0)
            }
        },

        listenToKeyUp: SearchField.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault(); SearchButton.click()
            }
        }),

        listenToPopUp: window.onpopstate = function () {
            site.href.fresh = false
            site.load.parse()
            site.page.open()
        },

    }, // load

    href: {

        fresh: true,

        keep: function () {
            if (site.href.fresh)
                history.pushState('', '', 'index.html?i=' + site.page.tome + '-' + site.page.book + '-' + site.page.item + '-' + site.page.share);
            site.href.fresh = true;
        },

    },

    page: {

        tomeHash: null,

        swapTomeHash: function () {
            switch (site.page.tome) {
                case 0: site.page.tomeHash = newTestament; break;
                case 1: site.page.tomeHash = prayerBook; break;
                case 2: site.page.tomeHash = songs; break;
                case 3: site.page.tomeHash = contactData; break;
            }
        },

        tome: 0, // rubric volume
        book: 0, // chapter section
        item: 0, // portion verse
        share: 0, // share icons line

        setKeys: function (tome, book, item, share) {
            site.menu.unmark()
            site.menu.collapse()

            site.page.tome = tome
            site.page.book = book
            site.page.item = item
            site.page.swapTomeHash()

            if (share) {
                site.page.share = share
                site.smms.show()
            } else {
                site.smms.hide()
            }

            site.menu.expand()
            site.menu.mark()

            site.href.keep()
        },

        go: function (id) {
            let keys = id.split('-')
            if (keys.length == 3) keys[3] = site.page.share
            site.page.setKeys(Number(keys[0]), Number(keys[1]), Number(keys[2]), Number(keys[3]))
            site.page.open()
        },

        open: function () {

            site.menu.show(site.layout.isDesktop)
            WrapperRight.scrollTo(0, 0)

            TextContainer.innerHTML = site.page.tomeHash[site.page.book][site.page.item][1]
            site.page.fillInfo()
            site.setAudio()

            TextView.classList.remove('w3-hide')
            SearchView.classList.add('w3-hide')
            SearchIcon.classList.remove('w3-text-blue')

            site.page.setTitleAndDescription()
        },

        fillInfo: function () {
            TomeInfo.innerHTML = site.menu.tomes[site.page.tome]
            BookInfo.innerHTML = site.page.tomeHash[site.page.book][site.page.tomeHash[site.page.book].length - 1][0]
            ItemInfo.innerHTML = site.page.tomeHash[site.page.book][site.page.item][0]
        },

        next: function (forward) {
            switch (forward) {
                case true: if (site.page.item < site.page.tomeHash[site.page.book].length - 2)
                    site.page.setKeys(site.page.tome, site.page.book, site.page.item + 1, site.page.share)
                    break
                case false: if (site.page.item > 0)
                    site.page.setKeys(site.page.tome, site.page.book, site.page.item - 1, site.page.share)
                    break
            }
            site.page.open()
        },

        setTitleAndDescription: function () {

            let bookNameIndex = site.page.tomeHash[site.page.book].length - 1
            let briefBookName

            try {
                briefBookName = site.page.tomeHash[site.page.book][bookNameIndex][1]
            } catch {
                briefBookName = ''
            }

            description.setAttribute('content', site.page.tome + '. ' + site.page.book + '. ' + site.page.item)

            if (site.page.tome == 0) {
                document.title = 'Дабравесце – ' + briefBookName + ' ' + (site.page.item + 1)
            } else document.title = 'Дабравесце – ' + site.menu.tomes[site.page.tome]
        },

    }, // page



    menu: {

        tomes: ['Новы Запавет',
            'Малітоўнік',
            'Спевы',
            'Кантакты'],

        make: function () {
            let menu = ''
            for (let tomeIndex = 0; tomeIndex < site.menu.tomes.length; tomeIndex++) {
                menu += '<li class="tome" onclick="site.menu.toggleShowSubmenu(this)">' + site.menu.tomes[tomeIndex] + '</li>'
                menu += '<div class="tome-submenu w3-hide">' + site.menu.books(tomeIndex) + '</div>'
            }
            if (site.layout.isDesktop) SideMenuContainer.innerHTML = menu
            else MenuContainer.innerHTML = menu
        },

        // site.menu.make() invokes
        books: function (tomeIndex) {
            site.page.tome = tomeIndex
            site.page.swapTomeHash()
            let bookNameIndex, bookMenu = ''
            for (let bookIndex = 0; bookIndex < site.page.tomeHash.length; bookIndex++) {
                bookNameIndex = site.page.tomeHash[bookIndex].length - 1
                bookMenu += '<li class="book" onclick="site.menu.toggleShowSubmenu(this)">' + site.page.tomeHash[bookIndex][bookNameIndex][0] + '</li>'
                bookMenu += '<div class="book-submenu w3-hide">' + site.menu.items(tomeIndex, bookIndex) + '</div>'
            }
            return bookMenu
        },

        // site.menu.book() invokes
        items: function (tomeIndex, bookIndex) {
            let itemMenu = ''
            for (let itemIndex = 0; itemIndex < site.page.tomeHash[bookIndex].length - 1; itemIndex++) {
                itemMenu += '<li '
                itemMenu += 'class="item w3-animate-left" '
                itemMenu += 'onclick="site.page.go(this.id)" '
                itemMenu += 'id="' + tomeIndex + '-' + bookIndex + '-' + itemIndex + '"' // for mark/unmark menu items
                itemMenu += '>'
                itemMenu += site.page.tomeHash[bookIndex][itemIndex][0]
                itemMenu += '</li>'
            }
            return itemMenu
        },

        get activeItem() {
            let itemId = site.page.tome + '-' + site.page.book + '-' + site.page.item
            return document.getElementById(itemId)
        },

        unmark: function () {
            site.menu.activeItem.parentElement.previousElementSibling.parentElement.previousElementSibling.classList.remove('w3-text-blue')
            site.menu.activeItem.parentElement.previousElementSibling.classList.remove('w3-text-blue')
            site.menu.activeItem.classList.remove('w3-text-blue')
        },

        mark: function () {
            site.menu.activeItem.parentElement.previousElementSibling.parentElement.previousElementSibling.classList.add('w3-text-blue')
            site.menu.activeItem.parentElement.previousElementSibling.classList.add('w3-text-blue')
            site.menu.activeItem.classList.add('w3-text-blue')
        },

        // expand active menu item in menu tree
        expand: function () {
            site.menu.activeItem.parentElement.classList.remove('w3-hide')
            site.menu.activeItem.parentElement.parentElement.classList.remove('w3-hide')
        },

        // collapse (old) active menu item in menu tree
        collapse: function () {
            site.menu.activeItem.parentElement.classList.add('w3-hide')
            site.menu.activeItem.parentElement.parentElement.classList.add('w3-hide')
        },

        show: function (toShow = true) { // for mobile
            if (toShow) { // then show menu
                site.view.show('MenuView')
                MenuIcon.classList.add('w3-text-blue')
                MenuIcon.setAttribute('onclick', 'site.menu.show(false)')
                SearchIcon.classList.remove('w3-text-blue')
            } else {
                site.view.show('TextView')
                MenuIcon.classList.remove('w3-text-blue')
                MenuIcon.setAttribute('onclick', 'site.menu.show(true)')
            }
        },

        toggleShowSubmenu: function (that) {
            let submenuList = document.getElementsByClassName(that.classList[0] + '-submenu')
            if (that.nextSibling.classList.contains('w3-hide')) {
                for (let i = 0; i < submenuList.length; i++) submenuList[i].classList.add('w3-hide')
                that.nextSibling.classList.remove('w3-hide')
            }
            else that.nextSibling.classList.add('w3-hide')
        },
    }, // menu




    search: {

        filter: function () {
            site.search.list = ''

            let searchValue = SearchField.value
            if (CaseInsensitive.checked) searchValue = searchValue.toLowerCase()

            // avoid searching
            if (searchValue == '' ||
                searchValue.indexOf('<') > -1 ||
                searchValue.indexOf('/') > -1 ||
                searchValue.indexOf('p') > -1 ||
                searchValue.indexOf('>') > -1) {
                SearchResults.innerHTML = ''
                return
            }

            // search
            if (TestamentCheckbox.checked) site.search.book(searchValue, newTestamentSearchable, 'Новы Запавет', 0)
            if (PrayerbookCheckbox.checked) site.search.book(searchValue, prayerBook, 'Малітоўнік', 1)
            if (SongbookCheckbox.checked) site.search.book(searchValue, songs, 'Спевы', 2)

            // show results
            if (site.search.list) SearchResults.innerHTML = site.search.list
            else SearchResults.innerHTML = '<li>Безвынікова</li>'
        },

        book: function (searchValue, searchedTome, searchedTomeName, searchedTomeIndex) {
            for (let i = 0; i < searchedTome.length; i++) {
                let aBook = searchedTome[i]
                for (let j = 0; j < aBook.length - 1; j++) {
                    let anItem = aBook[j][1]
                    if (CaseInsensitive.checked == true) anItem = anItem.toLowerCase()
                    if (anItem.indexOf(searchValue) > -1) site.search.enlist(searchedTomeIndex, searchedTomeName, i, aBook[aBook.length - 1][0], j, aBook[j][0])
                }
            }
        },

        list: '',

        enlist: function (enlistedTome, enlistedTomeName, enlistedBook, enlistedBookName, enlistedItem, enlistedItemName) {
            site.search.list += '<li onclick="site.page.setKeys(' + enlistedTome + ', ' + enlistedBook + ', ' + enlistedItem + ');site.page.open()">'
            site.search.list += enlistedTomeName + '. ' + enlistedBookName + '. ' + enlistedItemName
            site.search.list += '</li>'
        },

        show: function () {
            if (!SearchIcon.classList.contains('w3-text-blue')) { // show search view

                site.view.show('SearchView') // show only search view
                SearchField.focus()
                SearchIcon.classList.add('w3-text-blue') // mark icon blue

                let script = document.createElement('script') // append newTestament searchable
                script.type = 'text/javascript'
                script.src = 'tomes/new-testament-searchable.js'
                document.head.appendChild(script)


            } else { // hide search view
                SearchIcon.classList.remove('w3-text-blue') // unmark search icon
                site.view.show('TextView') // show only text view
                // removing the <script> tag does not remove its objects from the DOM
            }
        },

        toggleShowSettings: function () {
            (SearchSettings.classList.contains('w3-hide'))
                ? SearchSettings.classList.remove('w3-hide')
                : SearchSettings.classList.add('w3-hide')
        },
    }, // search



    view: {

        show: function (viewId) {
            let views = document.getElementsByClassName('view')
            for (let i = 0; i < views.length; i++) views[i].classList.add('w3-hide')
            document.getElementById(viewId).classList.remove('w3-hide')
        }
    }, // view



    sendMail: function () {
        let inputFields = document.getElementsByClassName('w3-input')
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText) MailForm.reset()
            }
        }
        request.open('POST', 'send-mail.php', true)
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        request.send('Name=' + inputFields[0].value + '&Email=' + inputFields[1].value + '&Subject=' + inputFields[2].value + '&Comment=' + inputFields[3].value)
    }, // sendMail




    setAudio: function () {
        let bookFolderName, itemFileName

        switch (site.page.tome) {

            case 0: // gospel
                switch (site.page.book) {
                    case 0: bookFolderName = 'matt'; break
                    case 1: bookFolderName = 'mark'; break
                    case 2: bookFolderName = 'luke'; break
                    case 3: bookFolderName = 'john'; break
                    default: AudioElement.classList.add('w3-hide'); return
                }
                itemFileName = (site.page.item + 1).toString()
                if (itemFileName.length < 2) itemFileName = '0' + itemFileName
                break

            case 1: // prayers
                bookFolderName = 'pray'
                switch (site.page.book) {
                    case 0: // everyday prayers
                        switch (site.page.item) {
                            case 0: itemFileName = 'morning'; break
                            case 1: itemFileName = 'evening'; break
                            // 2. Different prayers: no audio
                            default: AudioElement.classList.add('w3-hide'); return
                        }
                        break
                    // 2. Eucharist prayers; 3. Easter prayers: no audio
                    case 3: // worships
                        switch (site.page.item) {
                            case 0: itemFileName = 'liturgy'; break
                            case 1: itemFileName = 'moleben'; break
                            case 2: itemFileName = 'requiem'; break
                            default: AudioElement.classList.add('w3-hide'); return // fallback
                        }
                        break
                    default: AudioElement.classList.add('w3-hide'); return
                }
                break;

            case 2: // songs
                bookFolderName = 'song'
                let correctionNumber = 0
                switch (site.page.book) {
                    case 1: correctionNumber = 6; break
                    case 2: correctionNumber = 13; break
                    case 3: correctionNumber = 20; break
                }
                itemFileName = (site.page.item + 1 + correctionNumber).toString()
                if (itemFileName.length < 2) itemFileName = '0' + itemFileName
                break

            default: AudioElement.classList.add('w3-hide'); return // contacts and fallback
        }

        AudioElement.classList.remove('w3-hide')
        SourceElement.src = 'https://www.dabravesce.by/audio/' + bookFolderName + '/' + itemFileName + '.mp3'
        AudioElement.load()
    }, // setAudio



    smms: {

        shareSmm: function (socialNetwork) {

            let sharedUrl = 'https://dabravesce.by?i=' + site.page.tome + '-' + site.page.book + '-' + site.page.item
            let shareInfo = TomeInfo.innerHTML + '. ' + BookInfo.innerHTML + '. ' + ItemInfo.innerHTML
            let hashTags = '%23Біблія+%23Евангелле+%23Библия+%23Евангелие+%23Bible+%23Gospel'
            let href = location.href

            // %0A : line break; %23 : hash
            switch (socialNetwork) {
                case 'twitter':
                    href = 'https://twitter.com/intent/tweet?text=' + shareInfo + ':' + '&url=' + sharedUrl + '%0A%0A'
                        + '&hashtags=Біблія,Евангелле,Библия,Евангелие,Bible,Gospel'
                    break
                case 'facebook':
                    href = 'https://facebook.com/sharer.php?u=' + sharedUrl + '&app_id=480142549312931&quote=' + shareInfo + '%0A%0A' + hashTags
                    break
                case 'telegram':
                    href = 'https://t.me/share/url?url=' + sharedUrl + '%0A' + '&text=' + shareInfo + '%0A%0A' + hashTags
            }

            location.href = href
        },

        swap: function () { // SmmsLine
            if (SmmsLine.classList.contains('w3-hide')) site.smms.show()
            else site.smms.hide()
            site.href.keep()
        },

        show: function () { // SmmsLine
            SmmsLine.classList.remove('w3-hide')
            ShareIcon.classList.add('w3-text-blue')
            site.page.share = 1
            SmmsLine.scrollIntoView({ behavior: "smooth", block: "center" })
        },

        hide: function () { // SmmsLine
            SmmsLine.classList.add('w3-hide')
            ShareIcon.classList.remove('w3-text-blue')
            site.page.share = 0
        },

    }, // smms



    daily: {

        book: null,
        item: null,

        gospel: function () {
            if (!site.daily.book) {
                site.daily.indices()
                return
            }
            site.daily.load()
        },

        indices: function () {
            let request = new XMLHttpRequest()
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let keys = this.responseText.split(' | ')
                    site.daily.book = Number(keys[0])
                    site.daily.item = Number(keys[1])
                    site.daily.load()
                }
            }
            request.open('GET', 'app/cron/daily-gospel.txt', true)
            request.send()
        },

        load: function () { site.page.go(0 + '-' + site.daily.book + '-' + site.daily.item + '-' + site.page.share) },

    }, // daily

}
