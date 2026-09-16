import sys

def check_brackets(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    stack = []
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '({[':
                stack.append((char, i+1, j+1))
            elif char in ')}]':
                if not stack:
                    print(f"Extra closing {char} at line {i+1}, col {j+1}")
                    return
                top_char, top_line, top_col = stack.pop()
                if (char == ')' and top_char != '(') or \
                   (char == '}' and top_char != '{') or \
                   (char == ']' and top_char != '['):
                    print(f"Mismatch: found {char} at line {i+1}, col {j+1}, but expected closing for {top_char} from line {top_line}, col {top_col}")
                    print(line)
                    return
    
    if stack:
        print("Unclosed brackets:")
        for char, i, j in stack:
            print(f"{char} at line {i}, col {j}")
    else:
        print("All brackets matched!")

check_brackets('src/components/StudentProfile.tsx')
