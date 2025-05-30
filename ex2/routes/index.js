const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = 'http://localhost:25000';

// Página principal - lista de edições
router.get('/', async (req, res) => {
  try {
    console.log(`A interface web está a ligar-se ao backend em ${API_URL}`);

    const response = await axios.get(`${API_URL}/edicoes/completo`, {
      params: req.query // Passa os parâmetros de consulta, se houver
    });
    console.log(`Resposta recebida do backend: ${response.data.length} registos`);
    const edicoes = response.data;
    res.render('index', { edicoes });
  } catch (error) {
    console.error('Erro ao obter lista de edições:', error.message);
    res.status(500).render('error', { error: 'Erro ao carregar edições: ' + error.message });
  }
});

// Página de país
router.get('/paises/:pais', async (req, res) => {
  try {
    const pais = req.params.pais;
    console.log(`Buscando informações para o país: ${pais}`);
    
    // Obter países organizadores
    const orgResponse = await axios.get(`${API_URL}/paises?papel=org`);
    console.log(`Obtidos ${orgResponse.data.length} países organizadores`);
    const organizador = orgResponse.data.find(p => p.pais === pais) || { pais, anos: [] };
    
    // Obter países vencedores
    const vencResponse = await axios.get(`${API_URL}/paises?papel=venc`);
    console.log(`Obtidos ${vencResponse.data.length} países vencedores`);
    const vencedor = vencResponse.data.find(p => p.pais === pais) || { pais, anos: [] };
    
    // Obter todas as edições completas (com ID)
    const edicoesResponse = await axios.get(`${API_URL}/edicoes/completo`);
    const todasEdicoes = edicoesResponse.data;
    console.log(`Obtidas ${todasEdicoes.length} edições completas`);
    
    // Lista para armazenar organizações
    const organizacoes = [];
    
    // Para cada ano em que o país organizou, obter detalhes da edição
    for (const ano of organizador.anos) {
      // Encontrar a edição correspondente ao ano
      const edicao = todasEdicoes.find(e => e.anoEdição === ano || e.ano === ano);
      if (edicao) {
        console.log(`Encontrada edição para o ano ${ano}: ${edicao.id}`);
        organizacoes.push({
          id: edicao.id,
          ano: edicao.anoEdição || edicao.ano,
        });
      }
    }
    
    // Lista para armazenar participações
    const participacoes = [];
    
    // Como já temos todas as edições completas com músicas, podemos processar diretamente
    for (const edicao of todasEdicoes) {
      // Verificar participações do país nas músicas
      if (edicao.musicas && Array.isArray(edicao.musicas)) {
        for (const musica of edicao.musicas) {
          if (musica.país === pais) {
            participacoes.push({
              id: edicao.id,
              ano: edicao.anoEdição || edicao.ano,
              titulo: musica.título || 'N/A',
              interprete: musica.intérprete || 'N/A',
              vencedor: edicao.vencedor === pais
            });
            console.log(`Encontrada participação do país ${pais} na edição ${edicao.id}`);
          }
        }
      }
    }
    
    // Ordenar participações por ano
    participacoes.sort((a, b) => {
      const anoA = parseInt(a.ano);
      const anoB = parseInt(b.ano);
      return anoA - anoB;
    });
    
    // Renderizar a página
    res.render('pais', { 
      pais,
      participacoes,
      organizadas: organizacoes
    });
    
  } catch (error) {
    console.error(`Erro ao processar dados do país ${req.params.pais}:`, error);
    res.status(500).render('error', { 
      error: `Erro ao carregar informações do país: ${error.message}` 
    });
  }
});

// Página de edição individual por ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Obtendo detalhes da edição ${id}`);
    
    const response = await axios.get(`${API_URL}/edicoes/${id}`);
    
    if (!response.data) {
      console.log(`Edição ${id} não encontrada`);
      return res.status(404).render('error', { error: 'Edição não encontrada' });
    }
    
    const edicao = response.data;
    console.log(`Edição ${id} encontrada, renderizando página`);
    res.render('edicao', { edicao });
    
  } catch (error) {
    console.error(`Erro ao obter edição ${req.params.id}:`, error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).render('error', { error: 'Edição não encontrada' });
    } else {
      res.status(500).render('error', { error: 'Erro ao carregar edição: ' + error.message });
    }
  }
});

module.exports = router;