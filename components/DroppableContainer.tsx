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
      className={`flex-1 p-4 bg-black rounded-xl min-h-125 h-max w-full border border-amber-50 ${className}`}
    >
      <h3 className="mb-4 font-bold text-lg">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
