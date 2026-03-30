# Última Muralha v1.0

Jogo **Tower Defense 2D** feito em **HTML + CSS + JavaScript puro**.

## 🎮 Como jogar

1. Abra o projeto em um servidor local.
2. No **menu inicial**, escolha a fase e a dificuldade.
3. Clique em **Iniciar defesa**.
4. Escolha uma torre no painel lateral ou nos botões móveis.
5. Toque/clique nos círculos do mapa para construir.
6. Inicie as ondas e sobreviva o máximo possível.

## ▶️ Como rodar

```bash
cd /workspaces/jogo-teste
python3 -m http.server 8000
```

Depois abra no navegador:

```text
http://localhost:8000
```

## 📦 Instalar no celular

A versão `v1.0` pode ser instalada como **app web**:

1. abra o jogo no navegador do celular
2. toque em **Baixar no celular** ou use o menu do navegador
3. escolha **Adicionar à tela inicial** / **Instalar app**
4. jogue também em modo quase offline

## ⌨️ Controles

- `1-6`: selecionar torres
- `N`: iniciar próxima onda
- `F`: ativar pulso orbital
- `V`: alternar velocidade da simulação
- `A`: ligar/desligar auto rodada
- `P`: pausar / retomar

## ✨ Destaques

- menu inicial com seleção de **fase** e **dificuldade**
- 3 fases jogáveis com layouts diferentes e número próprio de rodadas
- suporte a **celular** com toque no mapa, instalação como app e botões rápidos
- opção de **auto rodada** para avançar automaticamente se o jogador quiser
- 6 tipos de torres, incluindo o `Nexus de Comando`
- upgrades e venda de torres
- ondas progressivas com modificadores táticos
- inimigos com escudo, divisão, fase fantasma e mini-boss
- habilidade especial de pulso orbital
- HUD de chefe, preview da próxima onda e log em tempo real