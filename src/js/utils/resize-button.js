export default class ResizeButton {
  constructor(parent) {
    this.parent = parent;
    this.maximizeButton = document.createElement('button');
    this.maximizeButton.setAttribute('title', 'Maximize');
    this.maximizeButton.classList.add('resize-btn', 'maximize', 'active');
    this.maximizeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"
              width="12px" height="12px">
              <path vector-effect="non-scaling-stroke"
              d="M9.645 5.648L13.244 2h-3.205V1h4.9v5h-1V2.719l-3.584 3.633zm-4 4L2.06 13.281V10h-1v5h4.9v-1H2.756l3.6-3.648zM14 10.04v3.205l-3.648-3.6-.704.711 3.633 3.584H10v1h5v-4.9zM2 2.756l3.648 3.6.704-.711L2.719 2.06H6v-1H1v4.9h1z"></path>
            </svg>`;

    this.minimizeButton = document.createElement('button');
    this.minimizeButton.classList.add('resize-btn', 'minimize');
    this.minimizeButton.setAttribute('title', 'Minimize');
    this.minimizeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"
              width="12px" height="12px">
              <path vector-effect="non-scaling-stroke"
              d="M11.719 11.06l3.633 3.585-.704.71L11 11.756v3.205h-1v-4.9h5v1zM5 4.245L1.352.644l-.704.711L4.281 4.94H1v1h5v-4.9H5zM14.96 5h-3.204l3.6-3.648-.711-.704-3.584 3.633V1h-1v5h4.9zM1.04 11h3.204l-3.6 3.648.711.704 3.584-3.633V15h1v-5h-4.9z"></path>
            </svg>`;

    this.parent.append(this.maximizeButton, this.minimizeButton);

    this.handleMaximizeButtonClick();
    this.handleMinimizeButtonClick();
    this.handleScreenModeChange();
  }

  handleMaximizeButtonClick() {
    this.maximizeButton.addEventListener('click', () => {
      this.parent.requestFullscreen().catch((error) => {
        throw error;
      });
    });
  }

  handleMinimizeButtonClick() {
    this.minimizeButton.addEventListener('click', () => {
      document.exitFullscreen();
    });
  }

  handleScreenModeChange() {
    this.parent.addEventListener('fullscreenchange', () => {
      this.maximizeButton.classList.toggle('active');
      this.minimizeButton.classList.toggle('active');
      this.parent.classList.toggle('fullscreen');
    });
  }
}
