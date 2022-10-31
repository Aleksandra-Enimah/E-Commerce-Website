//variables
const cartBtn = document.querySelector('.cart-btn')
const closeCart = document.querySelector('.close-cart')
const clearCart = document.querySelector('.clear-btn')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.dresses-div')
//main cart
let cart = []
let buttonsDOM = []
//getting the products
class Products {
  async getProducts(){
    try{
        let result = await fetch("products.json")
        let data = await result.json()
        let products = data.items 
        products = products.map(item =>{
         const {title,price} = item.fields 
         const {id} = item.sys 
         const image = item.fields.image.fields.file.url
         const imageOverlay = item.fields.image_overlay.fields.file.url
         return {title,price,id,image,imageOverlay} 
        })
        return products
    } catch(error){
        console.log(error)
    }
  }
}
//display products
class UI {
 displayProducts(products){
  let result = ''
  products.forEach(product => {
    result += `
    <article class="dress-product">
        <div class="img-container">
            <img class="dress-img" src=${product.image}>
            <div class="overlay">
                <img class="dress-img" src=${product.imageOverlay}>
            </div>
        </div>
        <div class="img-description">
            <button class="shop-dress-btn" data-id=${product.id}><i class="fa-solid fa-cart-arrow-down"></i></button>
            <h3>${product.price} $</h3>
            <h4>${product.title}</h4>
        </div>
    </article>
    `
    /*result += `
    <article class="shoes-product">
        <div class="img-container-shoes">
            <img class="shoes-img" src=${product.imageS}>
        </div>
        <div class="img-description">
            <button class="shop-dress-btn" data-id=${product.id}><i class="fa-solid fa-cart-arrow-down"></i></button>
            <h3>${product.priceS} $</h3>
            <h4>${product.titleS}</h4>
        </div>
    </article>
    `*/
   })
   productsDOM.innerHTML = result
 }
 getShopBtns(){
   const shopBtns = [...document.querySelectorAll('.shop-dress-btn')]
   buttonsDOM = shopBtns
    shopBtns.forEach(button =>{
        let id = button.dataset.id
        let inCart = cart.find(item => item.id === id)
        
        if(inCart){
            button.innerHTML = `<p style="color:#e08d63; font-weight:700;">in cart</p>`
            button.disabled = true
        } 
        button.addEventListener('click', (event)=>{
            event.target.innerHTML = `<p style="color:#e08d63; font-weight:700;">in cart</p>`
            event.target.disabled = true
            button.disabled = true  /* !!!!!! */
            //SIZE !!!!
            let cartItem = {...Storage.getProduct(id), /*size: 'S'*/}
            cart = [...cart, cartItem]
            Storage.saveCart(cart)
            this.setCartValues(cart)
            this.addCartItem(cartItem)
            this.showCart()
        })
        
    })
 }
 setCartValues(cart){
    let totalPrice = 0
    let itemsTotal = 0
    cart.map(item => {
        totalPrice += item.price 
        itemsTotal += 1
    })
    cartTotal.innerText = totalPrice
    cartItems.innerText = itemsTotal
}
addCartItem(item){
   const div = document.createElement('div')
   div.classList.add('.cart-item') 
   div.innerHTML = `
   <img class='cart-item-img' src=${item.image} alt="product1">
   <div>
       <h4>${item.title}</h4>
       <h3>${item.price} $</h3>
       <span class="remove-product" data-id=${item.id}>remove</span>
   </div>
   <div>
       <p>Select size:</p>
       <select name="size" id="">
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
       </select>
   </div>`
   cartContent.appendChild(div)
}
showCart(){
    cartOverlay.classList.add('transparent')
    cartDOM.classList.add('show-cart')
}
setupAPP(){
    cart = Storage.getCart()
    this.setCartValues(cart)
    this.insertInCart(cart)
    cartBtn.addEventListener('click', this.showCart)
    closeCart.addEventListener('click', this.hideCart)  
}
insertInCart(cart){
    cart.forEach(item => this.addCartItem(item))
}
hideCart(){
    cartOverlay.classList.remove('transparent') 
    cartDOM.classList.remove('show-cart')
}
cartLogic(){
    clearCart.addEventListener('click',()=>{
        this.emptyCart()
    })
    cartContent.addEventListener('click', event=>{
        if(event.target.classList.contains('remove-product')){
           let removeProduct = event.target
           let id = removeProduct.dataset.id
           cartContent.removeChild(removeProduct.parentElement.parentElement)
           this.removeItem(id)
        }
    })
        
}
emptyCart(){
    let cartItems = cart.map(item => item.id)
    cartItems.forEach(id => this.removeItem(id))
    while(cartContent.children.length > 0){
        cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart()
}
removeItem(id){
    cart = cart.filter(item => item.id !==id)
    this.setCartValues(cart)
    Storage.saveCart(cart)
    let button = this.getSingleButton(id)
    button.disabled = false
    button.innerHTML = `<i class="fa-solid fa-cart-arrow-down"></i>`
    }
getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id)
}   
}
//local storage
class Storage {
 static saveProducts(products){
    localStorage.setItem('products', JSON.stringify(products))
 }
 static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'))
    return products.find(product => product.id === id)
 }
 static saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart))
 }
 static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
 }
}

document.addEventListener('DOMContentLoaded', ()=>{
const ui = new UI()
const products = new Products()
ui.setupAPP()
//get all products
products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
}).then(()=>{
    ui.getShopBtns()
    ui.cartLogic()
})
})






