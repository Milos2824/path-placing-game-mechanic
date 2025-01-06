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

  // firstNodePosX: null | number = null;
  // firstNodePosY: null | number = null;

  // secondNodePosX: null | number = null;
  // secondNodePosY: null | number = null;
  title = 'path-placing-game-mechanic';
  @ViewChild('grid') gridArea!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

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
            this.getFirstPosition(target);
          }
        };
        // nodes.push({ x, y });
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

  getFirstPosition(node: HTMLElement) {
    const nodeId = node.id;
    if (this.firstNode == null) {
      this.firstNode = node;
      node.style.backgroundColor = '#2dc115';
      node.style.opacity = '0.8';
      return
    }
    if (this.firstNode == node) {
      this.firstNode = null;
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
      if (firstPosX != null && firstPosY != null && secPosX != null && secPosY) {
        console.log('Position2X - Position1:', `${secPosX - firstPosX}`);
        console.log('Position1Y - Position2Y:', `${secPosY - firstPosY}`);
        const canvas = this.canvasElement.nativeElement;
        const ctx = canvas.getContext('2d');
        ctx.beginPath()
        console.log('Position1:', `X: ${firstPosX}, Y: ${firstPosY}`);
        console.log('Position2:', `X: ${secPosX}, Y: ${secPosY}`);

        if (secPosX > firstPosX && secPosY < firstPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            // ctx = this.drawCurvedRoad(ctx,firstPosX, firstPosY - 45, secPosX - 45, secPosY);
            // ctx = this.drawCurvedRoad(ctx,firstPosX, firstPosY, secPosX, secPosY);
            // ctx = this.drawCurvedRoad(ctx,firstPosX, firstPosY + 45, secPosX + 45, secPosY);
            let r = secPosX - 45 - firstPosX;
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX - 45, firstPosY - 45, secPosX - 45, secPosY, r);
            ctx.lineTo(secPosX+45,secPosY);
            r = secPosX - firstPosX+45;
            ctx.arcTo(secPosX+45, firstPosY+45, secPosX, firstPosY+45, r);
            ctx.lineTo(firstPosX,firstPosY - 45);
            ctx.fillStyle = '#2dc115';
            ctx.fill();

            // r = secPosX - firstPosX;
            // ctx.moveTo(firstPosX, firstPosY);
            // ctx.arcTo(secPosX, firstPosY, secPosX, secPosY, r);

            // r = secPosX + 45 - firstPosX;
            // ctx.moveTo(firstPosX, firstPosY + 45);
            // ctx.arcTo(secPosX + 45, firstPosY + 45, secPosX + 45, secPosY, r);
          }
        }
        if (secPosX > firstPosX && secPosY > firstPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            let r = secPosX - 45 - firstPosX;
            ctx.moveTo(firstPosX, firstPosY + 45);
            ctx.arcTo(secPosX - 45, firstPosY + 45, secPosX - 45, secPosY, r);

            r = secPosX - firstPosX;
            ctx.moveTo(firstPosX, firstPosY);
            ctx.arcTo(secPosX, firstPosY, secPosX, secPosY, r);

            r = secPosX + 45 - firstPosX;
            ctx.moveTo(firstPosX, firstPosY - 45);
            ctx.arcTo(secPosX + 45, firstPosY - 45, secPosX + 45, secPosY, r);
          }
        }
        if (firstPosX > secPosX && firstPosY>secPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            let r = firstPosX - secPosX - 45;
            ctx.moveTo(firstPosX, firstPosY-45);
            ctx.arcTo(secPosX + 45, firstPosY-45, secPosX + 45, secPosY, r);

            r = firstPosX - secPosX;
            ctx.moveTo(firstPosX, firstPosY);
            ctx.arcTo(secPosX, firstPosY, secPosX, secPosY, r);

            r = firstPosX - secPosX+45;
            ctx.moveTo(firstPosX, firstPosY + 45);
            ctx.arcTo(secPosX-45, firstPosY + 45, secPosX-45, secPosY, r);
          }
        }
        if (firstPosX > secPosX && firstPosY<secPosY) {
          if (secPosX - firstPosX == secPosY - firstPosY || secPosX - firstPosX == (secPosY - firstPosY) * -1) {
            let r = firstPosX - secPosX+45;
            ctx.moveTo(firstPosX, firstPosY-45);
            ctx.arcTo(secPosX-45, firstPosY-45, secPosX-45, secPosY, r);

            r = firstPosX - secPosX;
            ctx.moveTo(firstPosX, firstPosY);
            ctx.arcTo(secPosX, firstPosY, secPosX, secPosY, r);

            r = firstPosX - secPosX-45;
            ctx.moveTo(firstPosX, firstPosY+45);
            ctx.arcTo(secPosX+45, firstPosY+45, secPosX+45, secPosY, r);
          }
        }
        if(firstPosX==secPosX && firstPosY>secPosY){
          ctx.moveTo(firstPosX-45, firstPosY);
          ctx.lineTo(secPosX-45, secPosY);
          ctx.lineTo(secPosX+45, secPosY);
          ctx.lineTo(firstPosX+45, firstPosY);
          ctx.lineTo(firstPosX-45, firstPosY);
          ctx.fillStyle = '#2dc115';
          ctx.fill();
        }
        if(firstPosX==secPosX && firstPosY<secPosY){
          ctx.moveTo(firstPosX-45, firstPosY);
          ctx.lineTo(secPosX-45, secPosY);
          ctx.lineTo(secPosX+45, secPosY);
          ctx.lineTo(firstPosX+45, firstPosY);
          ctx.lineTo(firstPosX-45, firstPosY);
          ctx.fillStyle = '#2dc115';
          ctx.fill();
        }
        if(firstPosY==secPosY && firstPosX<secPosX){
          ctx.moveTo(firstPosX, firstPosY-45);
          ctx.lineTo(secPosX, secPosY-45);
          ctx.lineTo(secPosX, secPosY+45);
          ctx.lineTo(firstPosX, firstPosY+45);
          ctx.lineTo(firstPosX, firstPosY-45);
          ctx.fillStyle = '#2dc115';
          ctx.fill();
        }
        if(firstPosY==secPosY && firstPosX>secPosX){
          ctx.moveTo(firstPosX, firstPosY-45);
          ctx.lineTo(secPosX, secPosY-45);
          ctx.lineTo(secPosX, secPosY+45);
          ctx.lineTo(firstPosX, firstPosY+45);
          ctx.lineTo(firstPosX, firstPosY-45);
          ctx.fillStyle = '#2dc115';
          ctx.fill();
        }
        

        ctx.strokeStyle = '#2dc115';
        ctx.lineWidth = 1 + 'px';
        ctx.stroke();
      }
      this.firstNode.style.backgroundColor = '#817e7e';
      this.firstNode.style.opacity = '0.0';
      this.firstNode = null;
      this.secondNode = null;
      node.style.backgroundColor = '#817e7e';
      node.style.opacity = '0.5';
      return
    }
  }

  // drawCurvedRoad(ctx: CanvasRenderingContext2D,firstPosX: number, firstPosY:number, secPosX:number, secPosY:number) : CanvasRenderingContext2D{
  //   let r = secPosX - 45 - firstPosX;
  //   ctx.moveTo(firstPosX, firstPosY + 45);
  //   ctx.arcTo(secPosX - 45, firstPosY + 45, secPosX - 45, secPosY, r);
  //   return ctx;
  // }
}
