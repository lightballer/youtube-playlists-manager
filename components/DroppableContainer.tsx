import { EditorContainer } from "@/types/editor";
import { useDroppable } from "@dnd-kit/core";

type DroppableContainerProps = {
  id: EditorContainer;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function DroppableContainer({
  id,
  title,
  children,
  className = "",
}: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 backdrop-blur-md bg-white/5 rounded-2xl min-h-125 h-max w-full border-2 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${className}`}
    >
      <h3 className="mb-4 font-bold text-lg text-text-primary">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
