function updateSliderTooltipPosition(values, handle, unencoded, tap, positions) {
    let slider = document.getElementById(this.target.getAttribute('id'))
    let tooltips = slider.getElementsByClassName('noUi-tooltip')
    moveSliderTooltipPosition(slider, tooltips[0], tooltips[1])
}

function initSliderTooltipPosition(sliderId) {
    let slider = document.getElementById(sliderId)
    let tooltips = slider.getElementsByClassName('noUi-tooltip')
    moveSliderTooltipPosition(slider, tooltips[0], tooltips[1])
}

function moveSliderTooltipPosition(slider, leftTip, rightTip) {
    let sliderPosition = slider.getBoundingClientRect()
    
    leftTip.style.transform = ''
    rightTip.style.transform = ''
    let spacer = 10
    
    let leftTipPosition = leftTip.getBoundingClientRect()
    let rightTipPosition = rightTip.getBoundingClientRect()

    // fix left tooltip position
    if (leftTipPosition.x < sliderPosition.x) {
        let amount = (sliderPosition.x - leftTipPosition.x) - (leftTipPosition.width/2)
        leftTip.style.transform = 'translate(' + amount.toString() + 'px)'
    }
    // fix right tooltip position
    if (rightTipPosition.x + rightTipPosition.width > sliderPosition.x + sliderPosition.width) {
        let amount = ((sliderPosition.x + sliderPosition.width) - (rightTipPosition.x + rightTipPosition.width)) - (rightTipPosition.width/2)
        rightTip.style.transform = 'translate(' + amount.toString() + 'px)'
    }

    // get the new tooltips position
    leftTipPosition = leftTip.getBoundingClientRect()
    rightTipPosition = rightTip.getBoundingClientRect()

    // fix tooltips overlap
    if (leftTipPosition.x + leftTipPosition.width > rightTipPosition.x - spacer) {
        let overlap = (leftTipPosition.x + leftTipPosition.width) - rightTipPosition.x 
        let leftCanMove = parseInt(leftTipPosition.x - sliderPosition.x)
        let rightCanMove = parseInt((sliderPosition.x + sliderPosition.width) - (rightTipPosition.x + rightTipPosition.width))
        if (leftCanMove <= 0) {
            let amount = overlap + spacer - (rightTipPosition.width/2)
            rightTip.style.transform = 'translate(' + amount.toString() + 'px)'
        }
        if (rightCanMove <= 0) {
            let amount = -(overlap + spacer) - (leftTipPosition.width/2)
            leftTip.style.transform = 'translate(' + amount.toString() + 'px)'
        }
        if (leftCanMove > 0 && rightCanMove > 0) {
            let needToMove = overlap/2 + spacer/2
            let leftMove = leftCanMove >= needToMove ? -needToMove : -leftCanMove
            let rightMove = rightCanMove >= needToMove ? needToMove : rightCanMove
            if (leftMove === -leftCanMove) {
                rightMove += (needToMove - leftCanMove)
            }
            if (rightMove === rightCanMove) {
                leftMove -= (needToMove - rightCanMove)
            }
            leftMove -= (leftTipPosition.width/2)
            rightMove -= (rightTipPosition.width/2)
            leftTip.style.transform = 'translate(' + leftMove.toString() + 'px)'
            rightTip.style.transform = 'translate(' + rightMove.toString() + 'px)'
        }
    }
}
