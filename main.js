
class Carousel {
  constructor(carouselID) {
    this.carouselID = carouselID
    this.carousel = document.getElementById(this.carouselID)
    this.innerContainer = this.carousel.firstElementChild
    this.slides = Array.from(this.innerContainer.children)
    this.labelSlides()
    this.firstSlide = this.slides[0]
    this.lastSlide = this.slides.slice(-1)[0]
    this.firstClone = this.firstSlide.cloneNode(true)
    this.lastClone = this.lastSlide.cloneNode(true)
    this.innerContainer.insertBefore(this.lastClone, this.innerContainer.children[0])
    this.innerContainer.appendChild(this.firstClone)
    this.currentIndex = 1
    this.isTransitioning = false
    this.interval = 7000
    this.auto = true
    this.prevBtn = this.carousel.querySelector('#prev')
    this.nextBtn = this.carousel.querySelector('#next')
    this.timer = null
    this.pointerIsDown = false
    this.startClientX = null 
    this.currentClientX = null 
    this.endClientX = null 



    this.events()


  }

  events() {

    this.slides = [this.lastClone, ...this.slides, this.firstClone]
    this.prevBtn.setAttribute('aria-controls', this.innerContainer.id)
    this.nextBtn.setAttribute('aria-controls', this.innerContainer.id)
    this.innerContainer.addEventListener('transitionend', this.handleTransitionEnd.bind(this), false)
    this.innerContainer.addEventListener('transitioncancel', this.handleTransitionCancel.bind(this), false)
    this.prevBtn.addEventListener('click', (e) => {
      e.target.focus()
      this.incrementSlide("reverse")
    })
    this.nextBtn.addEventListener('click', (e) => {
      e.target.focus()
      this.incrementSlide("forward")
    })

    this.carousel.addEventListener('pointerenter', (e) => {
      this.auto = false
      clearInterval(this.timer)
    })

    this.carousel.addEventListener('pointerleave', (e) => {
      this.auto = true
      this.start()
    })

    this.innerContainer.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.innerContainer.addEventListener('pointermove', this.handlePointerMove.bind(this))
    this.innerContainer.addEventListener('pointerup', this.handlePointerUp.bind(this))

    this.updateButtons()
    this.setAriaCurrent()
     this.innerContainer.setAttribute('role', 'slider')
     this.start()
  }

  handlePointerDown(e) {
    this.pointerIsDown = true
    this.startClientX = e.clientX

  }

  handlePointerMove(e) {
    if (!this.pointerIsDown) return
    this.currentClientX  = e.clientX

    let diff = this.currentClientX - this.startClientX

    let tmpTransition = -this.currentIndex * 100

    if (diff > 50) {
      tmpTransition = tmpTransition + 15

    }

    if (diff < -50) {
      tmpTransition = tmpTransition - 15
    }

    this.innerContainer.style.transform = `translateX(${tmpTransition}%)`    

    }

  handlePointerUp(e) {
    let diff = this.currentClientX - this.startClientX

    if (diff > 50) {
      this.incrementSlide("reverse")

    }

    if (diff < -50) {
      this.incrementSlide("forward")
    }
    this.pointerIsDown = false
  }

  incrementSlide(direction) {
    if (this.isTransitioning) return  
    switch (direction) {
    case "forward":
      this.currentIndex++
      break
    case "reverse":
      this.currentIndex--
      break
    default:
      this.currentIndex++
    }

     this.handleCurrentIndex();

     this.setAriaCurrent(this.currentIndex)

      this.isTransitioning = true 
      this.innerContainer.style.transform = `translateX(${-this.currentIndex * 100}%)`

  }

  labelSlides() {
    this.slides.forEach((slide,index) => {
      slide.setAttribute('data-index', index)
      slide.setAttribute('aria-label', `Slide #${index + 1}`)
      slide.setAttribute('title', `Slide #${index + 1}`)
      slide.setAttribute("role", "presentational")
    })
  }


  start() {


    this.timer = setInterval(() => {
      this.incrementSlide("forward")
      if ( false === this.auto) clearInterval(this.timer)
    }, this.interval)

    if (!this.auto) {
      clearInterval(this.timer)
    }
  }

  setAriaCurrent(currentIndex) {
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.setAttribute('aria-current', true)
      } else {

        slide.setAttribute('aria-current', false)

      }
    })
  }

  handleTransitionCancel(e) {
  
  }


  handleTransitionEnd() {
    if (this.currentIndex == 0) {
      this.isTransitioning = true
      this.innerContainer.classList.remove('smooth')
      this.currentIndex = this.slides.length - 2
      this.innerContainer.style.transform = `translateX(${-this.currentIndex * 100}%)`
      // settimeout callbaack helps with end transition on touch
      setTimeout(() => {
      this.innerContainer.classList.add('smooth');
    }, 0);

    }
    if (this.currentIndex == this.slides.length - 1) {
      this.isTransitioning = true
      this.innerContainer.classList.remove('smooth')
      this.currentIndex = 1
      this.innerContainer.style.transform = `translateX(${-this.currentIndex * 100}%)`
      // settimeout transition helps with touch transitions   
        setTimeout(() => {
      this.innerContainer.classList.add('smooth');
    }, 0);
    }


    this.updateButtons()
    this.isTransitioning = false

  }

  handleCurrentIndex() {
    if (this.currentIndex < 0) {
      this.currentIndex = this.slides.length - 1
    }

    if (this.currentIndex > this.slides.length - 1) {
      this.currentIndex = 0
    }

    this.carousel.setAttribute('data-index', this.currentIndex)

  }

  updateButtons() {

    let prevVal = this.currentIndex - 1 < 1 ? this.slides.length - 2 : this.currentIndex - 1
    let nextVal = this.currentIndex + 1 > this.slides.length - 2 ? 1 : this.currentIndex + 1

    this.prevBtn.setAttribute('aria-label', `Go to slide #${prevVal}`)
    this.nextBtn.setAttribute('aria-label', `Go to slide #${nextVal}`)
  }


  stat() {
    console.log(this)
  }


}




let slider = new Carousel("slider")