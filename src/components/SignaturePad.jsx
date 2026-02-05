import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const SignaturePad = forwardRef(({
    onEnd = () => { },
    className = ''
}, ref) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const ctx = useRef(null);

    useImperativeHandle(ref, () => ({
        getTrimmedCanvas: () => {
            // Instead of relying on a library trim, we just return the raw canvas.
            // If true trimming is needed, we would need to implement pixel scanning.
            // For now, returning the raw canvas is sufficient as it is transparent.
            return canvasRef.current;
        },
        clear: () => {
            const canvas = canvasRef.current;
            if (canvas && ctx.current) {
                ctx.current.clearRect(0, 0, canvas.width, canvas.height);
            }
        },
        isEmpty: () => {
            const canvas = canvasRef.current;
            if (!canvas) return true;
            const blank = document.createElement('canvas');
            blank.width = canvas.width;
            blank.height = canvas.height;
            return canvas.toDataURL() === blank.toDataURL();
        }
    }));

    const draw = (e) => {
        if (!isDrawing.current || !ctx.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;

        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.current.lineTo(x, y);
        ctx.current.stroke();
        ctx.current.beginPath();
        ctx.current.moveTo(x, y);
    };

    const startDrawing = (e) => {
        isDrawing.current = true;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (ctx.current) {
            ctx.current.beginPath();
            ctx.current.moveTo(x, y);
        }
        draw(e);
    };

    const endDrawing = () => {
        if (isDrawing.current) {
            isDrawing.current = false;
            if (ctx.current) ctx.current.beginPath();
            onEnd();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas resolution to match display size for sharpness
        const setSize = () => {
            const rect = canvas.getBoundingClientRect();
            // Set actual canvas size (resolution)
            canvas.width = rect.width;
            canvas.height = rect.height;

            // Context needs reset after resize
            const context = canvas.getContext('2d');
            context.lineWidth = 2;
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            ctx.current = context;
        };

        setSize();

        // We intentionally don't add a resize listener here to avoid clearing 
        // the signature on window resize. The parent container controls size.
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onMouseLeave={endDrawing}
            onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
            onTouchEnd={(e) => { e.preventDefault(); endDrawing(); }}
            onTouchMove={(e) => { e.preventDefault(); draw(e); }}
        />
    );
});

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;
