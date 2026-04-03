import { Textarea } from "./textarea";
import { iQuestionEvaluation } from "@/types/evaluation";

interface QuestionProps {
    question: iQuestionEvaluation;
    value?: string;
    error?: string;
    onChange: (key: string, value: string) => void;
}

export function Question({ 
    question, 
    value = "",
    error,
    onChange, 
}: QuestionProps) {

    const options = [
        { value: "a", label: "Sim" },
        { value: "b", label: "Não" },
        { value: "c", label: "Maioria das vezes" },
        { value: "d", label: "Raras vezes" },
    ];

    // Renderiza o conteúdo baseado no type da questão
    const renderContent = () => (
        
        <div>
            <label className="font-bold block mb-5">
                {question.key.replace('q','')}. {question.title}
            </label>
            {question.type === "alternative" && (
                <div className={`flex items-center justify-between gap-4 w-full p-1 box-border rounded`}>
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                            <input
                                id={`${question.key}-${option.value}`}
                                name={question.key}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => onChange(question.key, option.value)}
                                type="radio"
                            />
                            <span className="">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.type === "discursive" && (
                <div className="flex items-center gap-4">
                    <div className="flex-auto">
                        <Textarea
                            name={question.key}
                            value={value || question.value || ""}
                            onChange={(e) => onChange(question.key, e.target.value)}
                            placeholder="Digite sua resposta aqui..."
                            rows={3}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={`bg-white border rounded-lg p-4 mb-3 shadow-sm transition-all ${error ? 'border-red-500' : ''}`}>
            <div className="flex gap-3 items-start mb-5">
                <div className="flex-1 space-y-2">
                    {renderContent()}
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}