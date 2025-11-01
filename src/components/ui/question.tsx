import { iQuestionForm } from "@/types/question";
import { Combobox } from "./combo-box";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { X, GripVertical } from "lucide-react";
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface QuestionProps {
    question: iQuestionForm;
    setValueQuestion: (value: string) => void;
    removeQuestion: () => void;
}

export function Question({ 
    question, 
    setValueQuestion, 
    removeQuestion 
}: QuestionProps) {
    // Hook de drag-and-drop
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: question.order ? question.order : 0  // Usa order como ID único para o drag
    });

    // Estilo para movimento suave durante o drag
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Opções para frequency
    const options_frequency = [
        { value: "1", label: "Sim" },
        { value: "2", label: "Não" },
        { value: "3", label: "Maioria das vezes" },
        { value: "4", label: "Raras vezes" },
    ];

    // Opções para quality
    const options_quality = [
        { value: "1", label: "Muito satisfeito" },
        { value: "2", label: "Satisfeito" },
        { value: "3", label: "Neutro" },
        { value: "4", label: "Insatisfeito" },
    ];

    // Renderiza o conteúdo baseado no type da questão
    const renderContent = () => (
        <div>
            <label className="font-bold block mb-2">
                {question.order}. {question.title}
            </label>

            {question.type === "frequency" && (
                <div className="flex items-center gap-4">
                    <Combobox
                        items={options_frequency}
                        value={question.value || ""}
                        setValue={setValueQuestion}
                        placeholder="Selecione a alternativa"
                        searchPlaceholder="Buscar alternativa..."
                        notFoundMessage="Nenhuma alternativa encontrada"
                    />
                </div>
            )}

            {question.type === "quality" && (
                <div className="flex items-center gap-4">
                    <Combobox
                        items={options_quality}
                        value={question.value || ""}
                        setValue={setValueQuestion}
                        placeholder="Selecione a alternativa"
                        searchPlaceholder="Buscar alternativa..."
                        notFoundMessage="Nenhuma alternativa encontrada"
                    />
                </div>
            )}

            {question.type === "textarea" && (
                <div className="flex items-center gap-4">
                    <div className="flex-auto">
                        <Textarea
                            value={question.value || ""}
                            onChange={(e) => setValueQuestion(e.target.value)}
                            placeholder="Digite sua resposta aqui..."
                            rows={3}
                        />
                    </div>
                </div>
            )}

            {question.type === "text" && (
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        value={question.value || ""}
                        onChange={(e) => setValueQuestion(e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                    />
                </div>
            )}

            {question.type === "date" && (
                <div className="flex items-center gap-4 w-fit">
                    <Input
                        type="date"
                        value={question.value || ""}
                        onChange={(e) => setValueQuestion(e.target.value)}
                        className="w-[200px]"
                    />
                </div>
            )}
        </div>
    );

    return (
        // Container arrastável
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border rounded-lg p-4 mb-3 shadow-sm transition-all ${
                isDragging ? 'opacity-50 ring-2 ring-blue-500 z-10' : ''
            }`}
        >
            <div className="flex gap-3 items-start">
                {/* ÍCONE DE ARRASTAR */}
                <div
                    {...attributes}
                    {...listeners}
                    className="mt-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* CONTEÚDO DA QUESTÃO */}
                <div className="flex-1 space-y-2">
                    {renderContent()}
                </div>

                <div 
                    className="rounded-full p-1 bg-red-500 hover:bg-red-400 text-white flex-shrink-0 mt-1.5"
                    title="Remover Questão"
                    onClick={removeQuestion}
                >
                    <X size={14} />
                </div>
            </div>
        </div>
    );
}