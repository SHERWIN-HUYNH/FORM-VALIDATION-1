// Ham cung la 1 doi tuong 
// rules la 1 mang chua cac ham, ham return lai cai tuong ung 
// Co the lay duoc id cua tung input bang cach chay vong forEach, do rules la 1 mang [], tung phan tu lai la object .
function Validator(options){
    // 1
    var formElement = document.querySelector(options.form)
    var selectorRules = []
    //7
    //Tim parent co class la selector
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector))
                return element.parentElement
            else
                element = element.parentElement
        }
    }
    //Xoa bo hanh vi mac dinh khi an submit dong thoi kiem tra toan bo du lieu khi submit
    // 5
    if (formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isValid = true;
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector)
                // CHECK input dung hay ko
               
                    var valid = validate(inputElement,rule)
                    if (valid == false)
                    isValid = false
              
                
            })
            if (isValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                    switch(input.type){
                        case 'radio':
                            if(input.matches(':checked'))
                            values[input.name] = input.value
                        
                        break;
                        case 'checkbox':
                            if(!input.matches(':checked')){
                                values[input.name] = ''
                                return values
                            } 
                            if(!Array.isArray(values[input.name]))
                                values[input.name] =[]
                            values[input.name].push(input.value) 
                       
                        break;
                        case 'file':
                            values[input.name] = input.files
                        break;
                        default:
                            values[input.name] = input.value
                    }
                    return values
                },{})
                options.onSubmit(formValues)
                }else{
                    formElement.submit()
                }
            }

        }
       
    }
    // Thuc hien kiem tra input va tra ve message loi
 
    // 4
    function validate(inputElement,rule){
        var errorMessage;
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
        // rules nay chua cac ham test cua tung input
        var rules = selectorRules[rule.selector]
        for (var i = 0; i < rules.length;i++){

            switch(inputElement.type){
                case 'checkbox':
                case 'radio':
                  
                   errorMessage = rules[i](
                    formElement.querySelector(rule.selector +":checked").value
                   )

                    
                break;
                default:
                    errorMessage = rules[i](inputElement.value)

            }
           
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage
             getParent(inputElement,options.formGroupSelector).classList.add('invalid')
        }else {
            errorElement.innerText = "";
             getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }
        // Tra ve true neu co gia tri cua errorMessage
        return !errorMessage
                
    }
//    2
    if (formElement){
        // Xu ly lap qua 
       options.rules.forEach(function (rule) {
        // Luu lai all rules cua tung selector ( selector = id the input)
        if (Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
            selectorRules[rule.selector] = [rule.test]
        }
    //    3
        var inputElements = formElement.querySelectorAll(rule.selector)
        Array.from(inputElements).forEach(function(inputElement){
            if (inputElement){
                // Xử lý trường hợp onblur (khi user di chuyen chuot khoi vung input)
                inputElement.onblur = function (){
                    
                    var valid = validate(inputElement,rule)
                }
                // Xử lý trường hợp oninput ( khi người dùng đang nhập dữ liệu)
                inputElement.oninput = function(){
                    var errorElement =  getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = "";
                     getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            }
        })
        
      
            
       });
    }
}
// DINH NGHIA RULES
// Khi có lỗi trả về message lỗi, khi đung thì ko trả về gì cả
// 0
Validator.isRequired = function(selector){
    return {
        selector:selector,
        test: function(value){
            return value ? undefined: "Vui lòng nhập trường này"
        }
    }
}
Validator.isEmail = function(selector){
     return {
        selector:selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined:"Vui lòng nhập email"
        }
    }
}

Validator.minLength = function(selector,min){
    return {
        selector:selector,
        test: function(value){
            return value.length >= min ? undefined: `Vui long nhap toi thieu ${min} ky tu`
        }
    }
}

Validator.isConfirmed = function(selector,getConfirmValue){
    return {
        selector:selector,
        test: function(value){
            return value === getConfirmValue() ? undefined: "Giá trị nhập vào không hợp lệ"
        }
    }
}