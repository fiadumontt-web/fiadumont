# Fiadumont Website

Website corporativo profissional com experiências 3D imersivas.

## 🚀 Características

- **Design 3D Imersivo**: WebGL com Three.js para animações impressionantes
- **Multi-idioma**: Português (Portugal) e Inglês (Americano)
- **Performance Otimizada**: Animações fluidas a 60 FPS
- **Responsivo**: Design adaptável para todos os dispositivos
- **Profissional**: Design de nível empresarial mundial

## 📁 Estrutura do Projeto

```
fiadumont-deploy/
├── index.html          # Página principal
├── styles.css          # Estilos profissionais
├── script.js           # JavaScript e animações 3D
├── vercel.json         # Configuração Vercel
├── package.json        # Metadados do projeto
├── README.md           # Este arquivo
└── public/
    └── assets/
        └── logo.png    # Logo transparente
```

## 🌐 Deploy no Vercel

### Opção 1: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
cd fiadumont-deploy
vercel

# Deploy para produção
vercel --prod
```

### Opção 2: Via GitHub

1. Criar repositório no GitHub
2. Push do código:
```bash
cd fiadumont-deploy
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USERNAME/fiadumont.git
git push -u origin main
```
3. Conectar repositório no Vercel.com
4. Deploy automático!

## 📦 Deploy no GitHub Pages

```bash
cd fiadumont-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USERNAME/fiadumont.git
git push -u origin main

# Ativar GitHub Pages nas configurações do repositório
# Settings > Pages > Source: main branch
```

## 🎨 Personalização

### Cores

Editar variáveis CSS em `styles.css`:

```css
:root {
    --accent: #ff8c42;        /* Cor principal (laranja)  */
    --accent-glow: rgba(255, 140, 66, 0.3);
}
```

### Conteúdo

Editar textos em `index.html`:
- Atributos `data-pt` para português
- Atributos `data-en` para inglês

### Animações 3D

Ajustar parâmetros em `script.js`:
- `particlesCount`: Número de partículas
- Velocidades de rotação
- Cores dos objetos 3D

## 🖼️ Logo

Logo localizado em `public/assets/logo.png`.
Para substituir, manter fundo transparente (PNG).

## 📱 Responsive Breakpoints

- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px
- Small Mobile: < 480px

## ⚡ Performance

- Lazy loading de 3D scenes
- Pixel ratio limitado a 2x
- Animações via requestAnimationFrame
- WebGL com antialiasing otimizado

## 🌍 Idiomas

Troca de idioma via botões PT/EN no topo.
Língua padrão: Português de Portugal.

## 📞 Contactos

- Email: contato@fiadumont.com
- Website: fiadumont.com

## 📄 Licença

© 2024 Fiadumont. Todos os direitos reservados.
