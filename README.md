# Fiadumont — Website Elegante com Esfera Tecnológica 3D

Website corporativo premium com design minimalista e efeitos 3D impressionantes.

## ✨ Características

- **Esfera Tecnológica 3D Azul**: Animação WebGL com partículas, wireframe e anéis de energia
- **Design Elegante**: Paleta azul/roxa, tipografia limpa, espaçamento generoso
- **Logo Visível**: Integração perfeita com fundo transparente
- **Multi-idioma**: Português (PT) e Inglês (EN)
- **Portfolio 3D**: Cada projeto com animação única
- **Responsivo**: Funciona perfeitamente em todos os dispositivos

## 🎨 Paleta de Cores

- Background: Roxo escuro (#0a0520)
- Accent: Azul tecnológico (#4f9cff)
- Text: Branco e cinza azulado
- Efeitos: Glow azul

## 📁 Estrutura

```
index.html            Página principal
privacidade.html      Política de privacidade (PT e EN)
404.html              Página de erro
styles.css            Estilos
src/main.js           Idioma, navegação, scroll suave, transições
src/hero/             Cena 3D do hero (React Three Fiber)
src/portfolio3d.js    Animações 3D dos cartões do portfolio
src/capability.js     Decide entre cena 3D e fundo estático
src/fonts.css         Tipo de letra Inter alojado no site
public/               Ficheiros copiados tal como estão (logo, ícones, og-image, robots, sitemap)
vercel.json           Build e cache no Vercel
```

## Desenvolvimento

Requer Node 20.19 ou superior (ver `.nvmrc`) e npm.

```bash
npm install
npm run dev      # servidor local com Vite
npm run build    # gera a pasta dist/
npm run preview  # serve a pasta dist/
```

Para ver o fallback estático do hero, abre o site com `?static` no URL.

## 🚀 Deploy Rápido

### Windows
```
Duplo clique em: deploy.bat
```

### Mac/Linux
```bash
./deploy.sh
```

### Manual
```bash
git init
git add .
git commit -m "Fiadumont elegant website"
git remote add origin https://github.com/fiadumontt-web/fiadumont.git
git push -u origin main --force
vercel --prod
```

## 🎯 Secções

- **Início**: Hero com esfera 3D
- **Portfolio**: 4 projectos com animações únicas
- **Sobre**: Informação elegante e concisa
- **Contacto**: Email directo

## 🔧 Tecnologias

- HTML5 semântico
- CSS3 moderno (variáveis, grid, flexbox)
- JavaScript ES6+
- Three.js para WebGL
- Design responsivo mobile-first

## 📱 Responsivo

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## ⚡ Performance

- Animações 60 FPS
- Lazy loading de cenas 3D
- Pixel ratio otimizado
- Code splitting

## 🌍 Multi-idioma

Toggle PT/EN no topo direito.
Língua padrão: Português de Portugal.

## 📞 Suporte

Email: contato@fiadumont.com

---

© 2024 Fiadumont. Design elegante, tecnologia avançada.
