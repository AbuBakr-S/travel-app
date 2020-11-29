import { getPlaceName } from './js/main'
import { performAction } from './js/main'

import img from './assets/hero.jpg'

window.addEventListener('DOMContentLoaded',function(){
    document.getElementById('backgroundImage').setAttribute('src', img);
})

import './styles/style.scss'

export { 
    getPlaceName,
    performAction
}