const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// 1. Add state
const stateInsertPoint = "const [interests, setInterests] = useState<string[]>(() => {";
const todoStateCode = `  const [todos, setTodos] = useState<{id: number, text: string, completed: boolean}[]>([
    { id: 1, text: 'تسليم استمارة التكافل الاجتماعي', completed: false },
    { id: 2, text: 'دفع رسوم رحلة الأقصر', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), text: newTodo.trim(), completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  `;

if (code.includes(stateInsertPoint) && !code.includes('const [todos, setTodos]')) {
    code = code.replace(stateInsertPoint, todoStateCode + stateInsertPoint);
}

// 2. Need icons like Trash2, ListTodo, Plus
if (!code.includes('ListTodo')) {
    code = code.replace(
        "import { User, Book, MapPin, Hash, CheckCircle, Clock, Calendar, Award, Star, FileText, MessageSquare, Printer, Download, ArrowRight, Wallet, Check } from 'lucide-react';",
        "import { User, Book, MapPin, Hash, CheckCircle, Clock, Calendar, Award, Star, FileText, MessageSquare, Printer, Download, ArrowRight, Wallet, Check, ListTodo, Plus, Trash2 } from 'lucide-react';"
    );
}

// 3. Add UI in sidebar
const oldInterestsSectionEnd = `                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>`;

const newTodosUI = `                  </button>
                ))}
              </div>
            </div>

            {/* To-Do List Section */}
            <div className="px-6 pb-6 border-t border-slate-100 pt-6 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                قائمة المهام
              </h3>
              
              <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="أضف مهمة جديدة..."
                  className="flex-grow px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button 
                  type="submit"
                  disabled={!newTodo.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {todos.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">لا توجد مهام حالياً</p>
                ) : (
                  todos.map(todo => (
                    <div 
                      key={todo.id} 
                      className={\`flex items-start justify-between gap-2 p-2.5 rounded-lg border \${todo.completed ? 'bg-slate-100 border-slate-100' : 'bg-white border-slate-200 shadow-sm'} transition-colors\`}
                    >
                      <div className="flex items-start gap-2 overflow-hidden">
                        <button 
                          onClick={() => toggleTodo(todo.id)}
                          className={\`shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded border transition-colors \${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-blue-400'}\`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <span className={\`text-sm \${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}\`}>
                          {todo.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </div>`;

if (code.includes(oldInterestsSectionEnd)) {
    code = code.replace(oldInterestsSectionEnd, newTodosUI);
} else {
    console.error("Could not find interests section end!");
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
