import json
import os

def limpar_json(caminho_entrada, caminho_saida=None, como_array=False):
    """
    Função para limpar e estruturar um JSON do Eurovision para uso como base de dados
    
    Args:
        caminho_entrada: Caminho do arquivo JSON original
        caminho_saida: Caminho onde salvar o arquivo limpo (opcional)
        como_array: Se True, salva como array de objetos em vez de dicionário
    """
    # Definir caminho de saída se não especificado
    if caminho_saida is None:
        nome_base = os.path.splitext(caminho_entrada)[0]
        sufixo = "_array" if como_array else "_limpo"
        caminho_saida = f"{nome_base}{sufixo}.json"
    
    # Carregar os dados JSON
    try:
        with open(caminho_entrada, 'r', encoding='utf-8') as f:
            dados = json.load(f)
    except json.JSONDecodeError:
        print("Erro: O arquivo não contém um JSON válido.")
        return None
    except FileNotFoundError:
        print(f"Erro: O arquivo '{caminho_entrada}' não foi encontrado.")
        return None
    
    # Dados limpos
    dados_limpos = {}
    
    # Para cada edição do Eurovision
    for id_edicao, edicao in dados.items():
        # Criar estrutura para a edição limpa
        edicao_limpa = {
            "id": edicao.get("id", id_edicao),
            "ano": edicao.get("anoEdição", "").strip(),
            "organizacao": edicao.get("organizacao", "").replace("_", " "),
            "vencedor": edicao.get("vencedor", "").replace("_", " ") if "vencedor" in edicao else None,
            "musicas": []
        }
        
        # Processar músicas se existirem
        if "musicas" in edicao and isinstance(edicao["musicas"], list):
            musicas_processadas = []
            for musica in edicao["musicas"]:
                # Limpar e normalizar cada música
                if isinstance(musica, dict):
                    musica_limpa = {}
                    for chave, valor in musica.items():
                        if isinstance(valor, str):
                            # Limpar strings e converter vazias para null
                            valor_limpo = valor.strip()
                            musica_limpa[chave] = valor_limpo if valor_limpo else None
                        else:
                            musica_limpa[chave] = valor
                    
                    if musica_limpa:  # Adicionar apenas se não estiver vazio
                        musicas_processadas.append(musica_limpa)
            
            edicao_limpa["musicas"] = musicas_processadas
        
        # Adicionar ao dicionário de dados limpos
        dados_limpos[id_edicao] = edicao_limpa
    
    # Converter para array se solicitado
    dados_para_salvar = list(dados_limpos.values()) if como_array else dados_limpos
    
    # Salvar o JSON limpo
    with open(caminho_saida, 'w', encoding='utf-8') as f:
        json.dump(dados_para_salvar, f, ensure_ascii=False, indent=2)
    
    print(f"JSON limpo salvo em: {caminho_saida}")
    return dados_limpos

if __name__ == "__main__":
    arquivo_json = "dataset.json"
    
    # Gerar apenas a versão array (para MongoDB)
    dados_limpos = limpar_json(arquivo_json, como_array=True)