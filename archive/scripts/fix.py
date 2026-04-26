import re

with open('src/views/admin_hrd_items.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 282 (index 281)
if len(lines) > 281:
    old = lines[281]
    # Replace template literal with concatenation
    new = "                options += '<option value=\"' + facility.name + '\">' + facility.name + '</option>';\r\n"
    lines[281] = new
    print(f"Old: {old.strip()}")
    print(f"New: {new.strip()}")

with open('src/views/admin_hrd_items.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Done!")
