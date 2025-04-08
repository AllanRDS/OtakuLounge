# 🌟 Otaku Lounge

## 📝 Descrição do Projeto
**Otaku Lounge** é um projeto que utiliza a API da Jikan para mostrar animes mais famosos, mais curtidos, personagens favoritos, e permite a pesquisa de animes e filmes. Ele exibe detalhes completos sobre os animes, oferecendo uma interface interativa e moderna para os usuários. 

## 🚀 Tecnologias Utilizadas

- **Frontend Framework:** 🅰️ Angular
- **Design Framework:** 🌬️ Tailwind CSS
- **API:** 🤖 Jikan (API não oficial do MyAnimeList)
- **Biblioteca UI:** 🎨 Flowbite
- **Ícones:** 🎭 Ionicons
- **Hospedagem:** ☁️ Vercel

## 📂 Estrutura do Projeto

```
projeto-OtakuLounge/
│
├── 📂 src/
│   ├── 📁 app/
│   │   ├── 📂 componentes/
│   │   │   ├── 📦 card-list-selector/
│   │   │   ├── 🎠 carrosel/
│   │   │   ├── 🎴 carrosel-cards/
│   │   │   ├── 🎴 carrosel-cards-p/
│   │   │   ├── 📉 footer/
│   │   │   ├── 🧭 navbar/
│   │   │   └── 🎭 transicao/
│   │   │
│   │   ├── 📂 diretivas/
│   │   │   ├── 🎯 hover-zoom.directive.ts
│   │   │   └── 🎯 hover-zoom-list.directive.ts
│   │   │
│   │   ├── 📂 paginas/
│   │   │   ├── 🏠 home/
│   │   │   ├── 🎬 anime/
│   │   │   └── 🍿 filme/
│   │   │
│   │   ├── 📂 pipes/
│   │   │   └── ✂️ truncate.pipe.ts
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── 🤖 anime.service.ts
│   │   │   ├── 🔍 animefilter.service.ts
│   │   │   └── 🎥 moviefilter.service.ts
│   │   │
│   │   ├── 📂 core/
│   │   │   ├── 🔒 interceptors/
│   │   │   │   └── 🚦 robust-http.interceptor.ts
│   │   │   └── 📡 core.module.ts
│   │   │
│   │   ├── 📄 app.component.ts          
│   │   ├── 🎨 app.component.css        
│   │   ├── 📄 app.component.html        
│   │   ├── 📄 app.component.spec.ts     
│   │   ├── 📄 app-routing.module.ts     
│   │   ├── 📄 app.module.ts            
│   │   └── 📄 app.module.server.ts     
│   │
│   ├── 🖼️ assets/
│   │   ├── ✏️ fonts/
│   │   │   ├── 🅰 Arcade_I.ttf
│   │   │   ├── 🅰 Arcade_N.ttf
│   │   │   └── 🅰 Arcade_R.ttf
│   │   │
│   │   ├── 🖍️ icons/
│   │   │   └── 🔆 Logo-TemaClaro.svg
│   │   │
│   │   ├── 🖼️ img/
│   │   │   ├── 🖼️ Anime-CasaFundo.png
│   │   │   ├── 🖼️ Filme-SliceFundo.jpg
│   │   │   └── 🖼️ Transição-FrierenFundo.jpeg
│   │
│   ├── 📜 index.html
│   ├── 🚀 main.ts
│   └── 🎨 styles.css
│
├── 📦 node_modules/
├── ⚙️ angular.json
├── 📦 package.json
├── 🎨 tailwind.config.js
└── ⚙️ tsconfig.json

```

## ✨ Funcionalidades
- **🎠 Carrosel com Animes da Temporada:** Exibição dos Animes da temporada.
- **🏆 Animes Famosos:** Exibição de uma lista com os animes mais populares.
- **👍 Animes Mais Curtidos:** Exibição de animes com mais votos ou curtidas.
- **⭐ Personagens Favoritos:** Exibição dos personagens favoritos de uma série de anime.
- **🔍 Pesquisa de Animes e Filmes:** Permite ao usuário pesquisar animes ou filmes pela API da Jikan.

## 🚀 Como Rodar o Projeto

1. 📦 Clone o repositório:
    ```bash
    git clone <url-do-repositório>
    ```

2. 📂 Navegue até a pasta do projeto:
    ```bash
    cd otaku-lounge
    ```

3. 🔧 Instale as dependências:
    ```bash
    npm install
    ```

4. 🌐 Execute o servidor de desenvolvimento:
    ```bash
    ng serve
    ```

5. 🖥️ Acesse o projeto no navegador:
    ```bash
    http://localhost:4200
    ```

## 🤝 Como Contribuir
- Faça um fork do projeto
- Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
- Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
- Push para a branch (`git push origin feature/AmazingFeature`)
- Abra um Pull Request

## 🌐 Hospedagem

O projeto está hospedado no Vercel. Você pode acessá-lo através do seguinte link:

🔗 [Projeto Otaku Lounge no Vercel](otaku-lounge.vercel.app)

## 📄 Licença
Este projeto está licenciado sob a [MIT License](LICENSE). 📋
