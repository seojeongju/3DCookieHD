import re

with open('src/views/admin_hrd_items.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove TypeScript assertions "as HTMLInputElement" and "as HTMLSelectElement"
# Regex to match patterns like "(variable as Type)" or "variable as Type"
# Be careful not to break valid TS code outside the template literal, but it seems all this code is inside the template literal script block.

# Pattern 1: (customInput as HTMLInputElement).focus() -> customInput.focus()
content = content.replace('(customInput as HTMLInputElement).focus()', 'customInput.focus()')

# Pattern 2: (customInput as HTMLInputElement).value -> customInput.value
content = content.replace('(customInput as HTMLInputElement).value', 'customInput.value')

# Pattern 3: const locationSelect = ... as HTMLSelectElement;
content = re.sub(r'const locationSelect = document\.getElementById\(\'itemLocation\'\) as HTMLSelectElement;', "const locationSelect = document.getElementById('itemLocation');", content)

# Pattern 4: const customLocationInput = ... as HTMLInputElement;
content = re.sub(r'const customLocationInput = document\.getElementById\(\'itemLocationCustom\'\) as HTMLInputElement;', "const customLocationInput = document.getElementById('itemLocationCustom');", content)

with open('src/views/admin_hrd_items.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed TS assertions from JS block!")
