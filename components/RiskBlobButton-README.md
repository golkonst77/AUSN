# Клякса "Риски дробления и самозанятых" - Готовые версии для копирования

## Вариант 1: React/Next.js компонент (с встроенными стилями)

Файл: `RiskBlobButton-standalone.tsx`

**Использование:**
1. Скопируйте файл `RiskBlobButton-standalone.tsx` в ваш проект
2. Импортируйте и используйте:
```tsx
import { RiskBlobButton } from './components/RiskBlobButton-standalone'

export default function Page() {
  return (
    <>
      <RiskBlobButton />
      {/* остальной контент */}
    </>
  )
}
```

**Особенности:**
- Все стили встроены через `style jsx`
- Не требует дополнительных CSS файлов
- Работает в Next.js и React проектах

---

## Вариант 2: Чистый HTML (без фреймворков)

Файл: `RiskBlobButton-simple.html`

**Использование:**
1. Скопируйте содержимое файла `RiskBlobButton-simple.html`
2. Вставьте в ваш HTML файл (в `<head>` для стилей, в `<body>` для кнопки)

**Особенности:**
- Работает в любом HTML проекте
- Не требует JavaScript фреймворков
- Все стили встроены

---

## Вариант 3: Отдельные файлы (CSS + JSX)

Если хотите разделить стили и компонент:

**CSS файл (risk-blob.css):**
```css
.risk-blob {
  border-radius: 60% 40% 65% 35% / 40% 60% 35% 65%;
  position: relative;
}
.risk-blob::before {
  content: "";
  position: absolute;
  inset: 10%;
  border-radius: inherit;
  border: 3px dashed rgba(255, 255, 255, 0.7);
  mix-blend-mode: screen;
}
@keyframes risk-blob-vibrate {
  0%, 100% { transform: rotate(12deg) translate(0, 0); }
  10% { transform: rotate(12deg) translate(-1px, 1px); }
  20% { transform: rotate(12deg) translate(1px, -1px); }
  30% { transform: rotate(12deg) translate(-1px, -1px); }
  40% { transform: rotate(12deg) translate(1px, 1px); }
  50% { transform: rotate(12deg) translate(-1px, 0); }
  60% { transform: rotate(12deg) translate(1px, 0); }
  70% { transform: rotate(12deg) translate(0, 1px); }
  80% { transform: rotate(12deg) translate(0, -1px); }
}
.risk-blob-vibrate {
  animation: risk-blob-vibrate 3.5s infinite;
  will-change: transform;
}
.risk-blob-vibrate:hover {
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .risk-blob-vibrate {
    animation: none;
  }
}
```

**Компонент (RiskBlobButton.tsx):**
```tsx
"use client"

import './risk-blob.css' // или добавьте стили в ваш глобальный CSS

export function RiskBlobButton() {
  return (
    <a
      href="https://prostoburo.com/risk/"
      className="
        fixed z-[60] top-auto bottom-[5vh] right-[2vw] md:bottom-auto md:top-[42vh] md:right-[8vh]
        flex items-center justify-center
        w-12 h-12 md:w-36 md:h-36
        bg-[#FF00A8]
        text-white text-[7px] md:text-sm font-extrabold leading-[1.05] md:leading-tight text-center px-1.5
        shadow-[0_0_28px_rgba(255,0,168,0.55)]
        rotate-[12deg]
        hover:rotate-[18deg]
        hover:scale-110
        transition-transform duration-300 ease-out
        cursor-pointer
        select-none
        risk-blob
        risk-blob-vibrate
      "
    >
      Риски дробления<br />и самозанятых
    </a>
  )
}
```

---

## Настройка

### Изменить позицию:
- Мобильные: `bottom-[5vh] right-[2vw]`
- Десктоп: `md:top-[42vh] md:right-[8vh]`

### Изменить размер:
- Мобильные: `w-12 h-12` (48px)
- Десктоп: `md:w-36 md:h-36` (144px)

### Изменить цвет:
- Фон: `bg-[#FF00A8]` (розовый)
- Тень: `shadow-[0_0_28px_rgba(255,0,168,0.55)]`

### Изменить текст:
Просто замените текст внутри тега `<a>`:
```tsx
Риски дробления<br />и самозанятых
```

### Изменить ссылку:
```tsx
href="https://prostoburo.com/risk/"
```

---

## Требования

- **Tailwind CSS** (для вариантов 1 и 3) - если используете классы Tailwind
- Или замените Tailwind классы на обычный CSS (как в варианте 2)

---

## Примеры использования

### Next.js
```tsx
import { RiskBlobButton } from '@/components/RiskBlobButton-standalone'

export default function HomePage() {
  return (
    <main>
      <RiskBlobButton />
      {/* ваш контент */}
    </main>
  )
}
```

### React
```tsx
import { RiskBlobButton } from './components/RiskBlobButton-standalone'

function App() {
  return (
    <div>
      <RiskBlobButton />
      {/* ваш контент */}
    </div>
  )
}
```

### Vanilla HTML
Просто скопируйте код из `RiskBlobButton-simple.html` в ваш HTML файл.
