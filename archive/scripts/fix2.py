import re

with open('src/views/admin_hrd_items.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double carriage return on line 282
content = content.replace(
    "options += '<option value=\"' + facility.name + '\">'' + facility.name + '</option>';\r\r",
    "options += '<option value=\"' + facility.name + '\">' + facility.name + '</option>';\r"
)

# Fix indentation on lines 285-300
old_block = """// 직접 입력 옵션
options += '<option value="__custom__">🖊️ 직접 입력</option>';

select.innerHTML = options;

// 선택 변경 이벤트
select.onchange = function () {
    const customInput = document.getElementById('itemLocationCustom');
    if (this.value === '__custom__') {
        customInput.classList.remove('hidden');
        customInput.focus();
    } else {
        customInput.classList.add('hidden');
        customInput.value = '';
    }
};"""

new_block = """            // 직접 입력 옵션
            options += '<option value="__custom__">🖊️ 직접 입력</option>';

            select.innerHTML = options;

            // 선택 변경 이벤트
            select.onchange = function () {
                const customInput = document.getElementById('itemLocationCustom');
                if (customInput) {
                    if (this.value === '__custom__') {
                        customInput.classList.remove('hidden');
                        (customInput as HTMLInputElement).focus();
                    } else {
                        customInput.classList.add('hidden');
                        (customInput as HTMLInputElement).value = '';
                    }
                }
            };"""

content = content.replace(old_block, new_block)

with open('src/views/admin_hrd_items.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
