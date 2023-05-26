const FOOD_PIZZA = "pizza"
const FOOD_HAMBURGER = "hamburger"
const FOOD_BEER = "beer"
const COMPLETE_ORDER_BTN_ID ="complete-order-btn"
const PAYMENT_BTN_ID = "pay-btn"
const PAYMENT_FORM_ID = "payment-form"

const checkOutContainerEl = document.getElementById("check-out-container")
const checkOutItemContainerEl = document.getElementById("check-out-item-container")
const paymentContainerEl = document.getElementById("check-out-total-container")
const paymentEl = document.getElementById("payment-form")
const paymentCompleteEl =document.getElementById("payment-complete-container")
const paymentMsgEl = document.getElementById("payment-complete-msg")
let orderedFoodList = []

document.addEventListener("click", function(event) {
    if(event.target.dataset.food) {
        handleAddToCartEvent(event)
    }
    else if(event.target.dataset.remove) {
        handleRemoveFromCartEvent(event)
    }
    else if(event.target.id === COMPLETE_ORDER_BTN_ID) {
        processOrder()
    }
    else if(event.target.id === PAYMENT_BTN_ID) {
        processPayment(event)
    }
}) 

function handleAddToCartEvent(event) {
    addFoodToCart(createFoodObject(event.target.dataset.food))
    render()
}

function handleRemoveFromCartEvent(event) {
    removeFoodFromCart(event.target.dataset.remove)
    render()
}

function createFoodObject(name) {
    let food
    if(name == FOOD_PIZZA) {
        food = {
            name: "Pizza",
            qty: 1,
            price: 14,
            total_price: 1*14,
            desc: ["pepperoni", "mushroom", "mozarella"]
        }
    }
    else if(name == FOOD_HAMBURGER) {
        food = {
            name: "Hamburger",
            qty: 1,
            price: 12,
            total_price: 1*12,
            desc: ["beef", "cheese", "lettuce"]
        }
    }
    else if(name == FOOD_BEER) {
        food = {
            name: "Beer",
            qty: 1,
            price: 12,
            total_price: 1*12,
            desc: ["grain", "hops", "yeast", "water"]
        }
    }

    return food
}

function addFoodToCart(food) {
   if(!foodAlreadyExist(food)) {
        orderedFoodList.push(food)
   }
}

function removeFoodFromCart(foodName) {
    for(let i = 0; i < orderedFoodList.length; i++) {
        let currentFood = orderedFoodList[i]
        if(currentFood.name === foodName) {
            if(currentFood.qty !== 1 ) {
                currentFood.qty--
                currentFood.total_price = currentFood.qty * currentFood.price
            }
            else {
                orderedFoodList.splice(i,1)
            }
        }
    }
}

function foodAlreadyExist(food) {
    let exists = false
    orderedFoodList.forEach(function(currentFood) {
        if(food.name === currentFood.name) {
            currentFood.qty++
            currentFood.total_price = currentFood.qty * currentFood.price
            exists = true
        }
    })

    return exists
}

function processOrder() {    
    paymentEl.removeAttribute("hidden")
}

function processPayment(event) {    
    let isFormValid = paymentEl.checkValidity();
    if(!isFormValid) {
        paymentEl.reportValidity();
    }
    else {
        event.preventDefault()
        const formData = new FormData(paymentEl)
        const customerName = formData.get("customer-name")
        const cardNumber = formData.get("card-number")
        const cvvNumber = formData.get("cvvNumber")
        paymentEl.setAttribute("hidden",true)
        checkOutContainerEl.setAttribute("hidden",true)
        paymentCompleteEl.removeAttribute("hidden")
        paymentMsgEl.textContent = `Thanks, ${customerName}! Your order is on its way!`
    }
}

function render() {
    checkOutItemContainerEl.innerHTML = getCheckOutListHtml()
    paymentContainerEl.innerHTML = getPaymentTotalHtml()

    //If our food list array contains elements then we remove hidden to show our element
    if(orderedFoodList.length > 0) {
        checkOutContainerEl.removeAttribute("hidden")
    }
    //Otherwise we set it to hidden
    else {
        checkOutContainerEl.setAttribute("hidden",true)
    }
}

function getPaymentTotalHtml() {
    let innerHtml = ""
    let totalPrice = 0;
    orderedFoodList.forEach(function(food){
        totalPrice += food.total_price 
    })

    innerHtml =
        `<p class="total-price-text item-style total-style">Total price:</p>
         <p class="total-price item-style total-style">$${totalPrice}</p>`

    return innerHtml
}

function getCheckOutListHtml() {
    let innerHtml = ""
    orderedFoodList.forEach(function(food) {
        innerHtml += 
        ` <div class="check-out-item-list-container">
            <div class="check-out-inner-container">
                <p class="check-out-item item-style">${food.name}</p> 
                <a href="javascript:void(0)" class="remove-item" data-remove="${food.name}">remove</a>
            </div>
            <div class="check-out-price-container">
                <p class="check-out-price  item-style">$${food.price}</p> 
                <p class="check-out-qty ">X ${food.qty}</p>  
                <p class="check-out-price-total item-style">$${food.total_price}</p>
            </div>
        </div>`
    })

    return innerHtml
}