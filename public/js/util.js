function findOwner(element, tagName) {

    let item = element.parnentNode;
    while (item.tagName != tagName) {
        item = item.parentNode
    }
    return item
}