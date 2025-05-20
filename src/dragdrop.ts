interface Shape {
    id: number;
    type: 'rectangle' | 'circle' | 'triangle';
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    isDragging: boolean;
    dragOffsetX: number;
    dragOffsetY: number;
}

class ShapeCanvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private shapes: Shape[] = [];
    private nextId = 1;
    private activeShape: Shape | null = null;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        
        this.initCanvas();
        this.initToolbox();
        this.initEventListeners();
        this.draw();
    }

    private initCanvas(): void {
        this.canvas.width = window.innerWidth - 200;
        this.canvas.height = window.innerHeight;
        this.canvas.style.borderLeft = '1px solid #ccc';
    }

    private initToolbox(): void {
        // Toolbox shapes are now defined in HTML
    }

    private initEventListeners(): void {
        // Toolbox drag start
        document.querySelectorAll('.toolbox-shape').forEach((el, index) => {
            el.addEventListener('mousedown', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                const colors = ['#ff5252', '#4caf50', '#2196f3'];
                const types = ['rectangle', 'circle', 'triangle'] as const;
                
                const newShape: Shape = {
                    id: this.nextId++,
                    type: types[index],
                    x: mouseEvent.clientX - 50,
                    y: mouseEvent.clientY - 50,
                    width: 100,
                    height: 100,
                    color: colors[index],
                    isDragging: true,
                    dragOffsetX: 50,
                    dragOffsetY: 50
                };
                
                this.shapes.push(newShape);
                this.activeShape = newShape;
            });
        });

        // Canvas interactions
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        window.addEventListener('resize', () => this.handleResize());
    }

    private handleCanvasMouseDown(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Find clicked shape (reverse iteration to select top-most shape)
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            const shape = this.shapes[i];
            if (this.isPointInShape(mouseX, mouseY, shape)) {
                this.activeShape = shape;
                shape.isDragging = true;
                shape.dragOffsetX = mouseX - shape.x;
                shape.dragOffsetY = mouseY - shape.y;
                break;
            }
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.activeShape || !this.activeShape.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        this.activeShape.x = e.clientX - rect.left - this.activeShape.dragOffsetX;
        this.activeShape.y = e.clientY - rect.top - this.activeShape.dragOffsetY;
        
        // Boundary checks (no deletion, just constrain to canvas)
        this.activeShape.x = Math.max(0, Math.min(this.activeShape.x, this.canvas.width - this.activeShape.width));
        this.activeShape.y = Math.max(0, Math.min(this.activeShape.y, this.canvas.height - this.activeShape.height));
        
        this.draw();
    }

    private handleMouseUp(): void {
        if (this.activeShape) {
            this.activeShape.isDragging = false;
            this.activeShape = null;
        }
    }

    private handleResize(): void {
        this.canvas.width = window.innerWidth - 200;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    private isPointInShape(x: number, y: number, shape: Shape): boolean {
        switch(shape.type) {
            case 'rectangle':
                return x >= shape.x && x <= shape.x + shape.width && 
                       y >= shape.y && y <= shape.y + shape.height;
            case 'circle':
                const centerX = shape.x + shape.width/2;
                const centerY = shape.y + shape.height/2;
                const radius = shape.width/2;
                return Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) <= radius;
            case 'triangle':
                return y >= shape.y && 
                       y <= shape.y + shape.height && 
                       x >= shape.x + (y - shape.y) * (shape.width/2) / shape.height && 
                       x <= shape.x + shape.width - (y - shape.y) * (shape.width/2) / shape.height;
        }
    }

    private draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.shapes.forEach(shape => {
            this.context.fillStyle = shape.color;
            
            switch(shape.type) {
                case 'rectangle':
                    this.context.fillRect(shape.x, shape.y, shape.width, shape.height);
                    break;
                case 'circle':
                    this.context.beginPath();
                    this.context.arc(shape.x + shape.width/2, shape.y + shape.height/2, shape.width/2, 0, Math.PI * 2);
                    this.context.fill();
                    break;
                case 'triangle':
                    this.context.beginPath();
                    this.context.moveTo(shape.x + shape.width/2, shape.y);
                    this.context.lineTo(shape.x, shape.y + shape.height);
                    this.context.lineTo(shape.x + shape.width, shape.y + shape.height);
                    this.context.closePath();
                    this.context.fill();
                    break;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShapeCanvas();
});