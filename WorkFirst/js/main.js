const postData = async (url, data) => {
  let res = await fetch(url, {
    method: "POST",
    body: data
  });

  return await res.text();
};

const forms = (state) => {
  const form = document.querySelectorAll('form'),
    inputs = document.querySelectorAll('input'),
    emailInput = document.getElementById('email'),
    messageInput = document.getElementById('message');


  const validate = (form_id, email) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var address = document.forms[form_id].elements[email].value;
    if (reg.test(address) == false) {
      emailInput.classList.add('error')
      emailInput.classList.remove('success')
    } else {
      emailInput.classList.remove('error')
      emailInput.classList.add('success')
    }
  }

  emailInput.addEventListener('change', () => {
    validate('feedbakForm', 'email')
  })


  const message = {
    loading: 'Загрузка...',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
    spinner: 'images/spinner.gif',
    ok: 'images/ok.png',
    fail: 'images/error.png'
  };

  const path = {
    designer: 'server.php',
    question: 'question.php'
  };

  const clearInputs = () => {
    inputs.forEach(item => {
      item.value = '';
    });
    messageInput.value = '';
  };



    form.forEach(item => {
      item.addEventListener('submit', (e) => {
        e.preventDefault();
  
        let statusMessage = document.createElement('div');
        statusMessage.classList.add('status');
        item.parentNode.appendChild(statusMessage);
  
        item.classList.add('animated', 'fadeOutUp');
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
  
        let statusImg = document.createElement('img');
        statusImg.setAttribute('src', message.spinner);
        statusImg.classList.add('animated', 'fadeInUp');
        statusMessage.appendChild(statusImg);
  
        let textMessage = document.createElement('div');
        textMessage.textContent = message.loading;
        statusMessage.appendChild(textMessage);
  
        const formData = new FormData(item);
  
        if (item.getAttribute('data-calc') === "calc") {
          for (let key in state) {
            formData.append(key, state[key]);
          }
        }
  
        let api;
        item.closest('.popup-design') || item.classList.contains('calc-form') ? api = path.designer : api = path.question;
        console.log(api);
  
        postData(api, formData)
          .then(res => {
            console.log(res);
            statusImg.setAttribute('src', message.ok);
            textMessage.textContent = message.success;
          })
          .catch(() => {
            statusImg.setAttribute('src', message.fail);
            textMessage.textContent = message.failure;
          })
          .finally(() => {
            clearInputs();
            setTimeout(() => {
              statusMessage.remove();
              item.style.display = 'block';
              item.classList.remove('fadeOutUp');
              item.classList.add('fadeInUp');
              emailInput.classList.remove('success')
            }, 5000);
          });
      });

    });
  



};

forms();

function ibg() {

     let ibg = document.querySelectorAll(".bg-image");
     for (var i = 0; i < ibg.length; i++) {
         if (ibg[i].querySelector('img')) {
             ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
         }
     }
 }
 
 ibg();
const mask = (selector) => {

     let setCursorPosition = (pos, elem) => {
         elem.focus();
         
         elem.addEventListener('click', function () {
             if (elem.setSelectionRange) {
                 elem.setSelectionRange(pos, pos);
             } else if (elem.createTextRange) {
                 let range = elem.createTextRange();
 
                 range.collapse(true);
                 range.moveEnd('character', pos);
                 range.moveStart('character', pos);
                 range.select();
             }
         });
     };
 
     function createMask(event) {
         let matrix = '+7 (___) ___-__-__',
             i = 0,
             def = matrix.replace(/\D/g, ''),
             val = this.value.replace(/\D/g, '');
 
         if (def.length >= val.length) {
             val = def;
         }
 
         this.value = matrix.replace(/./g, function (a) {
             return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
         });
 
         if (event.type === 'blur') {
             if (this.value.length == 2) {
                 this.value = '';
             }
         } else {
             setCursorPosition(this.value.length, this);
         }
     }
 
     let inputs = document.querySelectorAll(selector);
 
     inputs.forEach(input => {
         input.addEventListener('input', createMask);
         input.addEventListener('focus', createMask);
         input.addEventListener('blur', createMask);
     });
 };

 mask(".feedbak__phone");

/**
 
  * название функции
  *
  * @param {number} first - первое число
  * @returns {number}
  */



//# sourceMappingURL=main.js.map
