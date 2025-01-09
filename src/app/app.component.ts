import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  firstNode: null | HTMLElement = null;
  secondNode: null | HTMLElement = null;
  secondNodeLine: null | HTMLElement = null;

  title = 'path-placing-game-mechanic';
  @ViewChild('grid') gridArea!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('canvasElementLine') canvasElementLine!: ElementRef;
  @ViewChild('svgElement') svgElement!: ElementRef;

  roads: SVGPathElement[] = [];
  currentRoadDirection: string | null = null;

  constructor() {
  }

  ngAfterViewInit() {
    this.generate_grid();
  }

  generate_grid() {
    let counter = 0;
    let x = 100;
    let y = 60;
    // const nodes: { x: number, y: number }[] = [];
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
    const canvasLine = this.canvasElementLine.nativeElement;
    const ctxline = canvasLine.getContext('2d');
    if (ctxline) {
      canvasLine.width = window.innerWidth;
      canvasLine.height = window.innerHeight;
    }
    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.style.left = `${x - 90 / 2}px`;
        node.style.top = `${y - 90 / 2}px`;
        node.classList.add('node');
        node.id = `node-${counter}`;
        node.onclick = (event) => {
          const target = event.target as HTMLElement | null;
          if (target) {
            this.getPosition(target);
          }
        };
        node.onmouseover = (event) => {
          const target = event.target as HTMLElement | null;
          if (target && this.firstNode != null && this.secondNode == null) {
            this.getPositionLine(target);
          }
        };
        if (i != 19) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + 90, y);
        }
        if (j != 9) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 90);
        }

        x += 90;
        counter++;
        this.gridArea.nativeElement.appendChild(node);
      }
      x = 100;
      y += 90;
    }
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 1 + 'px';
    ctx.stroke();
    y = 60;
  }

  getPosition(node: HTMLElement) {
    const nodeId = node.id;
    if (this.firstNode == null) {
      this.firstNode = node;
      node.style.backgroundColor = '#2dc115';
      node.style.opacity = '0.8';
      return
    }
    if (this.firstNode == node) {
      this.currentRoadDirection = null;
      this.firstNode = null;
      this.secondNodeLine = null;
      node.style.backgroundColor = '#817e7e';
      node.style.opacity = '0.0';
      return
    } else {
      this.secondNode = node;
      const firstPos = this.firstNode.getBoundingClientRect();
      const firstPosX = firstPos.left + 45;
      const firstPosY = firstPos.top + 45;
      const secPos = this.secondNode.getBoundingClientRect();
      const secPosX = secPos.left + 45;
      const secPosY = secPos.top + 45;
      this.findEndOfRoad(`${firstPosX}${firstPosY}`);
      if (firstPosX != null && firstPosY != null && secPosX != null && secPosY) {
        console.log('Position2X - Position1:', `${secPosX - firstPosX}`);
        console.log('Position1Y - Position2Y:', `${secPosY - firstPosY}`);
        const svg = this.svgElement.nativeElement;
        const canvas = this.canvasElementLine.nativeElement;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        console.log('Position1:', `X: ${firstPosX}, Y: ${firstPosY}`);
        console.log('Position2:', `X: ${secPosX}, Y: ${secPosY}`);

        // Curved road up right
        if (secPosX > firstPosX && secPosY < firstPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this.currentRoadDirection == 'right' || this.currentRoadDirection == 'downright' || this.currentRoadDirection == 'upright') {
              // From left
              path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45}, A ${(secPosX - 45) - firstPosX} ${secPosY - (firstPosY - 45)} 1 0 0  ${secPosX - 45} ${secPosY},
                L ${secPosX + 45} ${secPosY}, A ${secPosX + 45 - firstPosX} ${firstPosY + 45 - secPosY} 0 0 1 ${firstPosX} ${firstPosY + 45}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'downleft');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'rightup');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
            if (this.currentRoadDirection == 'up' || this.currentRoadDirection == 'rightup' || this.currentRoadDirection == 'leftup') {
              //From down
              path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY}, A ${secPosX - (firstPosX - 45)} ${(secPosY - 45) - firstPosY} 0 0 1  ${secPosX} ${secPosY - 45},
                L ${secPosX} ${secPosY + 45}, A ${secPosX - (firstPosX + 45)} ${secPosY + 45 - firstPosY} 1 0 0 ${firstPosX + 45} ${firstPosY}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'leftdown');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'upright');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
          }
        }
        // Curved road down right
        if (secPosX > firstPosX && secPosY > firstPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            console.log('Direction:', this.currentRoadDirection);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this.currentRoadDirection == 'right' || this.currentRoadDirection == 'downright' || this.currentRoadDirection == 'upright') {
              // From left
              path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45}, A ${secPosX + 45 - firstPosX} ${secPosY - (firstPosY - 45)} 0 0 1  ${secPosX + 45} ${secPosY},
                L ${secPosX - 45} ${secPosY}, A ${(secPosX - 45) - firstPosX} ${secPosY - (firstPosY + 45)} 0 0 0 ${firstPosX} ${firstPosY + 45}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'upleft');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'rightdown');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
            if (this.currentRoadDirection == 'down' || this.currentRoadDirection == 'rightdown' || this.currentRoadDirection == 'leftdown') {
              //From up
              path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY}, A ${secPosX - (firstPosX - 45)} ${secPosY + 45 - firstPosY} 0 0 0  ${secPosX} ${secPosY + 45},
                L ${secPosX} ${secPosY - 45}, A ${secPosX - (firstPosX + 45)} ${(secPosY - 45) - firstPosY} 0 0 1 ${firstPosX + 45} ${firstPosY}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'leftup');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'downright');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
          }
        }
        // Curved road up left
        if (firstPosX > secPosX && firstPosY > secPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this.currentRoadDirection == 'left' || this.currentRoadDirection == 'downleft' || this.currentRoadDirection == 'upleft') {
              // From right
              path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45}, A ${firstPosX - (secPosX + 45)} ${(firstPosY - 45) - secPosY} 0 0 1  ${secPosX + 45} ${secPosY},
                L ${secPosX - 45} ${secPosY}, A ${firstPosX - (secPosX - 45)} ${firstPosY + 45 - secPosY} 0 0 0 ${firstPosX} ${firstPosY + 45}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'downright');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'leftup');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
            if (this.currentRoadDirection == 'up' || this.currentRoadDirection == 'rightup' || this.currentRoadDirection == 'leftup') {
              //From down
              path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY}, A ${(firstPosX - 45) - secPosX} ${firstPosY - (secPosY + 45)} 0 0 0  ${secPosX} ${secPosY + 45},
                L ${secPosX} ${secPosY - 45}, A ${firstPosX + 45 - secPosX} ${firstPosY - (secPosY - 45)} 0 0 1 ${firstPosX + 45} ${firstPosY}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'rightdown');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'upleft');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
          }
        }
        // Curved road down left
        if (firstPosX > secPosX && firstPosY < secPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (this.currentRoadDirection == 'left' || this.currentRoadDirection == 'downleft' || this.currentRoadDirection == 'upleft') {
              // From right
              path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45}, A ${firstPosX - (secPosX - 45)} ${secPosY - (firstPosY - 45)} 1 0 0  ${secPosX - 45} ${secPosY},
                L ${secPosX + 45} ${secPosY}, A ${firstPosX - (secPosX + 45)} ${secPosY - (firstPosY + 45)} 0 0 1 ${firstPosX} ${firstPosY + 45}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'upright');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'leftdown');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
            if (this.currentRoadDirection == 'down' || this.currentRoadDirection == 'rightdown' || this.currentRoadDirection == 'leftdown') {
              //From up
              path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY}, A ${secPosX - (firstPosX - 45)} ${(secPosY - 45) - firstPosY} 0 0 1  ${secPosX} ${secPosY - 45},
                L ${secPosX} ${secPosY + 45}, A ${secPosX - (firstPosX + 45)} ${secPosY + 45 - firstPosY} 1 0 0 ${firstPosX + 45} ${firstPosY}, Z`);
              path.setAttribute('stroke', '#2dc115');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('fill', '#2dc115');

              path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
              path.setAttribute('data-start', 'rightup');
              path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
              path.setAttribute('data-end', 'downleft');

              path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

              this.roads.push(path);
              console.log('Roads:', this.roads);

              this.svgElement.nativeElement.appendChild(path);
            }
          }
        }
        //up
        if (firstPosX == secPosX && firstPosY > secPosY) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY},L ${secPosX - 45} ${secPosY}, L ${secPosX + 45} ${secPosY}, L ${firstPosX + 45} ${firstPosY} , Z`);
          path.setAttribute('stroke', '#2dc115');
          path.setAttribute('stroke-width', '1');
          path.setAttribute('fill', '#2dc115');

          path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
          path.setAttribute('data-start', 'down');
          path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
          path.setAttribute('data-end', 'up');

          path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

          this.roads.push(path);
          console.log('Roads:', this.roads);

          this.svgElement.nativeElement.appendChild(path);
        }
        //Down
        if (firstPosX == secPosX && firstPosY < secPosY) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${firstPosX - 45} ${firstPosY},L ${secPosX - 45} ${secPosY}, L ${secPosX + 45} ${secPosY}, L ${firstPosX + 45} ${firstPosY} , Z`);
          path.setAttribute('stroke', '#2dc115');
          path.setAttribute('stroke-width', '1');
          path.setAttribute('fill', '#2dc115');

          path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
          path.setAttribute('data-start', 'up');
          path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
          path.setAttribute('data-end', 'down');

          path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

          this.roads.push(path);
          console.log('Roads:', this.roads);

          this.svgElement.nativeElement.appendChild(path);
        }
        //Right
        if (firstPosY == secPosY && firstPosX < secPosX) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45},L ${secPosX} ${secPosY - 45}, L ${secPosX} ${secPosY + 45}, L ${firstPosX} ${firstPosY + 45} , Z`);
          path.setAttribute('stroke', '#2dc115');
          path.setAttribute('stroke-width', '1');
          path.setAttribute('fill', '#2dc115');

          path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
          path.setAttribute('data-start', 'left');
          path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
          path.setAttribute('data-end', 'right');

          path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

          this.roads.push(path);
          console.log('Roads:', this.roads);

          this.svgElement.nativeElement.appendChild(path);
        }
        //Left
        if (firstPosY == secPosY && firstPosX > secPosX) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${firstPosX} ${firstPosY - 45},L ${secPosX} ${secPosY - 45}, L ${secPosX} ${secPosY + 45}, L ${firstPosX} ${firstPosY + 45} , Z`);
          path.setAttribute('stroke', '#2dc115');
          path.setAttribute('stroke-width', '1');
          path.setAttribute('fill', '#2dc115');

          path.setAttribute('data-start-pos', `${firstPosX}${firstPosY}`);
          path.setAttribute('data-start', 'right');
          path.setAttribute('data-end-pos', `${secPosX}${secPosY}`);
          path.setAttribute('data-end', 'left');

          path.id = `${firstPosX}${firstPosY}${secPosX}${secPosY}`;

          this.roads.push(path);
          console.log('Roads:', this.roads);

          this.svgElement.nativeElement.appendChild(path);
        }


        ctx.strokeStyle = '#2dc115';
        ctx.lineWidth = 1 + 'px';
        ctx.stroke();
      }
      this.firstNode.style.backgroundColor = '#817e7e';
      this.firstNode.style.opacity = '0.0';
      this.firstNode = null;
      this.secondNode.style.opacity = '0.0';
      this.secondNode = null;
      this.secondNodeLine = null;
      node.style.backgroundColor = '#817e7e';
      node.style.opacity = '0.0';
      return
    }
  }

  // drawCurvedRoad(ctx: CanvasRenderingContext2D,firstPosX: number, firstPosY:number, secPosX:number, secPosY:number) : CanvasRenderingContext2D{
  //   let r = secPosX - 45 - firstPosX;
  //   ctx.moveTo(firstPosX, firstPosY + 45);
  //   ctx.arcTo(secPosX - 45, firstPosY + 45, secPosX - 45, secPosY, r);
  //   return ctx;
  // }
  findEndOfRoad(roadStart: string) {
    const road = this.roads.find(road => road.dataset?.['startPos'] === roadStart || road.dataset?.['endPos'] === roadStart);

    if (road) {
      if (road.dataset?.['startPos'] === roadStart) {
        this.currentRoadDirection = road.dataset?.['start'] ?? null;
        return;
      } else if (road.dataset?.['endPos'] === roadStart) {
        this.currentRoadDirection = road.dataset?.['end'] ?? null;
        return;
      }
    }
    this.currentRoadDirection = null;
  }

  getPositionLine(node: HTMLElement) {
    if (this.firstNode == null) {
      return;
    }
    this.secondNodeLine = node;
    const firstPos = this.firstNode.getBoundingClientRect();
    const firstPosX = firstPos.left + 45;
    const firstPosY = firstPos.top + 45;
    const secPos = this.secondNodeLine.getBoundingClientRect();
    const secPosX = secPos.left + 45;
    const secPosY = secPos.top + 45;
    this.findEndOfRoad(`${firstPosX}${firstPosY}`);
    if (firstPosX != null && firstPosY != null && secPosX != null && secPosY) {
      console.log('Position2X - Position1:', `${secPosX - firstPosX}`);
      console.log('Position1Y - Position2Y:', `${secPosY - firstPosY}`);
      const canvas = this.canvasElementLine.nativeElement;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      console.log('Position1:', `X: ${firstPosX}, Y: ${firstPosY}`);
      console.log('Position2:', `X: ${secPosX}, Y: ${secPosY}`);
      console.log('Canvas width:', canvas.width, 'Canvas height:', canvas.height);

      // Curved road up right
      if (secPosX > firstPosX && secPosY < firstPosY) {
        if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
          if (this.currentRoadDirection == 'right' || this.currentRoadDirection == 'downright' || this.currentRoadDirection == 'upright') {
            // From left
            let r = secPosX - 45 - firstPosX;
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX - 45, firstPosY - 45, secPosX - 45, secPosY, r);
            ctx.lineTo(secPosX + 45, secPosY);
            r = secPosX - firstPosX + 45;
            ctx.arcTo(secPosX + 45, firstPosY + 45, secPosX, firstPosY + 45, r);
          }
          if (this.currentRoadDirection == 'up' || this.currentRoadDirection == 'rightup' || this.currentRoadDirection == 'leftup') {
            //From down
            let r = firstPosY - (secPosY - 45);
            ctx.moveTo(firstPosX - 45, firstPosY);
            ctx.arcTo(firstPosX - 45, secPosY - 45, secPosX, secPosY - 45, r);
            ctx.lineTo(secPosX, secPosY + 45);
            r = secPosX - (firstPosX + 45);
            ctx.arcTo(firstPosX + 45, secPosY + 45, firstPosX + 45, firstPosY, r);
          }
        }
      }
      // Curved road down right
      if (secPosX > firstPosX && secPosY > firstPosY) {
        if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
          if (this.currentRoadDirection == 'right' || this.currentRoadDirection == 'downright' || this.currentRoadDirection == 'upright') {
            // From left
            let r = secPosY - (firstPosY - 45);
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX + 45, firstPosY - 45, secPosX + 45, secPosY, r);
            ctx.lineTo(secPosX - 45, secPosY);
            r = (secPosX - 45) - firstPosX;
            ctx.arcTo(secPosX - 45, firstPosY + 45, firstPosX, firstPosY + 45, r);

          }
          if (this.currentRoadDirection == 'down' || this.currentRoadDirection == 'rightdown' || this.currentRoadDirection == 'leftdown') {
            //From up
            let r = secPosY + 45 - firstPosY;
            ctx.moveTo(firstPosX - 45, firstPosY);
            ctx.arcTo(firstPosX - 45, secPosY + 45, secPosX, secPosY + 45, r);
            ctx.lineTo(secPosX, secPosY - 45);
            r = secPosX - (firstPosX + 45);
            ctx.arcTo(firstPosX + 45, secPosY - 45, firstPosX + 45, firstPosY, r);
          }
        }
      }
      // Curved road up left
      if (firstPosX > secPosX && firstPosY > secPosY) {
        if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
          if (this.currentRoadDirection == 'left' || this.currentRoadDirection == 'downleft' || this.currentRoadDirection == 'upleft') {
            // From right
            let r = firstPosX - secPosX - 45;
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX + 45, firstPosY - 45, secPosX + 45, secPosY, r);
            r = firstPosX - (secPosX - 45);
            ctx.lineTo(secPosX - 45, secPosY);
            ctx.arcTo(secPosX - 45, firstPosY + 45, firstPosX, firstPosY + 45, r);
          }
          if (this.currentRoadDirection == 'up' || this.currentRoadDirection == 'rightup' || this.currentRoadDirection == 'leftup') {
            //From down
            let r = (firstPosX + 45) - secPosX;
            ctx.moveTo(firstPosX + 45, firstPosY);
            ctx.arcTo(firstPosX + 45, secPosY - 45, secPosX, secPosY - 45, r);
            r = (firstPosX - 45) - secPosX;
            ctx.lineTo(secPosX, secPosY + 45);
            ctx.arcTo(firstPosX - 45, secPosY + 45, firstPosX - 45, firstPosY, r);
          }
        }
      }
      // Curved road down left
      if (firstPosX > secPosX && firstPosY < secPosY) {
        if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
          if (this.currentRoadDirection == 'left' || this.currentRoadDirection == 'downleft' || this.currentRoadDirection == 'upleft') {
            // From right
            let r = firstPosX - (secPosX - 45);
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX - 45, firstPosY - 45, secPosX - 45, secPosY, r);
            ctx.lineTo(secPosX + 45, secPosY);
            r = firstPosX - (secPosX + 45);
            ctx.arcTo(secPosX + 45, firstPosY + 45, firstPosX, firstPosY + 45, r);
          }
          if (this.currentRoadDirection == 'down' || this.currentRoadDirection == 'rightdown' || this.currentRoadDirection == 'leftdown') {
            //From up
            let r = (firstPosX - 45) - secPosX;
            ctx.moveTo(firstPosX - 45, firstPosY);
            ctx.arcTo(firstPosX - 45, secPosY - 45, secPosX, secPosY - 45, r);
            ctx.lineTo(secPosX, secPosY + 45);
            r = (firstPosX + 45) - secPosX;
            ctx.arcTo(firstPosX + 45, secPosY + 45, firstPosX + 45, firstPosY, r);
          }
        }
      }
      //up
      if (firstPosX == secPosX && firstPosY > secPosY) {
        ctx.moveTo(firstPosX - 45, firstPosY);
        ctx.lineTo(secPosX - 45, secPosY);
        ctx.lineTo(secPosX + 45, secPosY);
        ctx.lineTo(firstPosX + 45, firstPosY);
      }
      //Down
      if (firstPosX == secPosX && firstPosY < secPosY) {
        ctx.moveTo(firstPosX - 45, firstPosY);
        ctx.lineTo(secPosX - 45, secPosY);
        ctx.lineTo(secPosX + 45, secPosY);
        ctx.lineTo(firstPosX + 45, firstPosY);
      }
      //Right
      if (firstPosY == secPosY && firstPosX < secPosX) {
        ctx.moveTo(firstPosX, firstPosY - 45);
        ctx.lineTo(secPosX, secPosY - 45);
        ctx.lineTo(secPosX, secPosY + 45);
        ctx.lineTo(firstPosX, firstPosY + 45);
      }
      //Left
      if (firstPosY == secPosY && firstPosX > secPosX) {
        ctx.moveTo(firstPosX, firstPosY - 45);
        ctx.lineTo(secPosX, secPosY - 45);
        ctx.lineTo(secPosX, secPosY + 45);
        ctx.lineTo(firstPosX, firstPosY + 45);
      }


      ctx.strokeStyle = '#2dc115';
      ctx.lineWidth = 30 + 'px';
      ctx.stroke();
    }
    // this.firstNode.style.backgroundColor = '#817e7e';
    // this.firstNode.style.opacity = '0.0';
    // this.firstNode = null;
    // this.secondNode = null;
    // node.style.backgroundColor = '#817e7e';
    // node.style.opacity = '0.5';
    return
  }
}
