const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/najer/OneDrive/Desktop/PROYECTOS_FAMILIA/PAGINABRYAN/client/src/pages/admin';

// Definimos el HEX del negro base del dark mode para que Tailwind lo compile 100% seguro sin fallos
const HEX_DARK = '#15171C';
const HEX_CARD = '#1C1C21';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Arreglar clases que fallan en el compilador de Tailwind
    
    // 1. Inputs y Cards blancas que no se hacen oscuras (bg-white dark:bg-carbon -> bg-white dark:bg-[#15171C])
    content = content.replace(/dark:bg-carbon\/\[0\.02\]/g, 'dark:bg-white/[0.02]');
    content = content.replace(/dark:bg-carbon\/90/g, 'dark:bg-[#15171C]/90');
    content = content.replace(/dark:bg-carbon/g, `dark:bg-[${HEX_DARK}]`);
    
    // 2. Corregir cualquier bg-white solitario que debería ser gris claro o fondo de card
    content = content.replace(/bg-white dark:bg-white/g, `bg-white dark:bg-[${HEX_CARD}]`);
    
    // 3. Reemplazar bg-gray-50 en lugares donde no compile el dark
    content = content.replace(/bg-gray-50 dark:bg-\[\#1C1C21\]/g, `bg-gray-50 dark:bg-[${HEX_CARD}]`);
    
    // 4. Asegurar textos de placeholders e inputs
    content = content.replace(/text-tatami-blanco/g, 'text-gray-900 dark:text-white');
    content = content.replace(/text-gray-900 dark:text-gray-900/g, 'text-gray-900');
    content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');

    // 5. Casos de bg-white puros en cards
    content = content.replace(/class="bg-white rounded-2xl/g, 'class="bg-white dark:bg-[#1C1C21] rounded-2xl');
    content = content.replace(/class="bg-white p-6/g, 'class="bg-white dark:bg-[#1C1C21] p-6');
    content = content.replace(/class="bg-white border/g, 'class="bg-white dark:bg-[#1C1C21] border');

    fs.writeFileSync(filePath, content);
  }
});
console.log("Fixes definitivos aplicados a Tailwind.");
