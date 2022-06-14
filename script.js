const Keyboard = {
    keyboard:null,
   keyContainer: null,
   keys: null,
   input: null, 
   capsLock: false,
   shift: false,
   cursPos: 0,
   isRus: false,
   isMute: false,
   isRecord: false,
   recognition:null,
   keyLayout: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "done", 'lang',
    "space", "left", "right", 'volume', 'micro'
  ],

   start(){
    
      this.keyContainer = document.querySelector('.keyboard__buttons');
      this.input = document.querySelector('.use-keyboard-input');
      this.keyContainer.appendChild(this._createKeys());
      this.keys = document.querySelectorAll('.keyboard__buttons__button');
      this.input.addEventListener('keydown',this._keyListener.bind(Keyboard))
      this.keyboard = document.querySelector('.keyboard');
      this.input.addEventListener('click', () =>{
        this.keyboard.classList.remove('keyboard__hidden')
      })
   },
   _microListener(option){
    
        switch(option)
        {
         case 'start':
            this.recognition = new SpeechRecognition();
            this.recognition.interimResults = true;
             this.recognition.lang = this.isRus ? 'ru-RU' : 'en-US'; 
            
            this.recognition.onresult = (e) =>{
              let transcript = Array.from(e.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join();
              if(e.results[0].isFinal){
                this.input.value +=transcript;
              }
            }
            this.recognition.addEventListener('end', this.recognition.start);
            this.recognition.start();
            
            break;


        case 'stop':
          this.recognition.abort();
          this.recognition.stop();
          this.recognition.removeEventListener('end', this.recognition.start);
          
          break;
        }

   },

   _createKeys(){
    const fragment = document.createDocumentFragment();
    

    this.keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "enter", "/"].indexOf(key) !== -1;
      keyElement.classList.add('keyboard__buttons__button');
      keyElement.addEventListener('mousedown', (e)=>{
          e.target.classList.add('keyboard__buttons__button--pressed');
      });
      keyElement.addEventListener('mouseup', (e)=>{
        e.target.classList.remove('keyboard__buttons__button--pressed');
    });
    keyElement.addEventListener('mouseover', (e)=>{
      e.target.classList.remove('keyboard__buttons__button--pressed');
  });
      switch (key){
        case 'micro':
          keyElement.classList.add('keyboard__buttons__button__volume');
          keyElement.innerHTML = `<img src ='./microphone.png'></img>`;
          keyElement.dataset.micro = true;
          keyElement.addEventListener('click', () =>{
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
            keyElement.classList.toggle('keyboard__buttons__button__active');
            this.isRecord = !this.isRecord;
           this.isRecord?  this._microListener('start') : this._microListener('stop');
           this.input.focus();
          })
        break;
        case 'volume':
          keyElement.classList.add('keyboard__buttons__button__volume');
          keyElement.innerHTML = `<img src ='./speaker.png'></img>`;
          keyElement.dataset.volume = true;
          keyElement.addEventListener('click', () =>{
            let sound = new Audio('./audio/main.mp3');
              sound.play();
            keyElement.classList.toggle('keyboard__buttons__button__active');
            
            this.isMute =!this.isMute;


            this.input.focus();
          })
        break;
        

        case 'backspace':
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = "&larr;";
          keyElement.dataset.backspace = true;
          keyElement.addEventListener('click', () =>{
          
            const start = this.input.selectionStart;
          const end = this.input.selectionEnd;
            if(start > 0)
          {
            this.input.setRangeText('', start -1, end, 'end');
          }
          this.input.focus()
          if(!this.isMute){
              
            let sound = new Audio('./audio/click2.mp3');
            sound.play();
          }
          

          })
        break;

        case 'caps':
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = "Caps";
          keyElement.dataset.caps = true;
          keyElement.addEventListener('click', () =>{
            this.capsLock = !this.capsLock;
            keyElement.classList.toggle('keyboard__buttons__button__active');
            this._updateCaps();
            if(!this.isMute){
              let sound = new Audio('./audio/click5.mp3');
              sound.play();
              
            }
          })
        break;

        case 'enter': 
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = '&crarr;';
          keyElement.dataset.enter = true;
          keyElement.addEventListener('click', () => {
            if(!this.isMute){
              
              let sound = new Audio('./audio/click4.mp3');
              sound.play();
            }
            this.input.value += '\n';
            this.input.focus();
          })
        break;

        case 'done': 
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = '&#10004;';
          keyElement.addEventListener('click', ()=>{
            let sound = new Audio('./audio/main.mp3');
            sound.play();
            this.keyboard.classList.add('keyboard__hidden');
          })
        break;

        case 'space': 
          keyElement.classList.add('keyboard__buttons__button__space');
          keyElement.innerHTML = '___';
          keyElement.dataset.space = true;
          keyElement.addEventListener('click', () => {
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
            
              this.input.value += ' ';
              
              this.input.focus();
          })
        break;

        case 'shift':
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = '&uArr;';
          keyElement.dataset.shift = true;
          keyElement.addEventListener('click', () =>{

            if(!this.isMute){
              
              let sound = new Audio('./audio/click3.mp3');
              sound.play();
            }
            this.shift = !this.shift;
            this.capsLock = !this.capsLock;

            keyElement.classList.toggle('keyboard__buttons__button__active');
            this._updateShift();
            this.input.focus();
          })
        break;

        case 'lang':
          keyElement.classList.add('keyboard__buttons__button__wide');
          keyElement.innerHTML = 'ENG';
          keyElement.addEventListener('click', () =>{
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
              this.isRus = !this.isRus;
              this.isRus ? keyElement.innerHTML = 'RUS' : keyElement.innerHTML = 'ENG';
              this._updateLang();
              this.input.focus();
          })
        break;

        case 'left':
          keyElement.innerHTML = '&larr;';
          keyElement.addEventListener('click', () =>{
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
             
            const start = this.input.selectionStart;
          const end = this.input.selectionEnd;
            if(start > 0)
          {this.input.setRangeText('', start -1, end -1, 'end');
          }
          this.input.focus()
            
          })
        break;

        case 'right':
          keyElement.innerHTML = '&rarr;';
          keyElement.addEventListener('click', () =>{
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
            const start = this.input.selectionStart;
            const end = this.input.selectionEnd;
            this.input.setRangeText('', start +1, end +1, 'end');
            this.input.focus()
           
          })
        break;

        default:
          keyElement.textContent = key;
          if('qwertyuiopasdfghjklzxcvbnm'.indexOf(keyElement.textContent) !== -1){
              keyElement.dataset.letter = true;
              keyElement.dataset.digit = `Key${keyElement.textContent.toUpperCase()}`
          }
          if('1234567890,./'.indexOf(keyElement.textContent) !== -1){
            keyElement.dataset.number = true;
        }
        if('1234567890'.indexOf(keyElement.textContent) !== -1){
          keyElement.dataset.digit = `Digit${keyElement.textContent}`;
      }

          keyElement.dataset.isCups = true;
          keyElement.addEventListener('click', () => {
            
            const start = this.input.selectionStart;
            const end = this.input.selectionEnd;
            this.input.setRangeText(keyElement.innerText, start, end, 'end');
            this.input.focus()
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
            
          })
        break;
      }
      
      fragment.appendChild(keyElement);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    })
    // const voiceKey = document.createElement('button');
    //       voiceKey.classList.add('keyboard__buttons__button');
    //       fragment.appendChild(voiceKey)

    return fragment;
   },


   _updateCaps(){
    this.keys.forEach(key => {
        if(key.dataset.isCups){
          this.capsLock ?  key.innerText =  key.innerText.toUpperCase() : key.innerText = key.innerText.toLowerCase();
        }
    })
    this.input.focus();
    
   },
   _updateShift(){
    let i = 0;
    const shiftKeyLayout = [ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "<", ">", "?"];
    const rusShiftKeyLayout = [ "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "<", ">", "?"];
    const numberLayout = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", ".", "/"];

    if(this.shift){
      this.keys.forEach(key =>{
        if(key.dataset.number){
           this.isRus ? key.innerText = rusShiftKeyLayout[i] : key.innerText = shiftKeyLayout[i];
            i++;
        }
        
      })
    } else {
      this.keys.forEach(key =>{
        if(key.dataset.number){
            key.innerText = numberLayout[i];
            i++;
        }
      })
    }

  this._updateCaps();
  
 },
    _updateLang(){
    let i = 0;
   const rusKeyLayout = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з",
       "ф", "ы", "в", "а", "п", "р", "о", "л", "д", 
       "я", "ч", "с", "м", "и", "т", "т", "б", "ю", ".",
    ];
    const engKeyLayout= 
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
     "a", "s", "d", "f", "g", "h", "j", "k", "l", 
     "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",]
   if(this.isRus) {
      this.keys.forEach(key => {
      if(key.dataset.isCups) {
        key.innerText = rusKeyLayout[i];
        i++;
      }
    })
  }else {
    this.keys.forEach(key => {
      if(key.dataset.isCups) {
        key.innerText = engKeyLayout[i];
        i++;
      }
    })
  }

  },

    _keyListener(e){
     
        this.keys.forEach(key =>{
              
            switch(e.code){
           case key.dataset.digit:
            e.preventDefault();
            key.classList.add('keyboard__buttons__button__active');
           setTimeout(() =>{
           key.classList.remove('keyboard__buttons__button__active');
         },70)
            if(!this.isMute){
              if(this.isRus){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            } else {
              let sound = new Audio('./audio/click1.mp3');
              sound.play();
            }
            }
         key.click();
          break;
          case 'Backspace':
           if(key.dataset.backspace) 
             {
              if(!this.isMute){
              
                let sound = new Audio('./audio/click2.mp3');
                sound.play();
              }
              key.classList.add('keyboard__buttons__button__active');
              setTimeout(() =>{
              key.classList.remove('keyboard__buttons__button__active');
            },70)
            }
          break;
          case 'Space':
          if(key.dataset.space) {
            if(!this.isMute){
              let sound = new Audio('./audio/main.mp3');
              sound.play();
            }
            key.classList.add('keyboard__buttons__button__active');
           setTimeout(() =>{
           key.classList.remove('keyboard__buttons__button__active');
         },70)
          }
       break;
       case 'Enter':
          if(key.dataset.enter) 
          {
            if(!this.isMute){
            
              let sound = new Audio('./audio/click4.mp3');
              sound.play();
            }
           key.classList.add('keyboard__buttons__button__active');
           setTimeout(() =>{
           key.classList.remove('keyboard__buttons__button__active');
         },70)
         }
       break;
       case 'CapsLock':
          if(key.dataset.caps) key.click();
       break;
       case 'ShiftLeft':
          if(key.dataset.shift) key.click();
       break;
       case 'ShiftRight':
          if(key.dataset.shift) key.click();
       break;
        
      }
        })
    },

   

}

window.addEventListener("DOMContentLoaded", () => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  Keyboard.start();
});