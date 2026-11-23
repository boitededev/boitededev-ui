// Sur mobile, .navbar-links défile horizontalement : on centre le lien actif
// dans son conteneur. On ne touche qu'au défilement horizontal de ce conteneur
// (scrollIntoView ferait aussi défiler la page verticalement).
export function centerHorizontally(element) {
  let scroller = element.parentElement
  while (scroller && scroller !== document.body && scroller.scrollWidth <= scroller.clientWidth) {
    scroller = scroller.parentElement
  }
  if (!scroller || scroller === document.body) return

  const box = element.getBoundingClientRect()
  const scrollerBox = scroller.getBoundingClientRect()
  scroller.scrollLeft += (box.left + box.width / 2) - (scrollerBox.left + scrollerBox.width / 2)
}
