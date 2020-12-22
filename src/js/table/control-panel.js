export default class controlPanel {
  constructor(element, type, base) {
    this.menuItems = element.querySelectorAll('.item');
    this.menu = element.querySelector('.popup-menu');
    this.selectButton = element.querySelector('.select-btn');
    this.leftArrow = element.querySelector('.arrow.left');
    this.rightArrow = element.querySelector('.arrow.right');

    this.selectButton.addEventListener('click', () => {
      this.menu.classList.add('active');
    });
    this.menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        base.data[type] = item.textContent;
        base.update();
        this.menu.classList.remove('active');
      });
    });
    const setMenuItem = (x) => {
      const item = base.data[type];
      const items = [...this.menuItems].map((i) => i.textContent);
      let index = items.indexOf(item);
      index += x;
      index = index < 0 ? items.length - 1 : index % items.length;
      base.data[type] = items[index];
      base.update();
    };
    this.leftArrow.addEventListener('click', () => {
      setMenuItem(-1);
    });
    this.rightArrow.addEventListener('click', () => {
      setMenuItem(1);
    });
  }
}
