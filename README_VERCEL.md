# Como subir para o Vercel

Este projeto está pronto para ser publicado no Vercel. Siga estes passos:

1.  **Crie uma conta no Vercel** (se ainda não tiver) em [vercel.com](https://vercel.com).
2.  **Instale a Vercel CLI** (opcional) ou conecte o seu repositório GitHub.
3.  **Configuração de Variáveis de Ambiente**:
    No painel do Vercel, vá a **Settings > Environment Variables** e adicione as seguintes chaves (copie os valores do seu `.env` ou do painel do Supabase):
    -   `VITE_SUPABASE_URL`
    -   `VITE_SUPABASE_ANON_KEY`
    -   `GEMINI_API_KEY` (Se estiver a usar IA)

4.  **Comando de Build**:
    O Vercel deve detetar automaticamente, mas se perguntar:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
    -   **Install Command**: `npm install`

5.  **Deploy**:
    Se estiver a usar a CLI, basta correr `vercel` na pasta raiz. Se estiver a usar o GitHub, o Vercel fará o deploy automático a cada "push".

### Notas:
-   O arquivo `vercel.json` já está configurado para lidar com as rotas (SPA), evitando erros de "404" ao atualizar a página.
-   Como o site utiliza o Supabase para a base de dados, não precisa de configurar um servidor backend no Vercel; tudo funciona diretamente no navegador do cliente.
