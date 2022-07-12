/**
 *  1.Render song   -> ok
 *  2.Scroll top    -> ok
 *  3.Play/pause/seek -> ok
 *  4.CD rotate -> ok
 *  5.Next/prev -> ok
 *  6.Random    -> ok
 *  7.Next / Reapet when ended -> ok
 *  8.Active song -> ok
 *  9.Scroll active song into view -> ok
 *  10.playsong when click  -> ok
 * 
 */


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const container = $('.player')
const heading = $('header h2')
const cd = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const time = $('.time')
const inputProgres = $('#progress')
const repeatBtn = $('.btn-repeat')
const randBtn = $('.btn-random')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')

const app = {
    currentIndex: 0,
    repeatSong: false,
    randomSong: false,
    songs: [
        {
            name: 'So Close',
            singer: 'NOTD',
            path: './assets/music/1.mp3',
            image: './assets/img/1.jpg'
        },
        {
            name: 'Younger',
            singer: 'NOTD',
            path: './assets/music/2.mp3',
            image: './assets/img/2.jpg'
        },
        {
            name: 'Electricity',
            singer: 'Dua Lipa',
            path: './assets/music/3.mp3',
            image: './assets/img/3.jpg'
        },
        {
            name: 'Nobody Else',
            singer: 'Hexagon',
            path: './assets/music/4.mp3',
            image: './assets/img/4.png'
        },
        {
            name: 'Whenever',
            singer: 'Kris Kross Amsterdam x The Boy Next Door',
            path: './assets/music/5.mp3',
            image: './assets/img/5.jpg'
        },
        {
            name: 'Needed You',
            singer: 'Illenium',
            path: './assets/music/6.mp3',
            image: './assets/img/6.jpg'
        },
    ],
    
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    render: function() {
        const htmls = this.songs.map((song)=>{
            return `<div class="song">
            <div class="thumb" style="background-image: url(${song.image})"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            let newCdWidth = cdWidth-scrollTop>0?cdWidth-scrollTop:0
            cd.style.width = newCdWidth+'px'
            cd.style.height = newCdWidth+'px'
            cd.style.opacity = newCdWidth/cdWidth
        }

        // Xử lý Click Play
        playBtn.addEventListener('click',()=>{
            container.classList.toggle('playing')
            if (container.classList.contains('playing')) {
                audio.play()
            } else {
                audio.pause()
            }
        })

        // Time update audio
        audio.ontimeupdate = function() {
            inputProgres.value = 0
            audio.onloadedmetadata = function() {
                time.textContent = `${secToMin(audio.currentTime.toFixed(0))} / ${secToMin(audio.duration.toFixed(0))}`
            };
            time.textContent = `${secToMin(audio.currentTime.toFixed(0))} / ${secToMin(audio.duration.toFixed(0))}`
            
            // Chạy input progress
            let val = (100/audio.duration.toFixed(0))*audio.currentTime.toFixed(0)
            if (isNaN(val)) val = 0
            inputProgres.value = val
        }

        // Hàm đổi sang phút{
        let secToMin = (sec)=>{
            let mind = sec%(60*60)
            let minutes = Math.floor(mind / 60)
            let secd = mind % 60
            let seconds = Math.ceil(secd)

            minutes = (minutes < 10)?'0'+minutes:minutes
            seconds = (seconds < 10)?'0'+seconds:seconds
            return minutes+':'+seconds
        }

        // seek audio
        inputProgres.addEventListener('change',()=>{
            audio.currentTime = audio.duration.toFixed(0)*(inputProgres.value/100)
        })

        // toggle repeat song
        repeatBtn.addEventListener('click',()=>{
            randBtn.classList.remove('active')
            this.randomSong = false;
            repeatBtn.classList.toggle('active')
            this.repeatSong = !this.repeatSong
        })

        // toggle random song
        randBtn.addEventListener('click',()=>{
            repeatBtn.classList.remove('active')
            this.repeatSong = false
            randBtn.classList.toggle('active')
            this.randomSong = !this.randomSong
        })

        // Click prev song
        prevBtn.addEventListener('click',()=>{
            this.currentIndex = (this.currentIndex === 0)?this.songs.length-1:this.currentIndex-1
            this.loadCurrentSong(this.currentSong)
        })

        // Click next song
        nextBtn.addEventListener('click',()=>{
            this.currentIndex = (this.currentIndex < this.songs.length-1)?this.currentIndex+1:0
            this.loadCurrentSong(this.currentSong)
        })

        // Rotate CD
        let spinnerAnimation = cd.animate([
            {
                transform: 'rotate(0)'
            },
            {
                transform: 'rotate(359deg)'
            }
        ], 
            {
                duration: 5000,
                iterations: Infinity
        });
        spinnerAnimation.cancel()
        playBtn.addEventListener('click',()=>{
            if ($('.player').classList.contains('playing')) {
                spinnerAnimation.play()
            } else {
                spinnerAnimation.pause()
            }
        })

        // Play song when click
        let listSong = $$('.song')
        listSong.forEach((s)=>{
            s.addEventListener('click',()=>{
                let url = s.childNodes[1].style.backgroundImage
                url = url.substring(5, url.length-2)
                listSong.forEach((ss)=>{
                    ss.classList.remove('active')
                })

                s.classList.add('active')

                for (let i = 0; i <this.songs.length; ++i) {
                    if (this.songs[i].image == url) {
                        this.loadCurrentSong(this.songs[i])
                        this.currentIndex = i
                    }
                }
            })
        })
    },

    loadCurrentSong: function(song) {
        heading.textContent = song.name
        cd.style.background = `url(${song.image})`
        audio.src = song.path

        const listSong = $$('.song')
        
        listSong.forEach(s =>{
            s.classList.remove('active')
        })

        listSong.forEach(s => {
            let url = s.childNodes[1].style.backgroundImage
            url = url.substring(5, url.length-2)
            if(url === song.image) {
                s.classList.add('active')
            }
        });

        if ($('.player').classList.contains('playing'))
            audio.autoplay = true
        else audio.autoplay = false
    },

    loadNextSong: function() {
        audio.onended = ()=> {
            let isRand = false
            //Random song
            if (this.randomSong) {
                let newIndexSong
                do {
                    newIndexSong = (Math.random()*5).toFixed(0)
                } while(this.currentIndex == newIndexSong)
                this.currentIndex = parseInt(newIndexSong)
                isRand = true
            }
            //check repeat song
            if (!this.repeatSong && !isRand){
                this.currentIndex = (this.currentIndex < this.songs.length-1)?this.currentIndex+1:0
            }
            this.loadCurrentSong(this.currentSong)
            audio.autoplay = true
        }
    },

    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        
        // Render playlist
        this.render()
        
        // Xử lý các Dom Event
        this.handleEvents()

        // Tải bài đầu tiên khi chạy
        this.loadCurrentSong(this.currentSong)

        // repeat, random song
        this.loadNextSong() 
    }
}

app.start()