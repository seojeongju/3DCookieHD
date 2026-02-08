import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    brace_stack = [] # (line, col)
    paren_stack = [] # (line, col)
    
    line = 1
    col = 1
    
    for i, c in enumerate(content):
        if c == '\n':
            line += 1
            col = 1
            continue
        
        if c == '{':
            brace_stack.append((line, col))
        elif c == '}':
            if not brace_stack:
                print(f"Extra '}}' at line {line}, col {col}")
            else:
                brace_stack.pop()
        elif c == '(':
            paren_stack.append((line, col))
        elif c == ')':
            if not paren_stack:
                print(f"Extra ')' at line {line}, col {col}")
            else:
                paren_stack.pop()
        
        col += 1
    
    while brace_stack:
        l, c = brace_stack.pop()
        print(f"Unclosed '{{' from line {l}, col {c}")
    while paren_stack:
        l, c = paren_stack.pop()
        print(f"Unclosed '(' from line {l}, col {c}")

if __name__ == "__main__":
    check_balance(sys.argv[1])
