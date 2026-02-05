import { useRef } from 'react';
import Draggable from 'react-draggable';
import { Trash2 } from 'lucide-react';

export default function DraggableSignature({ sig, updatePosition, removeSignature, containerWidth }) {
    const nodeRef = useRef(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            defaultPosition={{ x: sig.x, y: sig.y }}
            onStop={(e, data) => updatePosition(sig.id, data)}
        >
            <div
                ref={nodeRef}
                className="absolute cursor-move group"
                style={{ width: '200px', zIndex: 50 }}
            >
                <div className="relative border-2 border-transparent hover:border-primary border-dashed p-1">
                    <img
                        src={sig.image}
                        className="w-full pointer-events-none select-none"
                        alt="signature"
                        draggable={false}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeSignature(sig.id);
                        }}
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 hover:scale-110 cursor-pointer"
                        onTouchEnd={(e) => {
                            // Ensure touch devices can delete
                            e.stopPropagation();
                            removeSignature(sig.id);
                        }}
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </Draggable>
    );
}
